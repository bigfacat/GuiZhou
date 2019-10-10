using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Mvc;
using System.Web;
using System.Web.Routing;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class xxmhController : Controller
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

        public xxmhController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("xxmh/html/index_login.html")]
        public ActionResult index_login()
        {
            return View();
        }

        [Route("xxmh/html/qhsf.html")]
        [AcceptVerbs("get","post")]
        public ActionResult qhsf()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("xxmh/html/index_origin.html")]
        public ActionResult index_origin(string m2)
        {
            if ((m2 ?? "") != "sbzscx")
            {
                m2 = "";
            }
            string Value = Request.Url.Query;
            Value = Regex.Replace(Value, @"m1=(\w+)", "m1=$1");
            Value = Regex.Replace(Value, @"m2=(\w+)", "m2=" + m2);
            string Path = Request.Path + Value;
            if (Value != Request.Url.Query)
            {
                return new RedirectResult(Path);
            }
            return View();
        }

    }
}