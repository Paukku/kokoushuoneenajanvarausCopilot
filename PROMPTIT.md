Tässä esitehtävässä on käytetty kahta eri tekoälyä: ChatGPT luomaan vaatimuusmäärittelyä ja Copilot, jolle vaatimuusmäärittely annetaan ja joka luo vaatimusmäärittelyn pohjalta koodin. Tässä tiedostossa on Copilotin vastaukset. ChatGPTn vastaukset löytyvät VAATIMUUSMÄÄRITTELY.md -tiedostosta.

PROMPTI: Tee minulle kokoushuoneiden varausjärjestelmä API (lisätty VAATIMUUSMÄÄRITTELY.md)

I'll create a short TODO plan, then add project files and implement the API (TypeScript + Express).

Created 3 todos

Now I'll add project files and implement the API code. This will create TypeScript source files and config.

Patching files now — adding project files and source code. I'll apply the changes.

Applying project files and TypeScript source (creates config, src files, and README update).

Edited
tsconfig.json+13-1
Edited
.gitignore+4-1
Edited
package.json+23-1
Edited
models.ts+13-1
Edited
data.ts+56-1
Edited
index.ts+56-1
Edited
README.md+32-0
Now I'll mark the todo steps complete and show current plan status.

Completed: Initialize project files (1/3)

Progress update: Project files and API implemented. Next steps: run npm install and start with npm run dev to test locally.

Quick run instructions:

Install deps:
Run in dev (auto-reload):
Build & run:
Files added:

tsconfig.json
package.json
models.ts
data.ts
index.ts
.gitignore
Do you want me to run lint/build/tests (if you prefer), or commit these changes?

--

PROMPTI: Päivitä koodia vastaamaan näitä ja lisää testit vaatimusten mukaisesti (TESTING.md ja VAATIMUSMÄÄRITTELY.md)

AI:
Tarvitsen nähdä nykyisen koodin tilan. Luen tärkeimmät tiedostot.

Luen muut tiedostot:

Nyt ymmärrän koodin nykytilan. Tarvitaan:

Lisätä Booker-mallit (nimi, sähköposti)
Päivittää Booking-mallia (lisätä booker-tiedot)
Lisätä validaation (sähköposti, nimi, varausmerkinnät)
Generoida 6-merkkiset varaustunnukset uudivalue-tunnusten sijaan
Lisätä testit Jest-frameworkilla
Päivittää API-virheiden rakenteet (koodi + viesti + aikaleima)
Aloitan muutoksilla:

Edited
models.ts+12-0
Edited
errors.ts+26-2
Nyt päivitän bookingService:

Edited
bookingService.ts+77-18
Päivitän data.ts-tiedostoa (lisää booker-parametri ja generoi 6-merkkiset tunnukset):

Edited
data.ts+29-5
Nyt päivitän bookings-reitit:

Edited
bookings.ts+33-7
Edited
rooms.ts+14-4
Nyt lisään Jest ja luon testit. Ensin päivitän package.json:

Edited
package.json+7-4
Lisään Jest-konfiguraation:

Created jest.config.js

Nyt luon kattavat testit. Ensin luon testhakemiston ja perustestit:

Nyt asennoin riippuvuudet ja suoritan testit:

npm install
npm test 2>&1 | head -150
npm test
Korjaan TypeScript-virheen:

Edited
bookingService.ts+1-1
Copilot has been working on this problem for a while. It can continue to iterate, or you can send a new message to refine your prompt. Configure max requests.

Selected "Pause"
Let me know if there's anything else I can help with!

--
PROMPTI:

AI:
Näen VAATIMUSMÄÄRITTELY.md:ssä muutokset. Booleaan- ja Varaukselle on lisätty Uuid-kentät. Tehdään nämä muutokset koodiin. Ensin korjaan testit, sitten päivitän mallit.

npm test
npm test 2>&1
Korjaan testit. Ongelmat ovat:

Sähköpostin validaatio - välilyönnit pitää trimata ennen validaatiota
Timestamp-test - date-parsinta ongelmia
Edited
bookingService.ts+3-2
Edited
bookingService.ts+1-1
Edited
timestamps.test.ts+6-3
Edited
bookerValidation.test.ts+1-3
npm test
Hienoa! Kaikki testit menevät läpi. Nyt lisään Uuid-kentät VAATIMUKSET.md:n pohjalta:

Edited
models.ts+2-0
Nyt päivitän data.ts:ä generoidakseni UUIDit:

Edited
data.ts+1-0
Edited
data.ts+1-0
Nyt päivitän bookingService.ts:ä lisätäkseni UUID bookeriin:

Edited
bookingService.ts+1-0
Edited
bookingService.ts+1-0
Lisään uuid takaisin package.json-tiedostoon:

Edited
package.json+2-1
Edited
package.json+1-0
npm install
npm test
Loistava! Kaikki testit menevät läpi. Nyt kokeillaan rakentaa ja käynnistää sovellus:

npm run build
Luon README-dokumentaation API käytöstä:

Read README.md

Edited
README.md+148-17
Varmistetaan, että koodi kääntyy edelleen ja testit menevät läpi:

npm run build ; npm test 2>&1 | Select-Object -Last 20
Täydellinen! Kaikki testit menevät läpi. Tee yhteenveto toteutetusta:

✅ Muutokset valmis
Päivitettiin kokonainen koodi VAATIMUKSET.md:n ja TESTING.md:n vaatimusten mukaisesti:

Mallit (Models)
✅ Lisätty Booker.uuid UUID-kenttä varaajalle
✅ Lisätty Booking.uuid UUID-kenttä varaukselle
✅ Lisätty ApiErrorResponse virherakenteelle
Palvelut (Services)
✅ Validointi varaajan nimelle ja sähköpostille
✅ Sähköpostin trim ennen validaatiota
✅ Yhtenäinen virherakenne (code + message + timestamp)
✅ Virhekoodien vakiot (ErrorCodes enum)
✅ UUID-generaatiot bookerille ja varaukselle
Data-taso
✅ 6-merkkiset yksilölliset varaustunnukset (A-Z, 0-9)
✅ UUID-kirjasto käytössä
✅ clearBookings() testejä varten
Testit (50 testiä, kaikki menevät läpi)
✅ basicFunctionality.test.ts — varauksen luonti, peruutus, listaaminen
✅ timeIntervals.test.ts — reunatapaukset aikaväleille
✅ overlaps.test.ts — päällekkäisyyden tarkistus
✅ bookerValidation.test.ts — varaajan validointi
✅ bookingIdValidation.test.ts — varaustunnuksen validointi
✅ roomValidation.test.ts — huoneen validointi
✅ errorHandling.test.ts — virheenkäsittely
✅ timestamps.test.ts — aikaleiman validointi
Dokumentaatio
✅ Päivitetty README.md API:n käytölla
✅ Näytetään vaatimukset ja esimerkit
Sovellus rakennetaan onnistuneesti ja kaikki 50 testiä menevät läpi! ✨