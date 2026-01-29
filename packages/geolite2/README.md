<div align="center">
  <img src="https://user-images.githubusercontent.com/2575182/236930626-40d7d2a8-2ded-4f72-a9e8-d8f4ce43ec79.png" />
  <h3>@stouder-io/adonis-geolite2</h3>
  <p>Maxmind's GeoLite2 integration for Adonis</p>
  <a href="https://www.npmjs.com/package/@stouder-io/adonis-geolite2">
    <img src="https://img.shields.io/npm/v/@stouder-io/adonis-geolite2.svg?style=for-the-badge&logo=npm" />
  </a>
  <img src="https://img.shields.io/npm/l/@stouder-io/adonis-geolite2?color=blueviolet&style=for-the-badge" />
  <img alt="npm" src="https://img.shields.io/npm/dt/@stouder-io/adonis-geolite2?style=for-the-badge">
</div>

## Legal Warning
This package uses [geolite2-redist](https://www.npmjs.com/package/geolite2-redist) and thus, you MUST comply with it specific conditions. For more information please check their [npm page](https://www.npmjs.com/package/geolite2-redist#user-content-legal-warning).

## Installation
```
node ace add @stouder-io/adonis-geolite2
```

Alternatively, you can install it manually.
```
npm i @stouder-io/adonis-geolite2
```

If installed manually, you need to manually run the configuration command.
```
node ace configure @stouder-io/adonis-geolite2
```

## Usage
The geolite2 is automatically attached to HTTP requests, allowing you to use it to retrieves informations about the geolocation of requesting IPs.
```ts
router.get('/', ({ geolite2 }: HttpContext) => {
  const country = geolite2.country()
  const city = geolite2.city()
  const asn = geolite2.asn()

  return { country, city, asn }
})
```

If no parameter is provided to the functions, it uses [`request.ip()`](https://docs.adonisjs.com/guides/request#request-ip-address). Alternatively you can pass the IP you want to lookup.

```ts
router.get('/', ({ geolite2 }: HttpContext) => {
  const country = geolite2.country('8.8.8.8')
  const city = geolite2.city('8.8.8.8')
  const asn = geolite2.asn('8.8.8.8')

  return { country, city, asn }
})
```
