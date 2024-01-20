# Napredne Baze Podataka: SkiExplorer - Neo4j + Cassandra
Pokretanje aplikacije SkiExplorer:

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
  - cd ../SkiExplorer
  - dotnet watch run

# Client start
  - npm install
  - npm start
