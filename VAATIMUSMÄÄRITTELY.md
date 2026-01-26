# Kokoushuoneiden varausrajapinta

## Yleiskuvaus

Tämä projekti tarjoaa yksinkertaisen REST-tyyppisen rajapinnan kokoushuoneiden varaamiseen. Rajapinnan avulla voidaan luoda, peruuttaa ja tarkastella kokoushuonevarauksia.

Järjestelmä ei sisällä käyttäjähallintaa, kirjautumista tai rekisteröitymistä. Kaikki tiedot säilytetään vain sovelluksen muistissa (in-memory), eikä tietoja tallenneta pysyvästi.

---

## Teknologiat ja rajaukset

- Ohjelmointikieli: TypeScript  
- Ajoympäristö: Node.js  
- Tietovarasto: In-memory database  
- Rajapintatyyppi: REST (HTTP)  
- Tietojen pysyvyys: Ei pysyvää tallennusta  

---

## Kokoushuoneet

Järjestelmässä on ennalta määritelty joukko kokoushuoneita.

- Huoneiden määrä on kiinteä (esimerkiksi 5 kpl)
- Jokaisella huoneella on:
  - Yksilöllinen tunniste (roomId)
  - Ihmiselle luettava nimi
- Rajapinta ei tarjoa toimintoja huoneiden luontiin, muokkaukseen tai poistoon
- Huoneiden tiedot alustetaan palvelun käynnistyessä

---

## Varaaja

Varaaja edustaa henkilöä, joka tekee kokoushuonevarauksen.

Varaajalla on seuraavat tiedot:
- Uuid
- Nimi
- Sähköpostiosoite

Vaatimukset:
- Ei kirjautumista tai rekisteröitymistä
- Tiedot annetaan varauksen yhteydessä
- Kentät eivät saa olla tyhjiä
- Sähköpostin tulee olla validi
- Varaaja yksilöidään sähköpostin perusteella
- Sama sähköposti ei luo uutta varaajaa

---

## Varaus

Varauksella on seuraavat tiedot:
- Uuid
- Varaustunnus
- Huoneen tunniste
- Aloitusaika
- Lopetusaika
- Varaajan tiedot
- Varauksen luontiaika

---

## Varaustunnus

- Järjestelmän luoma
- 6 merkkiä pitkä
- Sisältää vain kirjaimia ja numeroita
- Yksilöllinen
- Ei muokattavissa
- Käytetään varauksen peruutukseen

---

## Liiketoimintasäännöt

1. Varaukset eivät saa mennä päällekkäin samassa huoneessa  
2. Varaukset eivät voi sijoittua menneisyyteen  
3. Aloitusajan tulee olla ennen lopetusaikaa  
4. Päällekkäisyys tarkistetaan huonekohtaisesti  
5. Varaajan nimi ja sähköposti ovat pakollisia  
6. Sähköpostin tulee olla validi  
7. Varaaja tunnistetaan sähköpostilla  
8. Varaustunnus on yksilöllinen  

---

## Toiminnalliset vaatimukset

### Varauksen luonti

Syötteet:
- Huoneen tunniste
- Aloitusaika
- Lopetusaika
- Varaajan nimi
- Varaajan sähköposti

Toiminta:
1. Aikaväli validoidaan
2. Varaajan tiedot validoidaan
3. Huoneen olemassaolo tarkistetaan
4. Päällekkäisyydet tarkistetaan
5. Varaustunnus luodaan
6. Varaus tallennetaan

---

### Varauksen peruutus

Syöte:
- Varaustunnus

Toiminta:
- Varaus etsitään tunnuksella
- Varaus poistetaan

---

### Varausten katselu

Syöte:
- Huoneen tunniste

Toiminta:
- Palauttaa huoneen varaukset aikajärjestyksessä

---

## Virheviestit

### Yhtenäinen virherakenne

Kaikki virheet palautetaan samassa muodossa:
- Virhekoodi
- Virheviesti
- Aikaleima

### Virhekoodiesimerkkejä

- INVALID_TIME_RANGE  
- BOOKING_OVERLAP  
- BOOKING_IN_PAST  
- ROOM_NOT_FOUND  
- BOOKING_NOT_FOUND  
- INVALID_EMAIL  
- MISSING_REQUIRED_FIELD  

### HTTP-statuskoodit

- 400 Bad Request  
- 404 Not Found  
- 409 Conflict  
- 500 Internal Server Error  

---

## Aikaleimat

- ISO 8601 -formaatti
- UTC-aika

Formaatti:
YYYY-MM-DDTHH:mm:ssZ

Esimerkki:
2026-01-22T10:30:00Z

---

## Ei-toiminnalliset vaatimukset

- Selkeät virheilmoitukset
- Deterministinen toiminta
- Helposti laajennettava rakenne

---

## Mahdolliset jatkokehityskohteet

- Autentikointi
- Varausten muokkaus
- Pysyvä tietokanta
- Aikavyöhyketuki
- Huoneiden kapasiteetit
