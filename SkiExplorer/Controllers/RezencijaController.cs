using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
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

        public RecenzijaController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajRecenziju")]
        public async Task<IActionResult> DodajRecenziju([FromBody] Recenzija recenzija)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (sk:Skijas), (st:Staza)
                                    WHERE ID(sk) = $skijasId AND ID(st) = $stazaId
                                    CREATE (r:Recenzija {komentar: $komentar, ocena: $ocena})
                                    MERGE (sk)-[:OSTAVLJA]->(r)
                                    MERGE (st)-[:ZA_STAZU]->(r)
                                    RETURN r";

                    var parameters = new
                    {
                        skijasId = recenzija.Skijas.Id,
                        stazaId = recenzija.Staza.Id,
                        komentar = recenzija.Komentar,
                        ocena = recenzija.Ocena
                    };

                    var result = await session.RunAsync(query, parameters);

                    var novaRecenzija = await result.SingleAsync();

                    return Ok(novaRecenzija["r"].As<INode>().Properties);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiRecenzijeStaze/{nazivStaze}")]
        public async Task<IActionResult> PreuzmiRecenzijeStaze(string nazivStaze)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"MATCH (:Staza {naziv: $nazivStaze})-[:ZA_STAZU]->(r:Recenzija)<-[:OSTAVLJA]-(sk:Skijas)
                                    RETURN r, sk";

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
                        Skijas = recenzija["sk"].As<INode>().Properties,
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
