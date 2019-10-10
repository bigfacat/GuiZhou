using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Http;
using System.Net.Http;
using JlveTaxSystemGuiZhou.Extensions;
using System.Web.Http.Results;
using System.Web;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class bizController : ApiController
    {
        YsbqcSetting set { get;set; }

        Service service { get;set; }

        HttpRequestMessage req { get { return Request; } }

        string action { get { return ActionContext.ActionDescriptor.ActionName; } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ResponseMessageResult rmr;

        JsonResult<JToken> jrj;

        List<string> param { get; set; }

        Model m { get; set; }

        public bizController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/enterSbqc")]
        public async Task<IHttpActionResult> enterSbqc()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            await service.aqsb_getSbqcList(retJtok as JObject);
            set.JsonResult(retJtok,out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/enterQtsb")]
        public IHttpActionResult enterQtsb()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.enterQtsb(retJtok as JObject);
            set.JsonResult(retJtok,out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/sbqxControl")]
        public ResponseMessageResult sbqxControl(string type, string yzpzzlDm=null)
        {
            param.Add(action);
            param.Add(type);
            if (yzpzzlDm != null)
            {
                param.Add(yzpzzlDm);
            }
            retJtok = set.GetJsonObject(param);
            set.PlainResult(retJtok, out rmr);
            return rmr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/{submenu}/sburlControl")]
        public ResponseMessageResult sburlControl(string sbywbm)
        {
            param.Add(action);
            param.Add(sbywbm);
            retJtok = set.GetJsonObject(param);
            set.PlainResult(retJtok, out rmr);
            return rmr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/cburlControl")]
        [HttpGet]
        public ResponseMessageResult cburlControl(string sbywbm)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.PlainResult(retJtok,out rmr);
            return rmr;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xInitData")]
        [HttpGet]
        public async Task<IHttpActionResult> xInitData(Ywbm dm)
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            await service.getInitData(dm, retJobj);
            set.JsonResult(retJobj, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xFormula")]
        [HttpGet]
        public IHttpActionResult xFormula()
        {
            param.Add(action);
            retJtok = set.GetJsonArray(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xSheets")]
        [HttpGet]
        public async Task<IHttpActionResult> xSheets(Ywbm dm)
        {
            param.Add(action);
            retJarr = set.GetJsonArray(param);
            await service.xSheets(dm, retJarr);
            set.JsonResult(retJarr, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/xTempSave")]
        public async Task<IHttpActionResult> xTempSave(string dm, [FromBody]JObject body)
        {
            JObject formData = JObject.Parse(HttpUtility.UrlDecode(body["formData"].Value<string>()));

            param.Add(action);
            retJtok = set.GetJsonObject(param);
            Ywbm bm = EnumExtensions.Parse<Ywbm>(dm);
            await service.SaveDataService(bm, formData);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/yqsb/yqsbqc/enterYqsbUrl")]
        [HttpGet]
        public IHttpActionResult enterYqsbUrl(string sbywbm)
        {
            param.Add(action);
            param.Add(sbywbm);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/refreshSbqc")]
        public async Task<ResponseMessageResult> refreshSbqc(string type)
        {
            param.Add(action);
            param.Add(type);
            retJtok = set.GetJsonObject(param);
            await service.aqsb_getSbqcList(retJtok as JObject, type);
            set.PlainResult(retJtok,out rmr);
            return rmr;
        }

    }
}