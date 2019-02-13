using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    [RoutePrefix("sbzs-cjpt-web/biz/sbqc")]
    public class sbqcController : Controller
    {
        [Route("sbqc_aqsb")]
        public string sbqc_aqsb()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("sbqc_aqsb.html"));
            return str;
        }

        [Route("sbqc_qtsb")]
        public string sbqc_qtsb()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("sbqc_qtsb.html"));
            return str;
        }

    }
}