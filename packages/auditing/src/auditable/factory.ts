import type { ApplicationService, EmitterService } from '@adonisjs/core/types'
import {
  afterCreate,
  afterDelete,
  afterUpdate,
  type BaseModel,
  beforeCreate,
  beforeDelete,
  beforeUpdate,
} from '@adonisjs/lucid/orm'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import Audit from '../audit.js'
import {
  E_AUDITABLE_CANNOT_REVERT,
  E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES,
  E_AUDITABLE_LOAD_NULL,
  E_AUDITABLE_WRONG_INSTANCE,
  E_AUDITABLE_WRONG_TYPE,
} from '../errors.js'
import type { AuditingService } from '../types.js'
import type { NormalizeConstructor } from '../utils/normalized_constructor.js'
import type { EventType } from './events.js'

export interface AuditsCursor extends Promise<Audit[]> {
  first: () => Promise<Audit | null>
  last: () => Promise<Audit | null>
}

const emitterCache = new WeakMap<
  ApplicationService['container'],
  EmitterService
>()

const auditingCache = new WeakMap<
  ApplicationService['container'],
  AuditingService
>()

async function getServices() {
  const app = await import('@adonisjs/core/services/app').then((m) => m.default)

  const emitter = emitterCache.get(app.container)
  const auditing = auditingCache.get(app.container)

  if (emitter !== undefined && auditing !== undefined) {
    return { emitter, auditing }
  }

  const [resolvedEmitter, resolvedAuditing] = await Promise.all([
    emitter ?? app.container.make('emitter'),
    auditing ?? app.container.make('auditing.manager'),
  ])

  emitterCache.set(app.container, resolvedEmitter)
  auditingCache.set(app.container, resolvedAuditing)

  return { emitter: resolvedEmitter, auditing: resolvedAuditing }
}

export function withAuditable() {
  return <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
    class ModelWithAudit extends superclass {
      audits() {
        const audits = Audit.query()
          .where('auditableType', this.constructor.name)
          // biome-ignore lint/suspicious/noExplicitAny: wip
          .where('auditableId', (this as any).id)
        const promise = Promise.resolve(audits.clone())
        Object.defineProperty(promise, 'first', {
          value: async () => audits.clone().first(),
        }).catch((e) => console.error(e))

        Object.defineProperty(promise, 'last', {
          value: async () => audits.clone().orderBy('id', 'desc').first(),
        }).catch((e) => console.error(e))

        return promise as AuditsCursor
      }

      transitionTo(audit: Audit, valuesType: 'old' | 'new') {
        if (audit.auditableType !== this.constructor.name) {
          throw new E_AUDITABLE_WRONG_TYPE([
            this.constructor.name,
            audit.auditableType,
          ])
        }

        // biome-ignore lint/suspicious/noExplicitAny: <wip>
        if (audit.auditableId !== (this as any).id) {
          throw new E_AUDITABLE_WRONG_INSTANCE([
            // biome-ignore lint/suspicious/noExplicitAny: <wip>
            (this as any).id,
            `${audit.auditableId}`,
          ])
        }

        const values = valuesType === 'old' ? audit.oldValues : audit.newValues
        if (values === null) {
          throw new E_AUDITABLE_LOAD_NULL([valuesType])
        }

        // Key incompatibilities
        const incompatibilities = Object.keys(values).filter(
          (element) => !Object.keys(this.$attributes).includes(element),
        )
        if (incompatibilities.length > 0) {
          throw new E_AUDITABLE_INCOMPATIBLE_ATTRIBUTES([
            incompatibilities[0],
            audit.auditableType,
            incompatibilities[0],
          ])
        }

        for (const key in values) {
          this.$attributes[key] = values[key]
        }
      }

      async revert() {
        const lastAudit = await this.audits().last()
        if (lastAudit === null) {
          throw new E_AUDITABLE_CANNOT_REVERT()
        }
        this.transitionTo(lastAudit, 'old')
      }

      $auditValuesToSave: ModelObject = {}

      $backupAuditValues() {
        this.$auditValuesToSave = this.$original
      }

      async $audit(event: EventType, modelInstance: ModelWithAudit) {
        const { emitter, auditing } = await getServices()

        const [auditedUser, metadata] = await Promise.all([
          auditing.getUserForContext(),
          auditing.getMetadataForContext(),
        ])

        const audit = new Audit()
        audit.userType = auditedUser?.type ?? null
        audit.userId = auditedUser?.id ?? null
        audit.event = event
        audit.auditableType = modelInstance.constructor.name
        // biome-ignore lint/suspicious/noExplicitAny: any
        audit.auditableId = (modelInstance as any).id
        audit.oldValues = event === 'create' ? null : this.$auditValuesToSave
        audit.newValues = event === 'delete' ? null : this.$attributes
        audit.metadata = metadata
        await audit.save()

        await emitter.emit(`audit:${event}`, audit.id)
      }

      @beforeCreate()
      static async beforeSaveHook(modelInstance: ModelWithAudit) {
        modelInstance.$backupAuditValues()
      }

      @afterCreate()
      static afterSaveHook(modelInstance: ModelWithAudit) {
        return modelInstance.$audit('create', modelInstance)
      }

      @beforeUpdate()
      static async beforeUpdateHook(modelInstance: ModelWithAudit) {
        modelInstance.$backupAuditValues()
      }

      @afterUpdate()
      static afterUpdateHook(modelInstance: ModelWithAudit) {
        return modelInstance.$audit('update', modelInstance)
      }

      @beforeDelete()
      static async beforeDeleteHook(modelInstance: ModelWithAudit) {
        modelInstance.$backupAuditValues()
      }

      @afterDelete()
      static afterDeleteHook(modelInstance: ModelWithAudit) {
        return modelInstance.$audit('delete', modelInstance)
      }
    }

    return ModelWithAudit
  }
}
