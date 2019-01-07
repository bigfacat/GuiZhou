using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class yqsbqcController : Controller
    {
        public JObject enterYqsbUrl()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("enterYqsbUrl.QYSDS_A_18YJD.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

    }
}
