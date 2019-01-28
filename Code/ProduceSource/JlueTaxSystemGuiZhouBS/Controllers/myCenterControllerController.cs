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
    public class myCenterControllerController : Controller
    {

        public JObject getDbsx()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getDbsx.do"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }
        public JObject getSstx()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getSstx.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

    }
}
