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
    public class tysbController : Controller
    {
        public string logger;

        public tysbController(string _logger)
        {
            logger = _logger;
        }

        public string begin()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("begin.html"));
            return str;
        }

        public string form(string sssqQ, string sssqZ)
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("form.html")).Replace("@@sssqQ", sssqQ).Replace("@@sssqZ", sssqZ);
            return str;
        }

        public JArray xFormula()
        {
            JArray re_jo = new JArray();
            string str = System.IO.File.ReadAllText(Server.MapPath("xFormula.json"));
            re_jo = JsonConvert.DeserializeObject<JArray>(str);
            return re_jo;
        }

        public string xInitData(string sssqQ, string sssqZ)
        {

            string str = "";
            JObject re_jo = new JObject();

            int sssqQ_m = int.Parse(sssqQ.Split('-')[1]);
            int sssqQ_d = int.Parse(sssqQ.Split('-')[2]);
            int sssqZ_m = int.Parse(sssqZ.Split('-')[1]);
            int sssqZ_d = int.Parse(sssqZ.Split('-')[2]);

            if (sssqZ_m - sssqQ_m == 0 && sssqZ_d - sssqQ_d > 0)
            {
                str = System.IO.File.ReadAllText(Server.MapPath("xInitData.error.html"));
            }
            else if (sssqZ_m - sssqQ_m == 2)
            {
                str = System.IO.File.ReadAllText(Server.MapPath("xInitData.quarter.json"));
                re_jo = JsonConvert.DeserializeObject<JObject>(str);
                str = JsonConvert.SerializeObject(getGHJFData(re_jo));
            }
            else
            {
                str = System.IO.File.ReadAllText(Server.MapPath("xInitData.error.html"));
            }

            return str;
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

            string zspmDm = input_jo["fxmtysbbdVO"]["fxmtySbb"]["sbxxGrid"]["sbxxGridlb"][0]["zspmDm"].ToString();
            string bqybtsfe = input_jo["fxmtysbbdVO"]["fxmtySbb"]["sbxxGrid"]["sbxxGridlb"][0]["bqybtsfe"].ToString();

            string id = "";
            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.BDDM == "GHJF")
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
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), id, zspmDm);
            if (saveresult.IsSuccess)
            {
                GTXMethod.UpdateSBSE(id, bqybtsfe);
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
            string msg = GTXMethod.make("工会经费");
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

        public JObject getGHJFData(JObject j)
        {
            JObject re_jo = new JObject(j);
            string str = System.IO.File.ReadAllText(Server.MapPath("xInitData.quarter.json"));
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
                        if (item.BDDM == "GHJF")
                        {
                            id = item.Id.ToString();
                            tbrq = item.HappenDate;
                            rqQ = item.SKSSQQ;
                            rqZ = item.SKSSQZ;
                        }
                    }
                }
            }

            re_jo_body["fxmtysbbdVO"]["fxmtySbb"]["sbbhead"]["sbrq1"] = tbrq;
            re_jo_body["fxmtysbbdVO"]["fxmtySbb"]["sbbhead"]["skssqq"] = rqQ;
            re_jo_body["fxmtysbbdVO"]["fxmtySbb"]["sbbhead"]["skssqz"] = rqZ;

            GTXResult gr1 = GTXMethod.GetCompany();
            if (gr1.IsSuccess)
            {
                JObject jo = new JObject();
                jo = JsonConvert.DeserializeObject<JObject>(gr1.Data.ToString());
                if (jo.HasValues)
                {
                    JObject data_jo = jo;
                    re_jo_body["fxmtysbbdVO"]["fxmtySbb"]["sbbhead"]["nsrmc"] = data_jo["NSRMC"];
                    re_jo_body["fxmtysbbdVO"]["fxmtySbb"]["sbbhead"]["nsrsbh"] = data_jo["NSRSBH"];
                }
            }

            GTXResult gr = GTXMethod.GetUserReportData(id, "399001010");
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    JObject data_jo = JsonConvert.DeserializeObject<JObject>(dataValue);

                    JArray data_ja = (JArray)data_jo["fxmtysbbdVO"]["fxmtySbb"]["sbxxGrid"]["sbxxGridlb"];
                    JArray mxxx = (JArray)re_jo_body["qcs"]["formContent"]["sbTysb"]["body"]["sbxxGrid"]["sbxxGridlb"];
                    for (int i = 0; i < data_ja.Count; i++)
                    {
                        mxxx[i]["skssqq"] = data_ja[i]["sfkssqq"];
                        mxxx[i]["skssqz"] = data_ja[i]["sfkssqz"];
                        mxxx[i]["ysx"] = data_ja[i]["ysx"];
                        mxxx[i]["kce"] = data_ja[i]["jcx"];
                        mxxx[i]["yssdl"] = data_ja[i]["yssdl"];
                        mxxx[i]["jsyj"] = data_ja[i]["jsfyj"];
                        mxxx[i]["sl"] = data_ja[i]["sflhdwse"];
                        mxxx[i]["sskcs"] = data_ja[i]["sskcs"];
                        mxxx[i]["ynse"] = data_ja[i]["bqynsfe"];
                        mxxx[i]["jmse"] = data_ja[i]["bqjmsfe"];
                        mxxx[i]["yjse"] = data_ja[i]["bqyjsfe"];
                        mxxx[i]["ysbse"] = data_ja[i]["bqybtsfe"];
                    }

                    re_jo_body["qcs"]["formContent"]["sbTysb"]["body"]["sbxxGrid"]["sbxxGridlb"] = mxxx;
                }
            }
            re_jo["body"] = re_jo_body;
            return re_jo;
        }

        public string exttbsm()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("exttbsm.json"));
            return str;
        }

    }
}
