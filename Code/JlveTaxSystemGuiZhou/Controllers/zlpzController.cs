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
    public class zlpzController : Controller
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

        public zlpzController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("zlpz-cjpt-web/attachment/getDzbdFlzlList.do")]
        public ActionResult getDzbdFlzlList(string swsxDm)
        {
            param.Add(action);
            param.Add(swsxDm);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do")]
        public ActionResult viewOrDownloadPdfFile()
        {
            return View(YsbqcSetting.functionNotOpen);
        }

    }
}