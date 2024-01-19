using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

namespace SkiExplorer.Models
{
    public class Obavestenje
    {
        public string Naslov { get; set; }
        public string Sadrzaj { get; set; }
        public string DatumObjave { get; set; }
        public string Satus { get; set; }


        public Skijaliste Skijaliste { get; set; }
    }
}