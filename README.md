# Kokoushuoneiden varausrajapinta

REST-tyyppinen rajapinta kokoushuoneiden varaamiseen. Sovellus toteutettu TypeScriptilla Node.js-ympäristössä.

## Asennus ja käynnistys

```bash
# Asenna riippuvuudet
npm install

# Kehityskäynnistys (ライブreload)
npm run dev

# Testit
npm test

# Käännä tuotantoon
npm run build

# Käynnistä rakennettu sovellus
npm start
```

## API-päätepisteet

### Huoneiden listaaminen
```
GET /rooms
```
Palauttaa kaikki saatavilla olevat kokoushuoneet.

**Vastaus:**
```json
[
  {
    "id": "room-1",
    "name": "Neuvotteluhuone 1"
  }
]
```

### Huoneen varausten listaaminen
```
GET /rooms/:roomId/bookings
```
Palauttaa huoneen varaukset aikajärjestyksessä.

**Vastaus:**
```json
[
  {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "id": "ABC123",
    "roomId": "room-1",
    "start": "2026-01-22T14:00:00Z",
    "end": "2026-01-22T15:00:00Z",
    "booker": {
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-01-22T10:30:00Z"
  }
]
```

### Varauksen luonti
```
POST /bookings
```

**Pyyntö:**
```json
{
  "roomId": "room-1",
  "start": "2026-01-22T14:00:00Z",
  "end": "2026-01-22T15:00:00Z",
  "bookerName": "John Doe",
  "bookerEmail": "john@example.com"
}
```

**Vastaus (201 Created):**
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "id": "ABC123",
  "roomId": "room-1",
  "start": "2026-01-22T14:00:00Z",
  "end": "2026-01-22T15:00:00Z",
  "booker": {
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2026-01-22T10:30:00Z"
}
```

### Varauksen peruutus
```
DELETE /bookings/:id
```

Peruuttaa varauksen tunnisteella. **Vastaus (204 No Content)**

## Virheenkäsittely

Kaikki virheet palautetaan samassa muodossa:

```json
{
  "code": "BOOKING_OVERLAP",
  "message": "Aikaväli menee päällekkäin olemassa olevan varauksen kanssa",
  "timestamp": "2026-01-22T10:30:00Z"
}
```

### Virhekoodit ja HTTP-statuskoodit

| Koodi | Kuvaus | HTTP-status |
|-------|--------|-------------|
| MISSING_REQUIRED_FIELD | Pakollinen kenttä puuttuu | 400 |
| INVALID_EMAIL | Virheellinen sähköpostiosoite | 400 |
| INVALID_NAME | Nimi on tyhjä tai pelkkää välilyöntejä | 400 |
| INVALID_TIME_RANGE | Päivämäärä/aika virheellinen tai aloitus >= lopetus | 400 |
| BOOKING_IN_PAST | Varaus alkaa menneisyydessä | 400 |
| ROOM_NOT_FOUND | Huonetta ei löytynyt | 404 |
| BOOKING_NOT_FOUND | Varausta ei löytynyt | 404 |
| BOOKING_OVERLAP | Varaus menee päällekkäin toisen kanssa | 409 |

## Liiketoimintasäännöt

- Varaukset eivät voi mennä päällekkäin samassa huoneessa
- Varaukset eivät voi sijoittua menneisyyteen
- Aloitusaika tulee olla ennen lopetusaikaa
- Varaajan nimi ja sähköposti ovat pakollisia
- Sähköpostin tulee olla validi
- Varaustunnus on yksilöllinen 6-merkkinen tunnus
- Jokaisella varaajalla ja varauksella on UUID

## Testit

Projektissa on kattavat yksikkötestit:

- **basicFunctionality.test.ts** — varauksen luonti, peruutus ja katselu
- **timeIntervals.test.ts** — aikavälivalidointi ja reunatapaukset
- **overlaps.test.ts** — päällekkäisyyden havaitseminen
- **bookerValidation.test.ts** — varaajan validointi
- **bookingIdValidation.test.ts** — varaustunnuksen validointi
- **roomValidation.test.ts** — huoneen validointi
- **errorHandling.test.ts** — virheenkäsittely
- **timestamps.test.ts** — aikaleiman validointi

Testien ajaminen:

```bash
npm test
npm test -- --watch  # Valvontamodi
```