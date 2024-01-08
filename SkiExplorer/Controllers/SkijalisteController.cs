using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
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

        public SkijalisteController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajSkijaliste")]
        public async Task<IActionResult> DodajSkijaliste(Skijaliste skijaliste)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"CREATE (s:Skijaliste { naziv: $naziv, lokacija: $lokacija })";

                    var parameters = new
                    {
                        naziv = skijaliste.Naziv,
                        lokacija = skijaliste.Lokacija
                    };

                    await session.RunAsync(query, parameters);

                    return Ok("Uspesno");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajSkijaliste")]
        public async Task<IActionResult> AzurirajSkijaliste(string naziv, string lokacija)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Skijaliste {naziv: $naziv}) 
                                    SET n.naziv=$naziv 
                                    SET n.lokacija=$lokacija
                                    return n";
                    var parameters = new { 
                                           naziv=naziv, 
                                           lokacija=lokacija};
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno ste azurirali podatke o skijalistu");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("DodajStazuSkijalistu")]
        public async Task<IActionResult> DodajStazuSkijalistu(int stazaId, int skijalisteId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Skijaliste) WHERE ID(n)=$skiId
                                MATCH (m:Staza) WHERE ID(m)=$sId
                                CREATE (n)-[:DISTRIBUTES]->(m)";

                    var parameters = new
                    {
                        sId = stazaId,
                        skiId = skijalisteId
                    };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno dodata staza u skijaliste.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("DodajAktivnostSkijalistu")]
        public async Task<IActionResult> DodajAktivnostSkijalistu(int aktivnostId, int skijalisteId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Skijaliste) WHERE ID(n)=$skiId
                                MATCH (m:Aktivnost) WHERE ID(m)=$sId
                                CREATE (n)-[:DISTRIBUTES]->(m)";

                    var parameters = new
                    {
                        sId = aktivnostId,
                        skiId = skijalisteId
                    };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno dodata aktivnost u skijaliste.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("ObrisiSkijaliste")]
        public async Task<IActionResult> ObrisiSkijaliste(int skijalisteId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (s:Skijaliste) where ID(s)=$sId
                                OPTIONAL MATCH (s)-[r]-()
                                DELETE r,s";
                    var parameters = new { sId = skijalisteId };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno obrisano skijaliste.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiStazeSkijalista")]
        public async Task<IActionResult> PreuzmiStazeSkijalista(int skijalisteId)
        {
            try
            {
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = @"
                        MATCH (s:Skijaliste)-[:DISTRIBUTES]->(k:Staza)
                        WHERE ID(s)=$sId
                        RETURN k";
                        var cursor = await tx.RunAsync(query, new { sId = skijalisteId});
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
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiAktivnostiSkijalista")]
        public async Task<IActionResult> PreuzmiAktivnostiSkijalista(int skijalisteId)
        {
            try
            {
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = @"
                        MATCH (s:Skijaliste)-[:DISTRIBUTES]->(k:Aktivnost)
                        WHERE ID(s)=$sId
                        RETURN k";
                        var cursor = await tx.RunAsync(query, new { sId = skijalisteId});
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
            catch(Exception ex)
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
    }
}
