namespace SkiExplorer.Models
{
    public class VremenskaPrognoza
    {
        public int Id { get; set; }
        public float Stanje { get; set; }
        public float Temperatura { get; set; }
        public List<Staza> Staze { get; set; }
        //za ovo ne znam gde
    }
}
