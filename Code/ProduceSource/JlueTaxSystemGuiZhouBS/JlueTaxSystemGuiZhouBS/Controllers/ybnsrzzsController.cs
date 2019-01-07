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
    public class ybnsrzzsController : Controller,IRequiresSessionState
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
            string sbrq = "";
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
                        if (item.BDDM == "YBNSRZZS")
                        {
                            id = item.Id.ToString();
                            sbrq = item.HappenDate;
                            rqQ = item.SKSSQQ;
                            rqZ = item.SKSSQZ;
                        }
                    }
                }
            }

            JObject zzsybnsrsbInitData_jo = (JObject)re_jo_body["qcs"]["initData"]["zzsybnsrsbInitData"];
            GTXResult gr1 = GTXMethod.GetUserReportData(id, "YBNSRZZSQCS");
            if (gr1.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr1.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    zzsybnsrsbInitData_jo = JsonConvert.DeserializeObject<JObject>(dataValue);
                    zzsybnsrsbInitData_jo.Add("sbrq", new JValue(sbrq));
                }
            }
            zzsybnsrsbInitData_jo["sbrq"] = sbrq;
            zzsybnsrsbInitData_jo["sssq"]["rqQ"] = rqQ;
            zzsybnsrsbInitData_jo["sssq"]["rqZ"] = rqZ;
            re_jo_body["qcs"]["initData"]["zzsybnsrsbInitData"] = zzsybnsrsbInitData_jo;

            GTXResult gr2 = GTXMethod.GetUserReportData(id, "YBNSRZZS");
            if (gr2.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr2.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    JObject data_jo = JsonConvert.DeserializeObject<JObject>(dataValue);
                    re_jo_body["zzsybsbSbbdxxVO"] = data_jo["zzsybsbSbbdxxVO"];
                }
            }

            JObject nsrxx_jo = GTXMethod.getNsrxx((JObject)re_jo_body["qcs"]["initData"]["nsrjbxx"]);
            re_jo_body["qcs"]["initData"]["nsrjbxx"] = nsrxx_jo;

            re_jo["body"] = re_jo_body;

            return re_jo;
        }

        public JArray xSheets()
        {
            JArray re_j = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xSheets.json"));
            re_j = JsonConvert.DeserializeObject<JArray>(str);

            string id = "";
            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.BDDM == "YBNSRZZS")
                        {
                            id = item.Id.ToString();
                        }
                    }
                }
            }

            GTXResult gr = GTXMethod.GetUserReportData(id, "YBNSRZZSXBSZ");
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    JObject data_jo = JsonConvert.DeserializeObject<JObject>(dataValue);
                    JObject data_jo_jcxxsz = (JObject)data_jo["jcxxsz"];

                    for (int i = re_j.Count - 1; i >= 0; i--)
                    {
                        string s = data_jo_jcxxsz["" + re_j[i]["dzbdbm"] + ""].ToString();
                        if (s == "N")
                        {
                            re_j.RemoveAt(i);
                        }
                    }

                }
            }

            return re_j;
        }

        public JObject xTempSave()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("xTempSave.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);

            string inputData = HttpUtility.UrlDecode(Request.Form["formData"], Encoding.GetEncoding("utf-8"));
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(inputData);

            JArray fjsxxGridlb = (JArray)input_jo["zzsybsbSbbdxxVO"]["zzsfjssb"]["fjsxxGrid"]["fjsxxGridlb"];
            JArray zbGridlbVO = (JArray)input_jo["zzsybsbSbbdxxVO"]["zzssyyybnsr_zb"]["zbGrid"]["zbGridlbVO"];

            foreach (JObject j in fjsxxGridlb)
            {
                j["jsyj"] = zbGridlbVO[0]["ynsehj"];
                decimal ynse = Math.Round(decimal.Parse(j["jsyj"].ToString()) * decimal.Parse(j["sl1"].ToString()), 2);
                j["ynse"] = ynse;
                j["ybtse"] = ynse;
            }

            string id = "";
            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.BDDM == "YBNSRZZS")
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
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), id, "YBNSRZZS");
            if (saveresult.IsSuccess)
            {
                GTXMethod.UpdateSBSE(id, input_jo["zzsybsbSbbdxxVO"]["zzssyyybnsr_zb"]["zbGrid"]["zbGridlbVO"][0]["bqybtse"].ToString());

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
            string msg = GTXMethod.make("增值税");
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
