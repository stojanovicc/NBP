﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

namespace SkiExplorer.Models
{
    public class Staza
    {
        public required string Naziv { get; set;}
        public required string Tezina { get; set;}
        public float Duzina { get; set;}
        public Skijaliste? Skijaliste { get; set; }

    }
}
