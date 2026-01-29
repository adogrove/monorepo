import {
  HttpContextFactory,
  RequestFactory,
} from '@adonisjs/core/factories/http'
import { test } from '@japa/runner'
import { GeoLite2Factory } from '../factories/geolite2_factory.js'
import type { GeoLite2 } from '../src/geolite2.js'

const IP = '8.8.8.8'

test.group('Geolite2', (group) => {
  group.tap((t) => t.timeout(20_000))

  let geolite2: GeoLite2

  group.setup(async () => {
    const request = new RequestFactory()
      .merge({ config: { getIp: () => IP } })
      .create()
    const ctx = new HttpContextFactory().merge({ request }).create()
    const { geolite2: g2, cleanup } = await new GeoLite2Factory()
      .merge({ ctx })
      .create()

    geolite2 = g2

    return () => cleanup()
  })

  test('resolves country by passing an IP address', async ({ assert }) => {
    const country = geolite2.country(IP)
    assert.isNotNull(country)
  })

  test('resolves city by passing an IP address', async ({ assert }) => {
    const city = geolite2.city(IP)
    assert.isNotNull(city)
  })

  test('resolves ASN by passing an IP address', async ({ assert }) => {
    const asn = geolite2.asn(IP)
    assert.isNotNull(asn)
  })

  test('resolves country through request', async ({ assert }) => {
    const country = geolite2.country()
    assert.isNotNull(country)
  })

  test('resolves city through request', async ({ assert }) => {
    const city = geolite2.city()
    assert.isNotNull(city)
  })

  test('resolves ASN through request', async ({ assert }) => {
    const asn = geolite2.asn()
    assert.isNotNull(asn)
  })
})
