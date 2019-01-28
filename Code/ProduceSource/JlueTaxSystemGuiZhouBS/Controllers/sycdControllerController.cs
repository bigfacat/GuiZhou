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
    public class sycdControllerController : Controller
    {
        //
        // GET: /sycdController/

        public ActionResult Index()
        {
            return View();
        }

        public JObject getCd()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getCd.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

    }
}
