using JlueTaxSystemGuiZhouBS.Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    [RoutePrefix("sbzs-cjpt-web/deliver/sbxxcx")]
    public class sbxxcxController : Controller
    {
        string BDDM = "FJSSB";

        [Route("sbcxjdy.jsp")]
        public System.Web.Mvc.ActionResult sbcxjdy()
        {
            GDTXGuiZhouUserYSBQC ysbqc = GTXMethod.GetYSBQCByBDDM(this.BDDM);
            string SBQX = ysbqc.SBQX;
            ViewBag.date = SBQX;

            return View();
        }

    }
}