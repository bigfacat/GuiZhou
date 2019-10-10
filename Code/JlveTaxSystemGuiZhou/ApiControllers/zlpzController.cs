using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Http;
using System.Web.Mvc;
using Route = System.Web.Http.RouteAttribute;
using System.Web.Http.Results;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class zlpzController : ApiController
    {
        YsbqcSetting set { get; set; }

        Service service { get; set; }

        string action { get { return ActionContext.ActionDescriptor.ActionName; } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        JsonResult<JToken> jrj;

        ContentResult cr { get; set; }

        List<string> param { get; set; }
        Model m { get; set; }

        public zlpzController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("zlpz-cjpt-web/attachment/queryFszlfs.do")]
        public IHttpActionResult queryFszlfs(string swsxDm)
        {
            param.Add(action);
            param.Add(swsxDm);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok,out jrj);
            return jrj;
        }

    }
}