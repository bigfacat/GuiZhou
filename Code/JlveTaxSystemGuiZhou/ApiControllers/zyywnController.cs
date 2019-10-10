using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Http;
using System.Web.Mvc;
using Route=System.Web.Http.RouteAttribute;
using System.Web.Http.Results;
using System.Web;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class zyywnController : ApiController
    {
        YsbqcSetting set { get; set;}

        Service service { get; set;}

        string action { get { return ActionContext.ActionDescriptor.ActionName; } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        JsonResult<JToken> jrj;

        ContentResult cr { get; set; }

        List<string> param { get; set;}

        Model m { get; set; }

        public zyywnController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("zyywn-cjpt-web/czgc/loadDataList.do")]
        public IHttpActionResult loadDataList()
        {
            var context = Request.Properties["MS_HttpContext"] as HttpContextWrapper;
            string glgn = context.Request.Form["glgn"];
            
            param.Add(action);
            param.Add(glgn);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("zyywn-cjpt-web/czgc/queryDataLoad.do")]
        public IHttpActionResult queryDataLoad()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

    }
}