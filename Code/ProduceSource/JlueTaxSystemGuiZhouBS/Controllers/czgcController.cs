using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class czgcController : Controller
    {
        public string queryWSDataList(string ywbm)
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("queryWSDataList." + ywbm + ".html"));
            return str;
        }

        public JObject loadDataList(string glgn)
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("loadDataList." + glgn + ".json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

        public JObject queryDataLoad(string czgcid)
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("queryDataLoad." + czgcid + ".json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

    }
}