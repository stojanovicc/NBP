namespace SkiExplorer.Models
{
    public class Recenzija
    {
        public int Id { get; set; }
        public string Komentar { get; set; }
        public int Ocena { get; set; }


        public Skijas Skijas { get; set; }
        public Staza Staza { get; set; }
    }
}
