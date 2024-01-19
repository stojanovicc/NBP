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
    public class StazaController : ControllerBase
    {
        private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

        public StazaController(IDriver driver)
        {
            _driver = driver;
        }
        //radi
        [HttpPost("DodajStazu")]
        public IActionResult DodajStazu([FromBody] Staza staza)
        {
            try
            {
                // Neo4j
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"
                        CREATE (s:Staza 
                        { 
                            naziv: $naziv, 
                            tezina: $tezina,
                            duzina: $duzina
                        })
                        WITH s
                        MERGE (p:Skijaliste {naziv: $skijalisteNaziv})
                        SET p.lokacija = $lokacija
                        MERGE (p) - [:DISTRIBUTES] -> (s)";

                    var neo4jParameters = new
                    {
                        naziv = staza.Naziv,
                        tezina = staza.Tezina,
                        duzina = staza.Duzina,
                        skijalisteNaziv = staza.Skijaliste?.Naziv,
                        lokacija = staza.Skijaliste?.Lokacija
                    };

                    neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                }

                // Cassandra
                var cassandraQuery = @"
                    INSERT INTO staza (naziv, tezina, duzina, skijaliste_naziv, lokacija) 
                    VALUES (?, ?, ?, ?, ?)";

                var cassandraParameters = new object[] { 
                    staza.Naziv, 
                    staza.Tezina, 
                    staza.Duzina, 
                    staza.Skijaliste?.Naziv, 
                    staza.Skijaliste?.Lokacija 
                };

                var cassandraStatement = new SimpleStatement(cassandraQuery, cassandraParameters);
                CassandraDB.Execute(cassandraStatement);

                return Ok("Uspesno dodata staza.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //radi
        [HttpPut("AzurirajStazu")]
        public async Task<IActionResult> AzurirajStazu(string naziv, string tezina, float duzina)
        {
            try
            {
                // Neo4j
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"
                        MATCH (n:Staza {naziv: $naziv}) 
                        SET n.tezina = $tezina
                        SET n.duzina = $duzina
                        RETURN n";

                    var neo4jParameters = new
                    {
                        naziv = naziv,
                        tezina = tezina,
                        duzina = duzina
                    };

                    var neo4jResult = await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                    var neo4jNodes = await neo4jResult.ToListAsync();

                    var neo4jUpdatedNode = neo4jNodes.Select(record => record["n"].As<INode>()).SingleOrDefault();

                    if (neo4jUpdatedNode == null)
                    {
                        return NotFound($"Staza sa nazivom '{naziv}' nije pronađena u Neo4j bazi.");
                    }
                }

                // Cassandra
                var cassandraQuery = @"
                    UPDATE staza
                    SET tezina = ?, duzina = ? 
                    WHERE naziv = ?";

                var cassandraParameters = new object[] { tezina, duzina, naziv };
                var cassandraStatement = new SimpleStatement(cassandraQuery, cassandraParameters);
                CassandraDB.Execute(cassandraStatement);

                return Ok($"Uspesno azurirani podaci o stazi sa nazivom '{naziv}'.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //radi
        [HttpDelete("ObrisiStazu")]
        public async Task<IActionResult> ObrisiStazu(string naziv)
        {
            try
            {
                // Neo4j
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"
                        MATCH (s:Staza {naziv: $naziv})
                        OPTIONAL MATCH (s)-[r]-()
                        DELETE r, s";

                    var neo4jParameters = new { naziv = naziv };
                    await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                }

                // Cassandra
                var cassandraQuery = @"
                    DELETE FROM staza
                    WHERE naziv = ?";

                var cassandraParameters = new object[] { naziv };
                var cassandraStatement = new SimpleStatement(cassandraQuery, cassandraParameters);
                CassandraDB.Execute(cassandraStatement);

                return Ok($"Uspesno obrisana staza sa nazivom '{naziv}'.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //radi
        [HttpGet("PreuzmiStaze")]
        public async Task<IActionResult> PreuzmiStaze()
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (s:Staza) RETURN s";
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

        [HttpGet("PretraziStaze")]
        public async Task<IActionResult> PretraziStaze(string pojam)
        {
            try
            {
                var cql = $@"SELECT * FROM Staza WHERE naziv = ?";

                var result = await CassandraDB.ExecuteAsync(new SimpleStatement(cql).Bind(pojam));

                var staza = result.Select(row => new Staza
                {
                    Naziv = row.GetValue<string>("naziv"),
                    Tezina = row.GetValue<string>("tezina"),
                    Duzina = row.GetValue<float>("duzina"),
                    Skijaliste = new Skijaliste
                    {
                        Naziv = row.GetValue<string>("skijaliste_naziv"),
                        Lokacija = row.GetValue<string>("lokacija"),
                    }
                }).ToList();

                return Ok(staza);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška: {ex.Message}");
            }
        }
    }
}