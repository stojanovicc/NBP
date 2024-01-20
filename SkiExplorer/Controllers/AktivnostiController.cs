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
                        skijaliste = aktivnost.Skijaliste?.Naziv,
                        lokacija = aktivnost.Skijaliste?.Lokacija
                    };

                    await session.RunAsync(query, parameters);

                    var insertQuery = $@"INSERT INTO Aktivnost (naziv, opis, cena, skijaliste_naziv, lokacija) 
                                            VALUES 
                                        ('{aktivnost.Naziv}', '{aktivnost.Opis}', {aktivnost.Cena}, '{aktivnost.Skijaliste.Naziv}', '{aktivnost.Skijaliste.Lokacija}')";

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
                var updateQuery = "UPDATE Aktivnost SET opis = ?, cena = ? WHERE naziv = ? AND skijaliste_naziv = ?";
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
        public async Task<IActionResult> ObrisiAktivnost(string naziv, string skijaliste_naziv)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var deleteQuery = $"DELETE FROM Aktivnost WHERE skijaliste_naziv = ? AND naziv = ?";
                    var statement = new SimpleStatement(deleteQuery, skijaliste_naziv, naziv);
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
        public async Task<IActionResult> PreuzmiAktivnostiNaSkijalistu(string skijaliste_naziv)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var selectQuery = $@"SELECT * FROM Aktivnost WHERE skijaliste_naziv = ? ALLOW FILTERING";
                    var statement = new SimpleStatement(selectQuery, skijaliste_naziv);
                    var result = await CassandraDB.ExecuteAsync(statement);

                    var aktivnosti = new List<Aktivnost>();

                    foreach (var row in result)
                    {
                        var naziv = row.GetValue<string>("naziv");
                        var opis = row.GetValue<string>("opis");
                        var cena = row.GetValue<float>("cena");

                        var aktivnost = new Aktivnost
                        {
                            Naziv = naziv,
                            Opis = opis,
                            Cena = cena,
                        };

                        aktivnosti.Add(aktivnost);
                    }

                    if (aktivnosti.Count > 0)
                    {
                        return Ok(aktivnosti);
                    }
                    else
                    {
                        return NotFound("Nema aktivnosti za dato skijalište.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PretraziAktivnosti")]
        public async Task<IActionResult> PretraziAktivnosti(string pojam)
        {
            try
            {
                var cql = $@"SELECT * FROM Aktivnost WHERE naziv = ?";

                var result = await CassandraDB.ExecuteAsync(new SimpleStatement(cql).Bind(pojam));

                var aktivnost = result.Select(row => new Aktivnost
                {
                    Naziv = row.GetValue<string>("naziv"),
                    Opis = row.GetValue<string>("opis"),
                    Cena = row.GetValue<float>("cena"),
                    Skijaliste = new Skijaliste
                    {
                        Naziv = row.GetValue<string>("skijaliste_naziv"),
                        Lokacija = row.GetValue<string>("lokacija"),
                    }
                }).ToList();

                return Ok(aktivnost);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška: {ex.Message}");
            }
        }
     }
}