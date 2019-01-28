using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class jyxxController : Controller
    {
        public string updateJyxx()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("updateJyxx.json"));
            return str;
        }

    }
}
