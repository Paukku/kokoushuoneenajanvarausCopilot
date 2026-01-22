PROMPTI: Älä tee minulle koodia vaan auta minua luomaan vaatimusmäärittely yksinkertaiselle kokoushuoneiden varausrajapinnalle.

Alustavasti se on näin:
Teknologiat: TypeScript, node.js, in-memory database

Business rules
● Varaukset eivät saa mennä päällekkäin (kaksi henkilöä ei voi varata samaa huonetta
samaan aikaan).
● Varaukset eivät voi sijoittua menneisyyteen.
● Aloitusajan täytyy olla ennen lopetusaikaa.

Palvelun tarjoamat toiminnot:
Varauksen luonti: Varaa huone tietylle aikavälille
Varauksen peruutus: Poista varaus
Varausten katselu: Listaa kaikki tietyn huoneen varaukset

ChatGPT-5
Hyvä lähtökohta 👌 Tehdään tästä selkeä ja uskottava vaatimusmäärittely, sellainen jota voisi oikeasti käyttää toteutuksen pohjana (tai näyttää vaikka harkkatyössä / portfolioprojektissa).

Alla on ehdotus rakenteeksi + sisältö. Tämä ei ole koodia, vaan mitä järjestelmän pitää tehdä ja millä ehdoilla.

1. Yleiskuvaus

Järjestelmä tarjoaa yksinkertaisen rajapinnan kokoushuoneiden varaamiseen.
Rajapintaa käytetään huonevarausten luontiin, peruutukseen ja tarkasteluun.
Tieto säilytetään vain sovelluksen muistissa (in-memory), eikä se ole pysyvää.

Järjestelmä ei sisällä käyttäjähallintaa tai autentikointia.

2. Teknologiat ja rajaukset

Ohjelmointikieli: TypeScript
Ajoympäristö: Node.js
Tietovarasto: In-memory database
Rajapintatyyppi: REST-tyyppinen HTTP-rajapinta
Tietojen pysyvyys:
Varaukset katoavat palvelun uudelleenkäynnistyksessä

3. Käsitteet ja tietomallit (käsitteellisellä tasolla)
Kokoushuone
Yksilöidään huoneen tunnisteella (esim. roomId)
Huoneita oletetaan olevan ennalta määritelty määrä
Varaus
Varauksella on vähintään seuraavat tiedot:
Varaustunniste
Huoneen tunniste
Varausajan alkuhetki
Varausajan loppuhetki
Varauksen luontiaika

4. Liiketoimintasäännöt (Business rules)

Päällekkäisyyskielto
Kaksi varausta eivät saa olla päällekkäin samassa huoneessa.
Päällekkäisyys tarkoittaa, että aikavälit leikkaavat toisensa edes osittain.
Ei varauksia menneisyyteen
Varauksen aloitusaika ei saa olla nykyhetkeä aikaisempi.
Aikavälin eheys
Varauksen aloitusajan täytyy olla ennen lopetusaikaa.
Yhtä pitkät alku- ja loppuajat eivät ole sallittuja.
Huonekohtaisuus
Päällekkäisyystarkistus tehdään aina huonekohtaisesti.
Eri huoneissa voi olla samanaikaisia varauksia.

5. Toiminnalliset vaatimukset
5.1 Varauksen luonti

Kuvaus:
Mahdollistaa kokoushuoneen varaamisen tietylle aikavälille.

Syötteet:
Huoneen tunniste
Aloitusaika
Lopetusaika

Toiminta:
Järjestelmä validoi syötteet
Järjestelmä tarkistaa liiketoimintasäännöt
Jos säännöt täyttyvät, varaus tallennetaan

Virhetilanteet:
Varaus on menneisyydessä
Aloitusaika ei ole ennen lopetusaikaa
Aikaväli menee päällekkäin olemassa olevan varauksen kanssa
Huonetta ei ole olemassa

5.2 Varauksen peruutus

Kuvaus:
Mahdollistaa olemassa olevan varauksen poistamisen.

Syötteet:
Varaustunniste

Toiminta:

Järjestelmä etsii varauksen
Varaus poistetaan tietovarastosta

Virhetilanteet:
Varausta ei löydy annetulla tunnisteella

5.3 Varausten katselu

Kuvaus:
Listaa kaikki tietyn huoneen varaukset.

