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
                    var query = @"CREATE (s:VremenskaPrognoza 
                                  {
                                    datum: $datum,
                                    temperatura: $temperatura, 
                                    uvindex: $uvindex,
                                    brzinavetra: $brzinavetra,
                                    vlaznostvazduha: $vlaznostvazduha,
                                    padavine: $padavine,
                                    pritisak: $pritisak
                                  })
                                WITH s
                                UNWIND $skijaliste AS skijalisteNaziv
                                MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                                MERGE (p) - [:IMA] -> (s)";

                    var parameters = new
                    {
                        datum = vreme.Datum,
                        temperatura = vreme.Temperatura,
                        uvindex = vreme.UVIndex,
                        brzinavetra = vreme.BrzinaVetra,
                        vlaznostvazduha = vreme.VlaznostVazduha,
                        padavine = vreme.Padavine,
                        pritisak = vreme.Pritisak,
                        skijaliste = vreme.Skijaliste.Naziv
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $@"INSERT INTO VremenskaPrognoza (datum, temperatura, uvindex, brzinavetra, vlaznostvazduha, padavine, pritisak, skijaliste) 
                                            VALUES 
                                        ('{vreme.Datum}', {vreme.Temperatura}, {vreme.UVIndex}, {vreme.BrzinaVetra}, {vreme.VlaznostVazduha}, '{vreme.Padavine}', {vreme.Pritisak}, '{vreme.Skijaliste.Naziv}')";

                    CassandraDB.Execute(insertQuery);

                    return Ok("Uspesno dodavanje vremenske prognoze!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajVremenskuPrognozu")]
        public async Task<IActionResult> AzurirajVremenskuPrognozu(string skijaliste, string datum, int temperatura, int uvindex, float brzinavetra, int vlaznostvazduha, string padavine, float pritisak)
        {
            try
            {
                var updateQuery = "UPDATE VremenskaPrognoza SET temperatura = ?, uvindex = ?, brzinavetra = ?, vlaznostvazduha = ?, padavine = ?, pritisak = ? WHERE skijaliste = ? AND datum = ?";
                var statement = new SimpleStatement(updateQuery, temperatura, uvindex, brzinavetra, vlaznostvazduha, padavine, pritisak, skijaliste, datum);

                await CassandraDB.ExecuteAsync(statement);

                return Ok("Uspesno azuriranje vremenske prognoze!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("ObrisiVremenskuPrognozu")]
        public async Task<IActionResult> ObrisiVremenskuPrognozu(string skijaliste, string datum)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var deleteQuery = $"DELETE FROM VremenskaPrognoza WHERE skijaliste = ? AND datum = ?";
                    var statement = new SimpleStatement(deleteQuery, skijaliste, datum);
                    await CassandraDB.ExecuteAsync(statement);

                    return Ok("Uspesno brisanje vremenske prognoze!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiVremenskuPrognozuNaSkijalistu")]
        public async Task<IActionResult> PreuzmiVremenskuPrognozuNaSkijalistu(string skijaliste, string datum)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var selectQuery = $@"SELECT * FROM VremenskaPrognoza WHERE skijaliste = ? AND datum = ?";
                    var statement = new SimpleStatement(selectQuery, skijaliste, datum);
                    var result = await CassandraDB.ExecuteAsync(statement);

                    var row = result.FirstOrDefault();
                    if (row != null)
                    {
                        var temperatura = row.GetValue<int>("temperatura");
                        var uvIndex = row.GetValue<int>("uvindex");
                        var brzinaVetra = row.GetValue<float>("brzinavetra");
                        var vlaznostVazduha = row.GetValue<int>("vlaznostvazduha");
                        var padavine = row.GetValue<string>("padavine");
                        var pritisak = row.GetValue<float>("pritisak");

                        var vremenskaPrognoza = new VremenskaPrognoza
                        {
                            Datum = datum,
                            Temperatura = temperatura,
                            UVIndex = uvIndex,
                            BrzinaVetra = brzinaVetra,
                            VlaznostVazduha = vlaznostVazduha,
                            Padavine = padavine,
                            Pritisak = pritisak
                        };

                        return Ok(vremenskaPrognoza);
                    }
                    else
                    {
                        return NotFound("Vremenska prognoza nije pronađena.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}