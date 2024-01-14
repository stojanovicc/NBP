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
    public class SkijasController : ControllerBase
    {
        private readonly IDriver _driver;

        public SkijasController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajSkijasa")]
        public async Task<IActionResult> DodajSkijasa(Skijas skijas)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"CREATE (s:Skijas {ime: $ime, prezime: $prezime, nivoSkijanja: $nivoSkijanja})";

                    var parameters = new
                    {
                        ime = skijas.Ime,
                        prezime = skijas.Prezime,
                        nivoSkijanja = skijas.NivoSkijanja
                    };

                    await session.RunAsync(query, parameters);

                    return Ok("Uspesno ste dodali skijasa");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajSkijasa")]
        public async Task<IActionResult> AzurirajSkijasa(string ime, string prezime, string nivoSkijanja)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Skijas {ime: $ime, prezime: $prezime}) 
                                    SET n.ime=$ime 
                                    SET n.prezime=$prezime
                                    SET n.nivoSkijanja=$nivoSkijanja
                                    return n";
                    var parameters = new
                    {
                        ime = ime,
                        prezime = prezime,
                        nivoSkijanja = nivoSkijanja
                    };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno ste azurirali podatke o skijasu");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("ObrisiSkijasa")]
        public async Task<IActionResult> ObrisiSkijasa(int skijasId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (s:Skijas) where ID(s)=$sId
                                    OPTIONAL MATCH (s)-[r]-()
                                    DELETE r,s";
                    var parameters = new { sId = skijasId };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno obrisan skijas.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiSkijase")]
        public async Task<IActionResult> PreuzmiSkijase()
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (s:Skijas) RETURN s";
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
