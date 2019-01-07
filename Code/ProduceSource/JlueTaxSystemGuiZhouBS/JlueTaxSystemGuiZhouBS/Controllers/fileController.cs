using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class fileController : Controller
    {
        public string readFile()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("readFile.json"));
            return str;
        }

    }
}
