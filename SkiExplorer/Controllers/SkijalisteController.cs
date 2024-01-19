using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using Cassandra;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SkiExplorer.Models;
using Microsoft.AspNetCore.Mvc;

namespace SkiExplorer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkijalisteController : ControllerBase
    {
        private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

        public SkijalisteController(IDriver driver)
        {
            _driver = driver;
        }
        //radi
        [HttpPost("DodajSkijaliste")]
        public async Task<IActionResult> DodajSkijaliste(Skijaliste skijaliste)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"CREATE (s:Skijaliste {naziv: $naziv, lokacija: $lokacija })";

                    var parameters = new
                    {
                        naziv = skijaliste.Naziv,
                        lokacija = skijaliste.Lokacija
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $"INSERT INTO Skijaliste (naziv, lokacija) VALUES ('{skijaliste.Naziv}', '{skijaliste.Lokacija}')";

                    CassandraDB.Execute(insertQuery);

                    return Ok("Uspesno dodavanje skijalista!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //radi
        [HttpPut("AzurirajSkijaliste")]
        public async Task<IActionResult> AzurirajSkijaliste(string naziv, string lokacija)
        {
            try
            {
                // Neo4j
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"MATCH (n:Skijaliste {naziv: $naziv}) 
                                    SET n.naziv = $naziv, n.lokacija = $lokacija
                                    RETURN n";
                    var neo4jParameters = new { naziv = naziv, lokacija = lokacija };
                    await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                }

                // Cassandra
                var cassandraQuery = "UPDATE skijaliste SET lokacija = ? WHERE naziv = ?";
                var statement = new SimpleStatement(cassandraQuery, lokacija, naziv);
                await CassandraDB.ExecuteAsync(statement);

                return Ok("Uspesno ste azurirali podatke o skijalistu");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //radi
        [HttpDelete("ObrisiSkijaliste")] 
        public async Task<IActionResult> ObrisiSkijaliste(string skijalisteNaziv)
        {
            try
            {
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"MATCH (s:Skijaliste {naziv: $naziv})
                                    OPTIONAL MATCH (s)-[r]-()
                                    DELETE r, s";
                    var neo4jParameters = new { naziv = skijalisteNaziv };
                    await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                }

                var cassandraQuery = $"DELETE FROM skijaliste WHERE naziv = ?";
                var statement = new SimpleStatement(cassandraQuery, skijalisteNaziv);
                await CassandraDB.ExecuteAsync(statement);

                return Ok("Uspesno obrisano skijaliste.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiSkijalista")]
        public async Task<IActionResult> PreuzmiSkijalista()
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (s:Skijaliste) RETURN s";
                        var cursor = await tx.RunAsync(query);
                        var nodes = new List<INode>();

                        await cursor.ForEachAsync(record =>
                        {
                            var node = record["s"].As<INode>();
                            nodes.Add(node);
                        });

                        return nodes;
                    });

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiStazeSkijalista")]//po nazivu
        public async Task<IActionResult> PreuzmiStazeSkijalista(string nazivSkijalista)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = @"
                            MATCH (s:Skijaliste {naziv: $nazivSkijalista})-[:DISTRIBUTES]->(k:Staza)
                            RETURN k";

                        var cursor = await tx.RunAsync(query, new { nazivSkijalista = nazivSkijalista });
                        var nodes = new List<INode>();

                        await cursor.ForEachAsync(record =>
                        {
                            var node = record["k"].As<INode>();
                            nodes.Add(node);
                        });

                        return nodes;
                    });

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiAktivnostiSkijalista")]
        public async Task<IActionResult> PreuzmiAktivnostiSkijalista(string nazivSkijalista)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = @"
                            MATCH (s:Skijaliste {naziv: $nazivSkijalista})-[:DISTRIBUTES]->(k:Aktivnost)
                            RETURN k";

                        var cursor = await tx.RunAsync(query, new { nazivSkijalista = nazivSkijalista });
                        var nodes = new List<INode>();

                        await cursor.ForEachAsync(record =>
                        {
                            var node = record["k"].As<INode>();
                            nodes.Add(node);
                        });

                        return nodes;
                    });

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiSkijaliste")]
        public async Task<IActionResult> PreuzmiSkijaliste(string nazivSkijalista)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (s:Skijaliste {naziv: $nazivSkijalista}) RETURN s";
                        var cursor = await tx.RunAsync(query, new { nazivSkijalista });
                        var nodes = new List<INode>();

                        await cursor.ForEachAsync(record =>
                        {
                            var node = record["s"].As<INode>();
                            var nodeId = node.Id;
                            Console.WriteLine($"Found Skijaliste with ID: {nodeId}");
                            nodes.Add(node);
                        });

                        return nodes;
                    });

                    Console.WriteLine($"Naziv skijališta: {nazivSkijalista}, Broj rezultata: {result.Count}");

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreporukaStaza")]
        public async Task<IActionResult> PreporukaStaza(string nazivSkijalista, string skiingLevel)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var stazeNaSkijalistu = await PreuzmiSveStazeNaSkijalistu(nazivSkijalista);

                    string tezina;

                    switch (skiingLevel.ToLower())
                    {
                        case "nizak":
                            tezina = "plava";
                            break;
                        case "srednji":
                            tezina = "crvena";
                            break;
                        case "visok":
                            tezina = "crna";
                            break;
                        default:
                            return BadRequest("Nepoznat nivo skijanja");
                    }

                    var preporuceneStaze = stazeNaSkijalistu.Where(staza =>
                        staza.Properties["tezina"].As<string>() == tezina).ToList();

                    return Ok(preporuceneStaze);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        private async Task<List<INode>> PreuzmiSveStazeNaSkijalistu(string nazivSkijalista)
        {
            using (var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteReadAsync(async tx =>
                {
                    var query = @"
                        MATCH (s:Skijaliste {naziv: $nazivSkijalista})-[:DISTRIBUTES]->(k:Staza)
                        RETURN k";

                    var cursor = await tx.RunAsync(query, new { nazivSkijalista });
                    var nodes = new List<INode>();

                    await cursor.ForEachAsync(record =>
                    {
                        var node = record["k"].As<INode>();
                        var tezinaExists = node.Properties.TryGetValue("tezina", out var tezina);

                        if (tezinaExists && tezina is string)
                        {
                            nodes.Add(node);
                        }
                    });

                    return nodes;
                });

                return result;
            }
        }

        [HttpGet("PretraziSkijalista")]
        public async Task<IActionResult> PretraziSkijalista(string pojam)
        {
            try
            {
                var cql = $@"SELECT * FROM Skijaliste WHERE naziv = ?";

                var result = await CassandraDB.ExecuteAsync(new SimpleStatement(cql).Bind(pojam));

                var skijaliste = result.Select(row => new Skijaliste
                {
                    Naziv = row.GetValue<string>("naziv"),
                    Lokacija = row.GetValue<string>("lokacija"),
                }).ToList();

                return Ok(skijaliste);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška: {ex.Message}");
            }
        }
    }
}