import type { HttpContext } from '@adonisjs/core/http'
import type { AsnResponse, CityResponse, CountryResponse } from 'maxmind'
import type { GeoLite2Contract, Readers } from './types.js'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    geolite2: GeoLite2Contract
  }
}

export class GeoLite2 implements GeoLite2Contract {
  constructor(
    private ctx: HttpContext,
    private readers: Readers,
  ) {}

  country(ip?: string): CountryResponse | null {
    ip = this.ipOrRequestIp(ip)
    return this.readers.country.get(ip)
  }

  city(ip?: string): CityResponse | null {
    ip = this.ipOrRequestIp(ip)
    return this.readers.city.get(ip)
  }

  asn(ip?: string): AsnResponse | null {
    ip = this.ipOrRequestIp(ip)
    return this.readers.asn.get(ip)
  }

  private ipOrRequestIp(ip?: string): string {
    return ip ?? this.ctx.request.ip()
  }
}
