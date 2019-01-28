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
        public string queryWSDataList()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("queryWSDataList.QYSDS_A_18YJD.html"));
            return str;
        }

        public JObject loadDataList()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("loadDataList.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

        public JObject queryDataLoad()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("queryDataLoad.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

    }
}