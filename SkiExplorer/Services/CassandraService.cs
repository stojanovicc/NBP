using Cassandra;
using SkiExplorer.Services;

namespace SkiExplorer.Services
{
    public class CassandraService : ICassandraService
    {
        private readonly Cassandra.ISession _session;

        public CassandraService(Cassandra.ISession session)
        {
            _session = session;
        }

    }
}


