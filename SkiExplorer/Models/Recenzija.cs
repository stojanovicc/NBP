namespace SkiExplorer.Models
{
    public class Recenzija
    {
        public int Id { get; set; }
        public required string Korisnik { get; set; }
        public required string Komentar { get; set; }
        public int Ocena { get; set; }


        public Staza? Staza { get; set; }
    }
}
