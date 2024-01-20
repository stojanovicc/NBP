# Napredne Baze Podataka: SkiExplorer - Neo4j + Cassandra

#  Contributors (Student, Br.Indeksa)
  - Anđela Stojanović, 18406
  - Anastasija Trajković, 18456

# Clone repository
 - git clone https://github.com/stojanovicc/NBP.git
 - cd NBP

# Cassandra
1. Korak: pokrenuti Cassandru
2. Korak: USE my_keyspace;
3. Korak: Kreirati sledece tabele u Cassandri
    - CREATE TABLE Skijaliste(naziv TEXT PRIMARY KEY, lokacija TEXT);
    - CREATE TABLE Staza(naziv TEXT PRIMARY KEY, tezina TEXT, duzina FLOAT, skijaliste_naziv TEXT, lokacija TEXT);
    - CREATE TABLE Aktivnost(naziv TEXT, opis TEXT, cena FLOAT, skijaliste_naziv TEXT, lokacija TEXT, PRIMARY KEY(naziv, skijaliste_naziv));
    - CREATE TABLE Obavestenje(naslov TEXT, sadrzaj TEXT, datumobjave TEXT, status TEXT, skijaliste_naziv TEXT, lokacija TEXT, PRIMARY KEY(naslov, skijaliste_naziv));
    - CREATE TABLE VremenskaPrognoza(datum TEXT, temperatura INT, uvindex INT, brzinavetra FLOAT, vlaznostvazduha INT, padavine TEXT, pritisak FLOAT, skijaliste TEXT, PRIMARY KEY(datum, skijaliste));

# Neo4J
- http://localhost:7474/browser/
- username: neo4j
- password: anastasijaandjela

# Server start
  - cd ../NBP/SkiExplorer
  - dotnet watch run

# Client start
  - npm install
  - npm install @mui/icons-material
  - npm start

# BITAN DODATAK DA BI SE APLIKACIJA USPEŠNO IZVRŠILA
1. Težina staze
  - unos težine staze treba biti plava, crna ili crvena !
    
2. Funkcija Preporuka Staza
  - kada se testira ova funkcija neophodno je da NIVO SKIJANJA bude nizak, srednji ili visok, kako bi se korisniku preporučila adekvatna staza na osnovu njegovog nivoa skijanja.
  - nizak nivo je za plavu, srednji za crvenu, a visok za crnu stazu !

3. Promena vremenske prognoze
  - kada bi se videla promena vremenske potrebno je u formi zatražiti prikaz te vremenske sa željenim datumom, iz razloga što je zamišljeno da se vremenska iz sekunde u sekundu menja, i nema potrebe za osvežavanjem vć prikazane vremenske.
