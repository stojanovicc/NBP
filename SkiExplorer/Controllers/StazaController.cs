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
    public class StazaController : ControllerBase
    {
        private readonly IDriver _driver;

        public StazaController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajStazu")]
        public async Task<IActionResult> DodajStazu(Staza staza)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"
                    CREATE (s:Staza 
                    { 
                        naziv: $naziv, 
                        tezina: $tezina,
                        duzina: $duzina
                    })
                    WITH s
                    UNWIND $skijaliste AS skijalisteNaziv
                    MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                    MERGE (p) - [:DISTRIBUTES] -> (s)";
                    
                                

                    var parameters = new
                    {
                        naziv = staza.Naziv,
                        tezina = staza.Tezina,
                        duzina = staza.Duzina,
                        skijaliste = staza.Skijaliste.Naziv
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

        [HttpPut("AzurirajStazu")]
        public async Task<IActionResult> AzurirajStazu(string naziv, float tezina, float duzina)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Staza {naziv: $naziv}) 
                                    SET n.naziv=$naziv 
                                    SET n.tezina=$tezina
                                    SET n.duzina=$duzina
                                    return n";
                    var parameters = new { naziv=naziv, 
                                           tezina=tezina,
                                           duzina=duzina};
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno ste azurirali podatke o stazi");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("ObrisiStazu")]
        public async Task<IActionResult> ObrisiStazu(int stazaId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (s:Staza) where ID(s)=$sId
                                OPTIONAL MATCH (s)-[r]-()
                                DELETE r,s";
                    var parameters = new { sId = stazaId };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno obrisana staza.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

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
    }
}