import * as geolite2Redist from 'geolite2-redist'
import { GeoIpDbName } from 'geolite2-redist'
import maxmind, {
  type AsnResponse,
  type CityResponse,
  type CountryResponse,
} from 'maxmind'
import type { Readers, ResolvedGeoLite2Config } from './types.js'

export default class GeoLite2Manager {
  private readers: Readers | null = null
  private onClose: () => void = () => {}

  constructor(protected config: ResolvedGeoLite2Config) {}

  async init() {
    if (this.readers !== null) {
      return
    }
    this.readers = await this.initReaders()
  }

  close() {
    this.onClose()
  }

  getReaders() {
    if (this.readers === null) {
      throw new Error('GeoLite2 readers are not initialized')
    }

    return this.readers
  }

  private async initReaders() {
    const country = await this.openDb<CountryResponse>(GeoIpDbName.Country)
    const city = await this.openDb<CityResponse>(GeoIpDbName.City)
    const asn = await this.openDb<AsnResponse>(GeoIpDbName.ASN)

    this.onClose = () => {
      country?.close()
      city?.close()
      asn?.close()
    }

    return { country, city, asn }
  }

  private openDb<T extends maxmind.Response>(db: GeoIpDbName) {
    return geolite2Redist.open(
      db,
      (path) =>
        maxmind.open<T>(path, {
          cache: { max: this.config.cache },
          watchForUpdates: true,
          watchForUpdatesNonPersistent: true,
        }),
      this.config.downloadDirectory,
    )
  }
}
