# Usage
`geolite2` is automatically attached to HTTP requests, allowing you to use it to retrieves informations about the geolocation of requesting IP.
```ts
router.get('/', ({ geolite2 }: HttpContext) => {
  const country = geolite2.country()
  const city = geolite2.city()
  const asn = geolite2.asn()

  return { country, city, asn }
})
```

If no parameter is provided to the functions, it uses [`request.ip()`](https://docs.adonisjs.com/guides/request#request-ip-address).
Alternatively you can pass the IP you want to lookup.

```ts
router.get('/', ({ geolite2 }: HttpContext) => {
  const country = geolite2.country('8.8.8.8')
  const city = geolite2.city('8.8.8.8')
  const asn = geolite2.asn('8.8.8.8')

  return { country, city, asn }
})
```
