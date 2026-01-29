import type {
  AsnResponse,
  CityResponse,
  CountryResponse,
  Reader,
} from 'maxmind'

export type CountryReader = Reader<CountryResponse>
export type CityReader = Reader<CityResponse>
export type AsnReader = Reader<AsnResponse>

export interface Readers {
  country: CountryReader
  city: CityReader
  asn: AsnReader
}

export interface GeoLite2Contract {
  country(ip?: string): CountryResponse | null
  city(ip?: string): CityResponse | null
  asn(ip?: string): AsnResponse | null
}

export interface GeoLite2Config {
  downloadDirectory: string
  cache: number
}

export interface ResolvedGeoLite2Config {
  downloadDirectory: string
  cache: number
}
