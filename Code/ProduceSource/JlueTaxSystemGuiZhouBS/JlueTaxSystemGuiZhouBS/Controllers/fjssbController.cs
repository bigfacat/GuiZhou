﻿using System;
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
    public class fjssbController : Controller, IRequiresSessionState
    {
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
                        if (item.ZSXM == "城市维护建设税")
                        {
                            id = item.Id.ToString();
                            tbrq = item.HappenDate;
                            rqQ = item.SKSSQQ;
                            rqZ = item.SKSSQZ;
                        }
                    }
                }
            }

            re_jo_body["qcs"]["initData"]["nsrjbxx"]["tbrq"] = new JValue(tbrq);
            re_jo_body["qcs"]["initData"]["fjssbInitData"]["sssq"]["rqQ"] = new JValue(rqQ);
            re_jo_body["qcs"]["initData"]["fjssbInitData"]["sssq"]["rqZ"] = new JValue(rqZ);

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

                    JArray data_ja = (JArray)data_jo["fjsSbbdxxVO"]["fjssbb"]["sbxxGrid"]["sbxxGridlbVO"];
                    JArray mxxx = (JArray)re_jo_body["qcs"]["formContent"]["fjssbb"]["body"]["sbxxGrid"]["sbxxGridlbVO"];

                    for (int i = 0; i < data_ja.Count; i++)
                    {
                        mxxx[i]["zsxmMc"] = data_ja[i]["zsxmMc"];
                        mxxx[i]["zsxmDm"] = data_ja[i]["zsxmDm"];
                        mxxx[i]["zspmMc"] = data_ja[i]["zspmMc"];
                        mxxx[i]["zspmDm"] = data_ja[i]["zspmDm"];
                        mxxx[i]["ybzzs"] = data_ja[i]["ybzzs"];
                        mxxx[i]["zzsmdse"] = data_ja[i]["zzsmdse"];
                        mxxx[i]["xfs"] = data_ja[i]["xfs"];
                        mxxx[i]["yys"] = data_ja[i]["yys"];
                        mxxx[i]["hj"] = data_ja[i]["hj"];
                        mxxx[i]["sl1"] = data_ja[i]["sl1"];
                        mxxx[i]["bqybtse"] = data_ja[i]["bqybtse"];
                    }

                    re_jo_body["qcs"]["formContent"]["fjssbb"]["body"]["sbxxGrid"]["sbxxGridlbVO"] = mxxx;
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
                        if (item.ZSXM == "城市维护建设税")
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
                GTXMethod.UpdateSBSE(id, input_jo["fjsSbbdxxVO"]["fjssbb"]["sbxxGrid"]["sbxxGridlbVO"][0]["bqybtse"].ToString());

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
            string msg = GTXMethod.make("城市维护建设税");
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