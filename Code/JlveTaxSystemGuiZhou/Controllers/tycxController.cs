using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Mvc;
using System.Web;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class tycxController : Controller
    {
        YsbqcSetting set { get; set; }

        Service service { get; set; }

        HttpRequestBase req { get { return Request; } }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        List<string> param { get; set; }

        Model m { get; set; }

        public tycxController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("tycx-cjpt-web/cxpt/4thLvlFunTabsInit.do")]
        public ActionResult _4thLvlFunTabsInit()
        {
            param.Add("4thLvlFunTabsInit");
            cr = set.GetHtml(param);
            return cr;
        }
    }
}