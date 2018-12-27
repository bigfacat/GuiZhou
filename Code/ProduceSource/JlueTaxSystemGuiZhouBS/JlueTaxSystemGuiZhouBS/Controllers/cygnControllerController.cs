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
    public class cygnControllerController : Controller
    {
        //
        // GET: /cygnController/

        public ActionResult Index()
        {
            return View();
        }

        public JArray getCygncdDetail()
        {
            JArray re_ja = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("getCygncdDetail.do"));
            re_ja = JsonConvert.DeserializeObject<JArray>(str);
            return re_ja;
        }

    }
}
