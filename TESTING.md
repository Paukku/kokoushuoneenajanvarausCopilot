# TESTING.md

## Yleiskuvaus

Tämä dokumentti määrittelee testausvaatimukset kokoushuoneiden varausrajapinnalle. Testauksen tavoitteena on varmistaa, että järjestelmä toimii oikein myös poikkeus- ja reunatapauksissa.

---

## Yleiset testausperiaatteet

- Automatisoidut testit
- Deterministiset ja toistettavat
- Testit eivät riipu toisistaan
- Jokainen testi alustaa oman datansa
- In-memory-tietovarasto

---

## Perustoiminnallisuuden testit

### Varauksen luonti
- Onnistuu validilla syötteellä
- Varaustunnus palautetaan
- Varaus tallentuu oikealle huoneelle

### Varauksen peruutus
- Onnistuu validilla varaustunnuksella
- Varaus poistuu tietovarastosta

### Varausten katselu
- Palauttaa huoneen varaukset
- Aikajärjestys on oikea

---

## Edge case -testit

### Aikavälit
- Varaus alkaa täsmälleen nykyhetkellä
- Varaus päättyy täsmälleen toisen aloitushetkeen
- Varaus alkaa täsmälleen toisen lopetushetkellä
- Yhden minuutin varaus
- Useita päiviä kestävä varaus
- Aloitusaika millisekunnin lopetusta myöhemmin (hylätään)

---

### Päällekkäisyys
- Osittainen päällekkäisyys alussa
- Osittainen päällekkäisyys lopussa
- Täysi päällekkäisyys
- Sisäkkäinen varaus
- Sama aika eri huoneissa (sallittu)

---

### Varaaja
- Nimi vain välilyöntejä
- Sähköposti välilyönneillä
- Sama sähköposti eri kirjainkoolla
- Erittäin pitkä nimi
- Erittäin pitkä mutta validi sähköposti

---

### Varaustunnus
- Yksilöllisyys useissa varauksissa
- 6 merkin pituus
- Sallittu merkkijoukko
- Case-insensitive käyttö peruutuksessa

---

### Huoneet
- Tyhjä huonetunniste
- Tuntematon huone
- Huone ilman varauksia

---

### Virheenkäsittely
- Yhtenäinen virherakenne
- Virhekoodi vastaa tilannetta
- ISO 8601 -aikaleima
- Ei sisäisiä tietoja virheissä

---

### Aikaleimat
- Puuttuva aikavyöhyke
- Väärä formaatti
- Virheellinen päivämäärä
- Virheellinen kellonaika

---

## Ei-testattavat asiat

- Suorituskyky
- Kuormitus
- UI
- Tietoturva

---

## Testauksen tavoite

Varmistaa, että:
- Liiketoimintasäännöt toteutuvat
- Virhetilanteet ovat ennustettavia
- Reunatapaukset on huomioitu
- Toteutus vastaa README.md-määrittelyä
