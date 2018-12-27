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
    public class sffxController : Controller
    {

        public JObject getData()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getData.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

    }
}
