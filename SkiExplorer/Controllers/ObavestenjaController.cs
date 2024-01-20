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
    public class ObavestenjaController : ControllerBase
    {
        private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

        public ObavestenjaController(IDriver driver)
        {
            _driver = driver;
        }

        [HttpPost("DodajObavestenje")]
        public async Task<IActionResult> DodajObavestenje(Obavestenje obavestenje)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var query = @"
                    CREATE (s:Obavestenje 
                    { 
                        naslov: $naslov,
                        sadrzaj: $sadrzaj,
                        datumObjave: $datumObjave,
                        status: $status
                    })
                    WITH s
                    UNWIND $skijaliste AS skijalisteNaziv
                    MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                    MERGE (p) - [:ZA] -> (s)";

                    var parameters = new
                    {
                        naslov = obavestenje.Naslov,
                        sadrzaj = obavestenje.Sadrzaj,
                        datumObjave = obavestenje.DatumObjave,
                        status = obavestenje.Status,
                        skijaliste = obavestenje.Skijaliste?.Naziv,
                        lokacija = obavestenje.Skijaliste?.Lokacija
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $@"INSERT INTO Obavestenje (naslov, sadrzaj, datumObjave, status, skijaliste_naziv, lokacija) 
                                            VALUES 
                                        ('{obavestenje.Naslov}', '{obavestenje.Sadrzaj}', '{obavestenje.DatumObjave}', '{obavestenje.Status}', '{obavestenje.Skijaliste.Naziv}', '{obavestenje.Skijaliste.Lokacija}')";

                    CassandraDB.Execute(insertQuery);

                    return Ok("Uspesno dodavanje obavestenja!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajObavestenje")]
        public async Task<IActionResult> AzurirajObavestenje(string naslov, string skijaliste, string sadrzaj, string status)
        {
            try
            {
                var updateQuery = "UPDATE Obavestenje SET sadrzaj = ?, status = ? WHERE naslov = ? AND skijaliste_naziv = ?";
                var statement = new SimpleStatement(updateQuery, sadrzaj, status, naslov, skijaliste);

                await CassandraDB.ExecuteAsync(statement);

                return Ok("Uspesno azuriranje obavestenja!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("ObrisiObavestenje")]
        public async Task<IActionResult> ObrisiObavestenje(string naslov, string skijaliste_naziv)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var deleteQuery = $"DELETE FROM Obavestenje WHERE skijaliste_naziv = ? AND naslov = ?";
                    var statement = new SimpleStatement(deleteQuery, skijaliste_naziv, naslov);
                    await CassandraDB.ExecuteAsync(statement);

                    return Ok("Uspesno brisanje obavestenja!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiObavestenjaNaSkijalistu")]
        public async Task<IActionResult> PreuzmiObavestenjaNaSkijalistu(string skijaliste_naziv)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var selectQuery = $@"SELECT * FROM Obavestenje WHERE skijaliste_naziv = ? ALLOW FILTERING";
                    var statement = new SimpleStatement(selectQuery, skijaliste_naziv);
                    var result = await CassandraDB.ExecuteAsync(statement);

                    var obavestenja = new List<Obavestenje>();

                    foreach (var row in result)
                    {
                        var naslov = row.GetValue<string>("naslov");
                        var sadrzaj = row.GetValue<string>("sadrzaj");
                        var datumObjave = row.GetValue<string>("datumobjave");
                        var status = row.GetValue<string>("status");

                        var obavestenje = new Obavestenje
                        {
                            Naslov = naslov,
                            Sadrzaj = sadrzaj,
                            DatumObjave = datumObjave,
                            Status = status,
                        };

                        obavestenja.Add(obavestenje);
                    }

                    if (obavestenja.Count > 0)
                    {
                        return Ok(obavestenja);
                    }
                    else
                    {
                        return NotFound("Nema obaveštenja za dato skijalište.");
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