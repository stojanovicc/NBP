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
    public class VremenskaPrognozaController : ControllerBase
    {
        private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

        public VremenskaPrognozaController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajVremenskuPrognozu")]
        public async Task<IActionResult> DodajVremenskuPrognozu(VremenskaPrognoza vreme)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"
                    UNWIND $skijaliste AS skijalisteNaziv
                    MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                    MERGE (p) - [:IMA] -> (s:VremenskaPrognoza { 
                        id: $id,
                        temperatura: $temperatura, 
                        uvindex: $uvindex,
                        brzinavetra: $brzinavetra,
                        vlaznostvazduha: $vlaznostvazduha,
                        padavine: $padavine,
                        pritisak: $pritisak,
                        vreme: $vreme
                    })";

                    var parameters = new
                    {
                        temperatura = vreme.Temperatura,
                        uvindex = vreme.UVIndex,
                        brzinavetra = vreme.BrzinaVetra,
                        vlaznostvazduha = vreme.VlaznostVazduha,
                        padavine = vreme.Padavine,
                        pritisak = vreme.Pritisak,
                        vreme = vreme.Vreme,
                        skijaliste = vreme.Skijaliste.Naziv
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $@"INSERT INTO VremenskaPrognoza (id, temperatura, uvindex, brzinavetra, vlaznostvazduha, padavine, pritisak, vreme, skijaliste) 
                                        VALUES 
                                        ({vreme.Temperatura}, {vreme.UVIndex}, {vreme.BrzinaVetra}, {vreme.VlaznostVazduha}, '{vreme.Padavine}', {vreme.Pritisak}, '{vreme.Vreme}', '{vreme.Skijaliste.Naziv}')";

                    CassandraDB.Execute(insertQuery);

                    return Ok("Uspesno");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}