Syötteet:
Huoneen tunniste

Toiminta:
Järjestelmä palauttaa kaikki huoneeseen liittyvät varaukset
Varaukset palautetaan aikajärjestyksessä

Virhetilanteet:
Huonetta ei ole olemassa

6. Ei-toiminnalliset vaatimukset
Rajapinnan tulee palauttaa selkeät virheilmoitukset
Aikamuodot käsitellään yhtenäisessä formaatissa (esim. ISO 8601)
Rajapinta on deterministinen (sama syöte → sama lopputulos)
Toteutus pidetään yksinkertaisena ja helposti laajennettavana

7. Mahdolliset jatkokehityskohteet (ei osa nykyistä versiota)
Käyttäjähallinta ja autentikointi
Varausten muokkaaminen
Pysyvä tietokanta
Aikavyöhykkeiden tuki
Huoneiden kapasiteetti ja lisätiedot

Jos haluat, seuraavaksi voidaan:
🔹 tiivistää tämä yhden sivun speksiksi
🔹 muotoilla tästä API-vaatimukset (endpointit sanallisesti)
🔹 tehdä tästä tekninen tehtävänanto junior-/harjoitustyöhön
🔹 tai tarkistaa, että tämä vastaa jonkun tietyn kurssin / haun vaatimuksia

Sano vain mihin suuntaan mennään 😊



PROMPTI: Haluan lisätä tähän, että huoneiden tiedot on ennalta määrätty ja huoneita on vaikka 5 kpl

ChatGPT:
Hyvä lisäys 👍 Tämä tarkentaa kokonaisuutta ja poistaa monta oletusta toteutuksesta. Alla on täsmällinen tapa lisätä tämä vaatimusmäärittelyyn, ilman että koko dokumentti menee uusiksi.

Voit joko korvata tai täydentää seuraavat kohdat.

Lisäys / tarkennus kohtaan 1. Yleiskuvaus

Voit lisätä esim. tämän kappaleen:

Järjestelmässä on ennalta määritelty joukko kokoushuoneita.
Huoneiden määrä on kiinteä (esimerkiksi 5 huonetta), eikä rajapinta tarjoa toimintoja huoneiden luontiin, muokkaukseen tai poistoon.

Tarkennus kohtaan 3. Käsitteet ja tietomallit
Kokoushuone (päivitetty)

Kokoushuoneet ovat ennalta määriteltyjä

Huoneiden lukumäärä on rajattu (esim. 5 kpl)

Jokaisella huoneella on:

Yksilöllinen tunniste (esim. roomId)

Nimi tai tunniste, joka on ihmiselle luettava (esim. "Neuvotteluhuone 1")

Huoneiden tietoja ei voi muuttaa rajapinnan kautta.

Tarkennus kohtaan 5. Toiminnalliset vaatimukset
Yleinen validointisääntö (uusi)

Kaikissa toiminnoissa, joissa käytetään huoneen tunnistetta:

Järjestelmä tarkistaa, että huone kuuluu ennalta määriteltyihin huoneisiin

Jos huonetta ei ole olemassa, pyyntö hylätään virheellä

Tämä koskee erityisesti:
Varauksen luontia
Varausten katselua
Tarkennus ei-toiminnallisiin vaatimuksiin (valinnainen mutta hyvä)

Voit lisätä:

Huoneiden lista on alustettu palvelun käynnistyessä
Huoneiden määrä ja tiedot voidaan määritellä konfiguraatiossa
Miksi tämä on hyvä vaatimus? (taustaa sinulle)

Tämä lisäys:

✅ rajaa projektin järkeväksi (ei CRUDia huoneille)
✅ tekee päällekkäisyyssäännöstä yksiselitteisen
✅ näyttää, että osaat rajata tietoisesti eikä vain "unohtaa" ominaisuuksia
✅ on tosi realistinen monessa oikeassa järjestelmässä

Jos haluat, seuraavaksi voidaan:

✨ kirjoittaa tästä selkeä arviointikriteerit täyttävä speksi
✨ muuttaa tämä englanninkieliseksi tekniseksi dokumentiksi
✨ tai tarkistaa, miltä tämä näyttäisi rekrytoijan / opettajan silmin

Hyvältä näyttää – tämä on jo ihan “oikea” vaatimusmäärittely 💪