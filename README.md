REST-tyylinen web api, joka käsittelee kahden taulun tietokantaa. Sovelluksessa on backend-toiminnot ja niihin liittyvä web-frontend. Tietokanta sisältää henkilöiden tietoja sekä henkilöihin liittyviä mittaustuloksia kuten verenpaine, paino ym. Tietokannassa on taulujen välillä relaatio, jotta henkilöön liittyvät mittaukset ovat helposti saatavilla.

Backend toteutus: C#
Frontend toteutus: React

Backend käynnistys:
- avaa projekti Visual Studiossa ja käynnistä sieltä
- avaa sivun https://localhost:44389/index.html (Swagger)

Frontend käynnistys:
- siirry measurementClient -kansioon (sisältää package.json tiedoston)
- suorita komento "npm i" (asentaa tarvittavat kirjastot)
- käynnistä sovellus komennolla "npm start"


REST API kutsut:

MEASUREMENTS:

GET https://localhost:44389/api/persons/{personId}/measurements/?unitName={unitName}&start={start}&end={end}
Parametrit:
  - personId (int)
  - unitName (string)
  - start (datestring)
  - end (datestring)

Esimerkki:
GET https://localhost:44389/api/persons/7/measurements/?unitName=SYKE&start=2020-02-02T15:30:59&end=2020-02-05T19:30:25


POST https://localhost:44389/api/persons/{personId}/measurements/
Parametrit:
  - personId (int)

Body:
[
  {
    "unitName": [string],
    "value": [double],
    "time": [datestring],
    "personId": [int]
  }
]

Esimerkki:
POST https://localhost:44389/api/persons/1/measurements/

Body:
[
  {
    "unitName": "HEMOGLOB",
    "value": 140,
    "time": "2020-03-08T10:11:21",
    "personId": 1
  },
  {
    "unitName": "SYKE",
    "value": 80,
    "time": "2020-03-07T10:11:21",
    "personId": 1
  }
]

  
GET https://localhost:44389/api/persons/{personId}/measurements/metrics
Parametrit:
  - personId (int)

Esimerkki:
GET https://localhost:44389/api/persons/1/measurements/metrics


DELETE https://localhost:44389/api/persons/{personId}/measurements/{id}
Parametrit:
  - personId (int)
  - id (int) measurement id
  
Esimerkki:
DELETE https://localhost:44389/api/persons/1/measurements/3


PERSONS:

GET https://localhost:44389/api/persons?havingMeasurements=[boolean]
Parametrit:
  - havingMeasurements (boolean)
  
Esimerkki:
GET https://localhost:44389/api/persons?havingMeasurements=true
GET https://localhost:44389/api/persons (palauttaa kaikki)


POST https://localhost:44389/api/persons
Body:
  {
    "pin": [string], (unique)
    "name": [string],
    "address": [string],
    "phone": [string],
    "email": [string]
  }

Esimerkki:
POST https://localhost:44389/api/persons
Body:
  {
    "pin": "010799-099A",
    "name": "Ville Vallaton",
    "address": "Vauhtikatu 9",
    "phone": "040 123 4567",
    "email": "ville@vallaton.fi"
  }

  
GET https://localhost:44389/api/persons/{id}
Parametrit:
  - id (int) personId

Esimerkki:
GET https://localhost:44389/api/persons/1
  
  
PUT https://localhost:44389/api/persons/{id}
Parametrit:
  - id (int) personId
Body:
  {
    "personId": [int],
    "pin": [string], (unique)
    "name": [string],
    "address": [string],
    "phone": [string],
    "email": [string]
  }

Esimerkki:
PUT https://localhost:44389/api/persons/6
Body:
  {
    "personId": 6,
    "pin": "010190-1234",
    "name": "Matti Meikäläinen",
	  "address": "Vauhtikatu 9",
    "phone": "050 122223 4567",
    "email": "matti.meikalainen@savonia.fi"
  }


DELETE https://localhost:44389/api/persons/{id}
Parametrit:
  - id (int) personId

Esimerkki:
DELETE https://localhost:44389/api/persons/3