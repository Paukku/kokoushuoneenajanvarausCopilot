Analyysissa käyn kaksi eri tekoälyä läpi, koska projektissa on käytetty kahta eri tekoälyä. Vaatimuusmäärittelyn tekemiseen ChatGPT ja koodin tekemiseen Copilot. Aluksi käyn Copilotin läpi.

Mitä tekoäly teki hyvin?
Copilot loi hyvän pohjan yksinkertaisesta vaatimusmäärittelystä ja se toimi sellaisenaan ihan hyvin. Myös laajennetun vaatimuusmäärittelyn Copilot teki toimivaksi koodiksi ja osasi luoda kattavat testit ohjelmalle. Perusarkkitehtuuri ja nimeämiskäytäntö OK mielestäni, yhtä poikkeusta lukuunottamatta, jonka muutin (id -> reservationId).

Mitä tekoäly teki huonosti?
Välillä kun tekoäly muutti koodia niin se teki vääränlaisia ratkaisuja ja koodissa oli virheitä, joita se ei korjannut (commit: lisätty errorHandleri ja otetttu käyttöön tekoälyn avulla). Copilot ei myöskään ajatellut ohjelman skaalautuvuutta ja ylläpitoa. Joitain nimeämisongelmia oli, kuten ajanvarauskoodi olikin id, joka ei ole selkeä tietokannassa, jos joku muu katsoisi koodia. 

Copilot ei myöskään täysin noudattanut vaatimuusmäärittelyä. Vaatimusmäärittelyssä luki "Sama sähköposti ei luo uutta varaajaa" ja "Varaaja yksilöidään sähköpostin perusteella". Silti samalle sähköpostille pystyi luomaan eri nimiset henkilöt ja saman nimiselle henkilölle luotiin uusi tunnus. Testeihin Copilot kirjoitti tästä, että "Same email with different case - should be allowed".

Kun muokkasin itse koodia, siirsin validoinnin omaan middlewareen ja muutin CreateBookingInput interfacen start ja end: string -> Date niin Copilot ei osannut muuttaa testejä enää näihin ja olisi halunnut lisätä string | Date -määrittelyn.

Toki varmasti myös vaikuttaa paljon vaatimusmäärittely ja sen selkeys.

Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi

Siirsin validoinnin omaan middlewareen ja nimesin varauskoodin uudestaan (id -> reservationId). Nämä tehtiin ajatuksella, jos tätä haluttaisiin ylläpitää tai laajentaa tulevaisuudessa. Lisäksi validointi tapahtuu nyt ennen serverille siirtymistä, joten jos tiedot ovat puutteelliset, niin ohjelma ei turhaan etene koodissa eteenpäin business logiikkaan ja ajanvarauksen tekemiseen.

Muutin CreateBookingInput interfacen start ja end tyypiksi Date, koska on parempi käsitellä aikoja Date objekteina kuin stringeinä. Tämän takia jouduin myös muokkaamaan testejä vastaamaan tätä muutosta.

Copilotin avulla muutettiin vielä bookerin validointi niin, että samalla sähköpostilla on vain yksi nimi / käyttäjä ja jos sähköposti on jo booker -taulukossa niin sitä ei luoda toista kertaa. Bookerille tehtiin myös oma bookerRepository, koska bookerilla ongelmat Copilotin koodissa olivat muun muassa globaali mutable state, sähköposti-uniikkius oli domain -sääntö ja bookerin elinkaari on eri kuin bookingin elinkaari. Myös pientä vuotoa saattoi olla data.tsään ja serviceen ja se rikkoi single responbility -periaatetta ja encapsulationia.

---
ChatGPT

Mitä tekoäly teki hyvin?
ChatGPT antoi ihan hyvän vaatimusmäärittelyn ohjelmalle, ja antoi ehdotuksia siitä, kuinka parantaa koodia. ChatGPT selitti myös, miten vastuunjaot menevät ja piti siitä kiinni arkkitehtuurissa, mitä copilot ei tehnyt yhtä hyvin.

Mitä tekoäly teki huonosti?
Välillä jotkin nimeämiskäytännöt olivat ChatGPTllä erit kuin mitä koodissa oli oikeasti. Lisäksi chatGPT muisteli myös muita keskustelujamme, joita hieman sekoitti mukaan tähän keskusteluun. Voi myös olla, että chatGPT on johdattanut minua harhaan koodien kanssa, mutta itsestäni tämä ainakin vaikuttaa vielä ihan loogiselta.

Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi
-