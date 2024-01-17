namespace SkiExplorer.Models
{
    public class VremenskaPrognoza
    {
        public Guid Id { get; set; }
        public float Temperatura { get; set; }
        public int UVIndex { get; set; }
        public float BrzinaVetra { get; set; }
        public int VlaznostVazduha { get; set; }
        public string Padavine { get; set; }
        public float Pritisak { get; set; }
        public string Vreme { get; set; }

        public Skijaliste Skijaliste { get; set; }
    }
}
