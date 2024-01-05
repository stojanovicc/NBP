using Neo4j.Driver;

namespace SkiExplorer.Services
{
    public class Neo4jService : INeo4jService
    {
        private readonly IDriver _driver;

        public Neo4jService(IConfiguration configuration)
        {
            var neo4jUri = new Uri(configuration.GetConnectionString("Neo4jConnection"));
            var neo4jUser = configuration["Neo4jUser"];
            var neo4jPassword = configuration["Neo4jPassword"];


            _driver = GraphDatabase.Driver(neo4jUri, AuthTokens.Basic(neo4jUser, neo4jPassword));
        }

        public async Task RunCypherQueryAsync(string cypherQuery)
        {
            using var session = _driver.AsyncSession();
            await session.RunAsync(cypherQuery);
        }

        // Implementiraj druge metode servisa za rad sa Neo4j bazom
    }

}
