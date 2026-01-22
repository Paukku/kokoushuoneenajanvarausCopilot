Käyttöohje

Asennus:

```bash
npm install
```

Kehityskäynnistys (ライブreload):

```bash
npm run dev
```

Käännä ja käynnistä tuotantona:

```bash
npm run build
npm start
```

API endpoints:

- `GET /rooms` — listaa kaikki huoneet
- `GET /rooms/:roomId/bookings` — listaa varaukset huoneelle (aikajärjestyksessä)
- `POST /bookings` — luo varauksen (JSON body: `roomId`, `start`, `end` — ISO 8601)
- `DELETE /bookings/:id` — peruuttaa varauksen

Virheilmoitukset ja validointi noudattavat README.md:n määritelmiä.