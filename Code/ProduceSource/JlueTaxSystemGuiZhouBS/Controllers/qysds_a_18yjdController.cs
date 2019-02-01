using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using JlueTaxSystemGuiZhouBS.Code;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class qysds_a_18yjdController : Controller
    {
        public string logger;
        string BDDM = "QYSDS_A_18YJD";
        public qysds_a_18yjdController(string _logger)
        {
            logger = _logger;
        }

        public string begin()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("begin.html"));
            return str;
        }

        public JArray xFormula()
        {
            JArray re_json = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xFormula.json"));
            re_json = JsonConvert.DeserializeObject<JArray>(str);
            return re_json;
        }

        public JObject xInitData()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xInitData.init.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);
            JObject re_json_body = JsonConvert.DeserializeObject<JObject>(re_json["body"].Value<string>());

            GDTXGuiZhouUserYSBQC item = GTXMethod.GetYSBQCByBDDM(this.BDDM);

            GTXResult gr = GTXMethod.GetUserReportData(item.Id.ToString(), "");
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    re_json_body = JsonConvert.DeserializeObject<JObject>(dataValue);
                }
            }

            JObject re_json_body_fq = (JObject)re_json_body["fq"];
            re_json_body_fq["nsrjbxx"]["tbrq"] = item.HappenDate;
            re_json_body_fq["sssq"]["sqQ"] = item.SKSSQQ;
            re_json_body_fq["sssq"]["sqZ"] = item.SKSSQZ;

            //企业所得税期初数设置
            string Name = System.Web.HttpContext.Current.Session["Name"].ToString();
            JToken industry = JToken.Parse(System.IO.File.ReadAllText(Server.MapPath("~/industry.json")));
            industry = industry.Where(a => a["name"].ToString() == Name).ToList()[0];
            re_json_body["ht"]["qysdsczzsyjdSbbdxxVO"]["A200000Ywbd"]["sbbxxForm"] = JObject.Parse(System.IO.File.ReadAllText(Server.MapPath("~/QYSDS_A_18YJD." + industry["value"] + ".json")));

            GTXResult gr1 = GTXMethod.GetCompany();
            if (gr1.IsSuccess)
            {
                JObject jo = new JObject();
                jo = JsonConvert.DeserializeObject<JObject>(gr1.Data.ToString());
                if (jo.HasValues)
                {
                    JObject data_jo = jo;
                    re_json_body_fq["nsrjbxx"]["nsrsbh"] = data_jo["NSRSBH"].ToString();
                    re_json_body_fq["nsrjbxx"]["nsrmc"] = data_jo["NSRMC"].ToString();
                }
            }

            JValue jv = new JValue(JsonConvert.SerializeObject(re_json_body, Formatting.None));
            re_json["body"] = jv;
            re_json["flagExecuteInitial"] = new JValue(false);

            return re_json;
        }

        public JArray xSheets()
        {
            JArray re_json = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xSheets.json"));
            re_json = JsonConvert.DeserializeObject<JArray>(str);
            return re_json;
        }

        public JObject xTempSave()
        {
            JObject re_json = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xTempSave.json"));
            re_json = JsonConvert.DeserializeObject<JObject>(str);

            string inputData = HttpUtility.UrlDecode(Request.Form["formData"], Encoding.GetEncoding("utf-8"));
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(inputData);

            GDTXGuiZhouUserYSBQC item = GTXMethod.GetYSBQCByBDDM(this.BDDM);

            List<GTXNameValue> nameList = new List<GTXNameValue>();
            GTXNameValue nv = new GTXNameValue();
            nv.key = "data";
            byte[] bytes = Encoding.Default.GetBytes(JsonConvert.SerializeObject(input_jo));
            string _result = Convert.ToBase64String(bytes);
            nv.value = _result;
            nameList.Add(nv);
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), item.Id.ToString(), "");
            if (saveresult.IsSuccess)
            {
                GTXMethod.UpdateSBSE(item.Id.ToString(), input_jo.SelectToken("ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj").Value<string>());

                re_json["returnFlag"] = "Y";
            }
            else
            {
                re_json["returnFlag"] = "N";
            }

            return re_json;
        }

        public string exttbsm()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("exttbsm.json"));
            return str;
        }

        public System.Web.Mvc.ActionResult make()
        {
            string msg = "";
            GDTXGuiZhouUserYSBQC item = GTXMethod.GetYSBQCByBDDM(this.BDDM);
            GTXResult upresult = GTXMethod.UpdateYSBQC(item.Id.ToString(), "已申报");
            if (upresult.IsSuccess)
            {
                msg = "";
            }
            else
            {
                msg = upresult.Message;
            }

            if (msg == "")
            {
                ViewBag.success = "true";
                ViewBag.text = "申报成功";
            }
            else
            {
                ViewBag.success = "false";
                ViewBag.text = "申报失败";
                ViewBag.ErrorMsg = msg;
            }

            return View();
        }

    }
}
