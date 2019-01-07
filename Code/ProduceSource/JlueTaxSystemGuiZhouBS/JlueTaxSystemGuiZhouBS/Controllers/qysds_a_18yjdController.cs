using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using JlueTaxSystemGuiZhouBS.Code;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class qysds_a_18yjdController : Controller
    {
        public string begin()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("begin.html"));
            return str;
        }

        public JArray xFormula()
        {
            JArray re_json = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xFormula.json"));
            re_json = JsonConvert.DeserializeObject<JArray>(str);
            return re_json;
        }

        public JObject xInitData()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xInitData.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

        public JArray xSheets()
        {
            JArray re_json = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xSheets.json"));
            re_json = JsonConvert.DeserializeObject<JArray>(str);
            return re_json;
        }

        public JObject xTempSave()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xTempSave.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            return re_json;
        }

        public string exttbsm()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("exttbsm.json"));
            return str;
        }

    }
}
