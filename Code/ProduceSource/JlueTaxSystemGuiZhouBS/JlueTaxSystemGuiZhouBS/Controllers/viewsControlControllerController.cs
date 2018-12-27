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
    public class viewsControlControllerController : Controller
    {
        public string getShowGdsbz()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getShowGdsbz.do"));
            return str;
        }

        public string getGolobalTitle()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getGolobalTitle.do"));
            return str;
        }

    }
}
