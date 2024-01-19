using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

namespace SkiExplorer.Models
{
    public class Aktivnost
    {
        public string Naziv { get; set; }
        public string Opis { get; set; }
        public float Cena { get; set; }


        public Skijaliste Skijaliste { get; set; }
    }
}
