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
     public class AktivnostiController : ControllerBase
    {
         private readonly IDriver _driver;
        public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("my_keyspace");

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
                        opis: $opis,
                        cena: $cena
                    })
                    WITH s
                    UNWIND $skijaliste AS skijalisteNaziv
                    MERGE (p:Skijaliste {naziv: skijalisteNaziv})
                    MERGE (p) - [:NA] -> (s)";    

                    var parameters = new
                    {
                        naziv = aktivnost.Naziv,
                        opis = aktivnost.Opis,
                        cena = aktivnost.Cena,
                        skijaliste = aktivnost.Skijaliste.Naziv
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $@"INSERT INTO Aktivnost (naziv, opis, cena, skijaliste) 
                                            VALUES 
                                        ('{aktivnost.Naziv}', '{aktivnost.Opis}', {aktivnost.Cena}, '{aktivnost.Skijaliste.Naziv}')";

                    CassandraDB.Execute(insertQuery);

                    return Ok("Uspesno dodavanje aktivnosti!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("AzurirajAktivnost")]
        public async Task<IActionResult> AzurirajAktivnost(string naziv, string skijaliste, string opis, float cena)
        {
            try
            {
                var updateQuery = "UPDATE Aktivnost SET opis = ?, cena = ? WHERE naziv = ? AND skijaliste = ?";
                var statement = new SimpleStatement(updateQuery, opis, cena, naziv, skijaliste);

                await CassandraDB.ExecuteAsync(statement);

                return Ok("Uspesno azuriranje aktivnosti!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("ObrisiAktivnost")]
        public async Task<IActionResult> ObrisiAktivnost(string naziv, string skijaliste)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var deleteQuery = $"DELETE FROM Aktivnost WHERE skijaliste = ? AND naziv = ?";
                    var statement = new SimpleStatement(deleteQuery, skijaliste, naziv);
                    await CassandraDB.ExecuteAsync(statement);

                    return Ok("Uspesno brisanje aktivnosti!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PreuzmiAktivnostiNaSkijalistu")]
        public async Task<IActionResult> PreuzmiAktivnostiNaSkijalistu(string skijaliste, string naziv)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var selectQuery = $@"SELECT * FROM Aktivnost WHERE skijaliste = ? AND naziv = ?";
                    var statement = new SimpleStatement(selectQuery, skijaliste, naziv);
                    var result = await CassandraDB.ExecuteAsync(statement);

                    var row = result.FirstOrDefault();
                    if (row != null)
                    {
                        var opis = row.GetValue<string>("opis");
                        var cena = row.GetValue<float>("cena");

                        var aktivnost = new Aktivnost
                        {
                            //Skijaliste = skijaliste,
                            Naziv = naziv,
                            Opis = opis,
                            Cena = cena,
                        };

                        return Ok(aktivnost);
                    }
                    else
                    {
                        return NotFound("Aktivnost nije pronađena.");
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