# Introduction
`@adogrove/adonis-cap` is an AdonisJS integration for [Cap](https://capjs.js.org/), a lightweight, modern open-source CAPTCHA alternative designed using SHA-256 Proof-of-Work challenges.

Instead of image-based CAPTCHAs, Cap asks the client's browser to solve a small computational puzzle, making it privacy-friendly and invisible to users.

The package provides:
- Route registration for challenge/redeem endpoints
- Configurable storage layer for challenges and tokens
- VineJS validation rule for Cap tokens
- A custom store API if you need to bring your own storage