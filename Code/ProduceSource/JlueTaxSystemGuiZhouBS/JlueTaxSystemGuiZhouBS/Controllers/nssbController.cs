﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class nssbController : Controller
    {
        public string getOtherData()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getOtherData.xml"));
            return str;
        }

        public string jscwbbSbqx()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("jscwbbSbqx.json"));
            return str;
        }

    }
}
