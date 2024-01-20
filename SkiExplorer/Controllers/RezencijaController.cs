using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using Cassandra;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using SkiExplorer.Models;
using Microsoft.AspNetCore.Mvc;

namespace SkiExplorer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecenzijaController : ControllerBase
    {
        private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

        public RecenzijaController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajRecenziju")]
        public async Task<IActionResult> DodajRecenziju(Recenzija recenzija)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"CREATE (r:Recenzija 
                                { 
                                    korisnik: $korisnik, 
                                    komentar: $komentar,
                                    ocena: $ocena
                                })
                                WITH r
                                MERGE (s:Staza {naziv: $stazaNaziv})
                                MERGE (s) - [:ZA_STAZU] -> (r)";

                    var parameters = new
                    {
                        korisnik = recenzija.Korisnik,
                        komentar = recenzija.Komentar,
                        ocena = recenzija.Ocena,
                        stazaNaziv = recenzija.Staza?.Naziv
                    };

                    session.RunAsync(query, parameters);

                    return Ok("Uspesno dodata rezencija!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajRecenziju")]
        public async Task<IActionResult> AzurirajRecenziju(string korisnik, string komentar, int ocena)
        {
            try
            {
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"MATCH (r:Recenzija {korisnik: $korisnik}) 
                                       SET r.komentar = $komentar
                                       SET r.ocena = $ocena
                                       RETURN r";

                    var neo4jParameters = new
                    {
                        korisnik = korisnik,
                        komentar = komentar,
                        ocena = ocena
                    };

                    var neo4jResult = await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                    var neo4jNodes = await neo4jResult.ToListAsync();

                    var neo4jUpdatedNode = neo4jNodes.Select(record => record["r"].As<INode>()).SingleOrDefault();

                    if (neo4jUpdatedNode == null)
                    {
                        return NotFound($"Rezencija korisnika '{korisnik}' nije pronađena u Neo4j bazi.");
                    }

                    return Ok($"Uspesno azurirani podaci o rezenciji koju je ostavio korisnik '{korisnik}'.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("ObrisiRecenziju")]
        public async Task<IActionResult> ObrisiRecenziju(string korisnik)
        {
            try
            {
                using (var neo4jSession = _driver.AsyncSession())
                {
                    var neo4jQuery = @"
                        MATCH (r:Recenzija {korisnik: $korisnik})
                        OPTIONAL MATCH (r)-[s]-()
                        DELETE s, r";

                    var neo4jParameters = new { korisnik = korisnik};
                    await neo4jSession.RunAsync(neo4jQuery, neo4jParameters);
                }

                return Ok($"Uspesno obrisana recenziju koju je ostavio korisnik '{korisnik}'.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiRecenzijeStaze")]
        public async Task<IActionResult> PreuzmiRecenzijeStaze(string nazivStaze)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (:Staza {naziv: $nazivStaze})-[:ZA_STAZU]->(r:Recenzija)
                                  RETURN r";

                    var parameters = new
                    {
                        nazivStaze = nazivStaze
                    };

                    var result = await session.RunAsync(query, parameters);

                    var recenzije = await result.ToListAsync();

                    if (recenzije.Count == 0)
                    {
                        return NotFound($"Staza sa nazivom '{nazivStaze}' nema recenzija.");
                    }

                    return Ok(recenzije.Select(recenzija => new
                    {
                        Recenzija = recenzija["r"].As<INode>().Properties
                    }));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
