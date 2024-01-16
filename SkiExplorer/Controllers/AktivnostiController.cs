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
     public class AktivnostiController : ControllerBase
    {
         private readonly IDriver _driver;

        public AktivnostiController(IDriver driver)
        {
            _driver = driver;
        }
        
        [HttpPost("DodajAktivnost")]
        public async Task<IActionResult> DodajAktivnost(Aktivnost aktivnost)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"
                    CREATE (s:Aktivnost 
                    { 
                        naziv: $naziv,
                        opis: $opis
                    })
                    WITH s
                    UNWIND $skijaliste AS skijalisteNaziv
                    MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                    MERGE (p) - [:DISTRIBUTES] -> (s)";
                    
                                

                    var parameters = new
                    {
                        naziv=aktivnost.Naziv,
                        opis = aktivnost.Opis,
                        skijaliste = aktivnost.Skijaliste.Naziv
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

        [HttpPut("AzurirajAktivnost")]
        public async Task<IActionResult> AzurirajAktivnost(string naziv, string opis)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (n:Aktivnost {naziv: $naziv}) 
                                    SET n.opis=$opis 
                                    return n";
                    var parameters = new { naziv=naziv, 
                                           opis=opis};
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno ste azurirali podatke o aktivnosti");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("ObrisiAktivnost")]
        public async Task<IActionResult> ObrisiAktivnost(int aktivnostId)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (s:Aktivnost) where ID(s)=$aId
                                OPTIONAL MATCH (s)-[r]-()
                                DELETE r,s";
                    var parameters = new { aId = aktivnostId };
                    await session.RunAsync(query, parameters);
                    return Ok("Uspesno obrisana aktivnost.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiAktivnosti")]
        public async Task<IActionResult> PreuzmiAktivnosti()
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (s:Aktivnost) RETURN s";
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