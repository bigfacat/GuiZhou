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
    public class cwbb_qy_kjzz_ybqyController : Controller, IRequiresSessionState
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

            string id = "";
            string bsrq = "";
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
                        if (item.ZSXM == "财务报表")
                        {
                            id = item.Id.ToString();
                            bsrq = item.HappenDate;
                            rqQ = item.SKSSQQ;
                            rqZ = item.SKSSQZ;

                        }
                    }
                }
            }

            JObject re_jo_body = new JObject();
            re_jo_body = JsonConvert.DeserializeObject<JObject>(re_jo["body"].ToString());

            GTXResult gr = GTXMethod.GetUserReportData(id, "");
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    re_jo_body = JsonConvert.DeserializeObject<JObject>(dataValue);
                }
            }
            re_jo_body["qcs"]["bsrq"] = new JValue(bsrq);
            re_jo_body["ZlbssldjNsrxxVO"]["ssqq"] = new JValue(rqQ);
            re_jo_body["ZlbssldjNsrxxVO"]["ssqz"] = new JValue(rqZ);
            re_jo["body"] = re_jo_body;

            JObject nsrxx_jo = GTXMethod.getNsrxx((JObject)re_jo["body"]["qcs"]["djNsrxx"]);
            re_jo["body"]["qcs"]["djNsrxx"] = nsrxx_jo;

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
            //Stream inputStream = Request.InputStream;
            //Encoding encoding = Request.ContentEncoding;
            //StreamReader streamReader = new StreamReader(inputStream, encoding);
            //string inputData = streamReader.ReadToEnd();

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
                        if (item.ZSXM == "财务报表")
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
            string msg = GTXMethod.make("财务报表");
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