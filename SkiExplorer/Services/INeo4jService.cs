namespace SkiExplorer.Services
{
    public interface INeo4jService
    {
        Task RunCypherQueryAsync(string cypherQuery);
        // Dodaj druge metode za rad sa bazom prema potrebama aplikacije
    }

}
