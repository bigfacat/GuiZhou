using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Http;
using JlveTaxSystemGuiZhou.Extensions;
using System.Web.Http.Results;
using System.Web;

namespace JlveTaxSystemGuiZhou.ApiControllers
{
    public class sbzsController : ApiController
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

        JsonResult<string> jrs;

        List<string> param { get; set; }

        Model m { get; set; }

        public sbzsController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("sbzs-cjpt-web/ywzt/getYsData.do")]
        [HttpPost]
        public IHttpActionResult getYsData()
        {
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            set.JsonResult(retJtok,out jrj);
            return jrj;
        }

        [Route("sbzs-cjpt-web/cbxxcx/getCbxxcx.do")]
        public IHttpActionResult getCbxxcx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            set.ValueResult(retJtok,out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/setting/mainSetting.do")]
        public async Task<IHttpActionResult> mainSetting(Ywbm ywbm)
        {
            param.Add(action);
            param.Add(ywbm.ToString());
            retJtok = set.GetJsonValue(param);
            await service.mainSetting(ywbm, retJtok);
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/setting/saveData.do")]
        public async Task<IHttpActionResult> saveData(Ywbm ywbm, [FromBody]string requestBody)
        {
            JObject input = JObject.Parse(requestBody);
            param.Add(action);
            param.Add(ywbm.ToString());
            retJtok = set.GetJsonValue(param);
            await service.SaveDataService(ywbm, input);
            set.ValueResult(retJtok, out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/jyxx/updateJyxx.do")]
        public IHttpActionResult updateJyxx()
        {
            param.Add(action);
            retJval = set.GetJsonValue(param) as JValue;
            set.ValueResult(retJval,out jrs);
            return jrs;
        }

        [Route("sbzs-cjpt-web/save/saveYsqbw.do")]
        public async Task<IHttpActionResult> saveYsqbw()
        {
            var context = Request.Properties["MS_HttpContext"] as HttpContextWrapper;
            string ywbm = context.Request.Form["ywbm"];
            string str = HttpUtility.UrlDecode(context.Request.Form["saveData"]);
            JObject saveData = JsonConvert.DeserializeObject<JObject>(str);

            Ywbm bm = EnumExtensions.Parse<Ywbm>(ywbm);
            param.Add(action);
            retJtok = set.GetJsonObject(param);
            await service.SaveDataService(bm, saveData);
            set.JsonResult(retJtok, out jrj);
            return jrj;
        }

    }
}