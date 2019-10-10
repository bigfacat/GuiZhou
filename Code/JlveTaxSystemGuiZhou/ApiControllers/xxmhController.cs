using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web.Http;
using Route=System.Web.Http.RouteAttribute;
using HttpPost = System.Web.Http.HttpPostAttribute;
using System.Web.Mvc;
using JlveTaxSystemGuiZhou.Extensions;
using System.Web.Http.Results;
using System.Net.Http;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class xxmhController : ApiController
    {
        YsbqcSetting set { get; set;}

        Service service { get; set;}

        string action { get { return ActionContext.ActionDescriptor.ActionName; } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ResponseMessageResult rmr;

        JsonResult<JToken> jrj;

        ContentResult cr { get; set; }

        List<string> param { get; set; }

        Model m { get; set; }

        public xxmhController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("xxmh/viewsControlController/getShowGdsbz.do")]
        [HttpPost]
        public ResponseMessageResult getShowGdsbz()
        {
            param.Add(action);
            retStr = set.GetString(param);
            set.PlainResult(retStr,out rmr);
            return rmr;
        }

        [Route("xxmh/viewsControlController/getGolobalTitle.do")]
        [HttpPost]
        public ResponseMessageResult getGolobalTitle()
        {
            param.Add(action);
            retStr = set.GetString(param);
            set.PlainResult(retStr, out rmr);
            return rmr;
        }

        [Route("xxmh/portalSer/checkLogin.do")]
        public IHttpActionResult checkLogin()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/txss/txfdsas.do")]
        public IHttpActionResult txfdsas()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            set.JsonResult(retJtok,out jrj);
            return jrj;
        }

        [Route("xxmh/sycdController/getCd.do")]
        [HttpPost]
        public IHttpActionResult getCd()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.formatCd(retJobj);
            set.JsonResult(retJobj, out jrj);
            return jrj;
        }

        [Route("xxmh/portalSer/getRootMenu.do")]
        public ResponseMessageResult getRootMenu()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.setHeadNsrxx(retJobj);
            set.PlainResult(retJobj, out rmr);
            return rmr;
        }

        [Route("xxmh/portalSer/getSubMenus.do")]
        public ResponseMessageResult getSubMenus(string m1)
        {
            param.Add(action);
            retJobj = service.getSubMenus(param, m1);
            set.PlainResult(retJobj, out rmr);
            return rmr;
        }

        [Route("xxmh/mlogController/addLog.do")]
        public IHttpActionResult addLog()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/myCenterController/getDbsx.do")]
        [HttpPost]
        public IHttpActionResult getDbsx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getDbsx(retJtok);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/myCenterController/getSstx.do")]
        [HttpPost]
        public IHttpActionResult getSstx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/myCenterController/syTzgg.do")]
        public IHttpActionResult syTzgg()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/cygnController/getCygncdDetail.do")]
        [HttpPost]
        public IHttpActionResult getCygncdDetail()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("xxmh/myCenterController/updateDbsxZt.do")]
        public IHttpActionResult updateDbsxZt()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

    }
}