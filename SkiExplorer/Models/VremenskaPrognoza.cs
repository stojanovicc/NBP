namespace SkiExplorer.Models
{
    public class VremenskaPrognoza
    {
        public string Datum { get; set; }
        public int Temperatura { get; set; }
        public int UVIndex { get; set; }
        public float BrzinaVetra { get; set; }
        public int VlaznostVazduha { get; set; }
        public string Padavine { get; set; }
        public float Pritisak { get; set; }
        

        public Skijaliste Skijaliste { get; set; }
    }
}
