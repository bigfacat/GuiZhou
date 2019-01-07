using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Web.SessionState;
using System.Text;
using JlueTaxSystemGuiZhouBS.Code;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class yhssbController : Controller
    {
        public string begin()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("begin.html"));
            return str;
        }

        public JArray xFormula()
        {
            JArray re_jo = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xFormula.json"));
            re_jo = JsonConvert.DeserializeObject<JArray>(str);
            return re_jo;
        }

        public JObject xInitData()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xInitData.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);

            JObject re_jo_body = new JObject();
            re_jo_body = JsonConvert.DeserializeObject<JObject>(re_jo["body"].ToString());

            string id = "";
            string tbrq = "";
            string rqQ = "";
            string rqZ = "";

            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.ZSXM == "印花税")
                        {
                            id = item.Id.ToString();
                            tbrq = item.HappenDate;
                            rqQ = item.SKSSQQ;
                            rqZ = item.SKSSQZ;

                        }
                    }
                }
            }

            re_jo_body["qcs"]["initData"]["yhsInitData"]["tbrq"] = new JValue(tbrq);
            re_jo_body["qcs"]["initData"]["yhsInitData"]["sssq"]["rqQ"] = new JValue(rqQ);
            re_jo_body["qcs"]["initData"]["yhsInitData"]["sssq"]["rqZ"] = new JValue(rqZ);

            JObject nsrxx_jo = GTXMethod.getNsrxx((JObject)re_jo_body["qcs"]["initData"]["nsrjbxx"]);
            re_jo_body["qcs"]["initData"]["nsrjbxx"] = nsrxx_jo;

            GTXResult gr = GTXMethod.GetUserReportData(id, "");
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    JObject data_jo = JsonConvert.DeserializeObject<JObject>(dataValue);

                    JArray data_ja = (JArray)data_jo["yyssbbdxxVO"]["yhssb"]["yhssbGrid"]["yhssbGridlb"];
                    JArray mxxx = (JArray)re_jo_body["qcs"]["formContent"]["sbYhs"]["body"]["mxxxs"]["mxxx"];

                    for (int i = 0; i < data_ja.Count; i++)
                    {
                        mxxx[i]["yspzMc"] = data_ja[i]["zspmMc"];
                        mxxx[i]["yspzDm"] = data_ja[i]["zspmDm"];
                        mxxx[i]["jsjehjs"] = data_ja[i]["jsje"];
                        mxxx[i]["hdyj"] = data_ja[i]["hdzsHdde"];
                        mxxx[i]["hdbl"] = data_ja[i]["hdzsHdbl"];
                        mxxx[i]["sysl"] = data_ja[i]["sysl"];
                        mxxx[i]["bqynse"] = data_ja[i]["bqynse"];
                        mxxx[i]["bqyjse"] = data_ja[i]["bqyjse1"];
                        mxxx[i]["jmxzDm"] = data_ja[i]["ssjmxzDm"];
                        mxxx[i]["jmxzMc"] = data_ja[i]["ssjmxzPjMc"];
                        mxxx[i]["jmse"] = data_ja[i]["jmse"];
                        mxxx[i]["bqybtse"] = data_ja[i]["bqybtse"];
                    }
                    re_jo_body["qcs"]["formContent"]["sbYhs"]["body"]["mxxxs"]["mxxx"] = mxxx;
                }
            }
            re_jo["body"] = re_jo_body;
            return re_jo;
        }

        public JArray xSheets()
        {
            JArray re_jo = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xSheets.json"));
            re_jo = JsonConvert.DeserializeObject<JArray>(str);
            return re_jo;
        }

        public JObject xTempSave()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xTempSave.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);

            string inputData = HttpUtility.UrlDecode(Request.Form["formData"], Encoding.GetEncoding("utf-8"));
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(inputData);

            string id = "";
            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.ZSXM == "印花税")
                        {
                            id = item.Id.ToString();
                        }
                    }
                }
            }

            List<GTXNameValue> nameList = new List<GTXNameValue>();
            GTXNameValue nv = new GTXNameValue();
            nv.key = "data";
            byte[] bytes = Encoding.Default.GetBytes(JsonConvert.SerializeObject(input_jo));
            string _result = Convert.ToBase64String(bytes);
            nv.value = _result;
            nameList.Add(nv);
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), id, "");
            if (saveresult.IsSuccess)
            {
                decimal dec = 0;
                JArray ja =(JArray) input_jo["yyssbbdxxVO"]["yhssb"]["yhssbGrid"]["yhssbGridlb"];
                foreach (JObject j in ja)
                {
                    dec += decimal.Parse(j["bqybtse"].ToString());
                }
                GTXMethod.UpdateSBSE(id, dec.ToString());
                re_jo["returnFlag"] = "Y";
            }
            else
            {
                re_jo["returnFlag"] = "N";
            }
            return re_jo;
        }

        public System.Web.Mvc.ActionResult make()
        {
            string msg = GTXMethod.make("印花税");
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

        public string exttbsm()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("exttbsm.json"));
            return str;
        }

    }
}
