using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Cassandra;
using Neo4j.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Configure the IDriver interface
var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "anastasijaandjela"));

// Register the IDriver instance for dependency injection
builder.Services.AddSingleton<IDriver>(driver);

// Konfiguracija Cassandra drajvera
//var cassandraCluster = Cluster.Builder()
//    .AddContactPoint("localhost") // Postavite svoju kontakt tačku
//    .Build();

//var cassandraSession = cassandraCluster.Connect("my_keyspace"); // Postavite ime ključnog prostora

//// Registrujte ISession instancu za dependency injection
//builder.Services.AddSingleton<Cassandra.ISession>(cassandraSession);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins("http://localhost:3000");
    });

});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("CORS");

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapControllers();
});

app.Run();