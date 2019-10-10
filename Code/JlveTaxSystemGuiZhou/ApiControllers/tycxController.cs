using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Http;
using System.Web.Http.Results;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class tycxController : ApiController
    {
        YsbqcSetting set { get; set; }

        Service service { get; set; }

        string action { get { return ActionContext.ActionDescriptor.ActionName; } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ResponseMessageResult rmr;

        List<string> param { get; set; }

        Model m { get; set; }

        public tycxController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("tycx-cjpt-web/viewsControlController/getCxShowGdsbz.do")]
        [HttpPost]
        public ResponseMessageResult getCxShowGdsbz()
        {
            param.Add(action);
            retStr = set.GetString(param);
            set.PlainResult(retStr, out rmr);
            return rmr;
        }

        [Route("tycx-cjpt-web/cxpt/query.do")]
        [HttpGet]
        public ResponseMessageResult query()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.query(retJtok as JObject);
            set.PlainResult(retJtok, out rmr);
            return rmr;
        }

    }
}