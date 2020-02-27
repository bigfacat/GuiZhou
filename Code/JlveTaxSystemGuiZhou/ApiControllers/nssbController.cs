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
    public class nssbController : ApiController
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

        JsonResult<string> jrs;

        Model m { get; set; }

        List<string> param { get; set; }

        public nssbController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("sbzs-cjpt-web/nssb/jscwbbSbqx.do")]
        public IHttpActionResult jscwbbSbqx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            set.ValueResult(retJtok,out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getSsqz.do")]
        [HttpPost]
        public ResponseMessageResult getSsqz()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getSsqz(retJtok as JObject);
            set.PlainResult(retJtok,out rmr);
            return rmr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getsbzf.do")]
        public IHttpActionResult getsbzf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            service.getsbzf(retJtok);
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getsbzfmx.do")]
        [HttpPost]
        public ResponseMessageResult getsbzfmx(int pzxh)
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            service.getsbzfmx(pzxh, retJtok as JObject);
            set.PlainResult(retJtok, out rmr);
            return rmr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbZfSubmit.do")]
        public IHttpActionResult sbZfSubmit(JObject body)
        {
            JObject reqParamsJSON = JObject.Parse(body["reqParamsJSON"].Value<string>());

            param.Add(action);
            retJtok = set.GetJsonObject(param);
            //JObject reqParamsJSON = JObject.Parse(Request.Form["reqParamsJSON"]);
            string pzxh = reqParamsJSON["pzxh"].ToString();
            service.sbZfSubmit(int.Parse(pzxh));
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/getsbxx.do")]
        public IHttpActionResult getsbxx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            service.getSbxxcx(retJtok as JObject);
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/printPdf.do")]
        public IHttpActionResult printPdf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/getOtherData.do")]
        [HttpPost]
        public IHttpActionResult getOtherData()
        {
            param.Add(action);
            retJval = set.GetXmlValue(param);
            set.XmlValueResult(retJval,out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/nssb/zzsybnsr/sffx/getData.do")]
        public IHttpActionResult getData()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/getSbqx.do")]
        [HttpPost]
        public ResponseMessageResult getSbqx()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.PlainResult(retJtok,out rmr);
            return rmr;
        }

    }
}