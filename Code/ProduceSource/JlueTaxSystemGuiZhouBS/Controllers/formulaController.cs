using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    [RoutePrefix("sbzs-cjpt-web/formula")]
    public class formulaController : Controller
    {
        [Route("exttbsm.do")]
        public string exttbsm()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("exttbsm.json"));
            return str;
        }

    }
}