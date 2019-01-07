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
    public class settingController : Controller, IRequiresSessionState
    {
        public string mainSetting(string ywbm)
        {
            string str = System.IO.File.ReadAllText(Server.MapPath(ywbm + ".json"));
            if (ywbm != "CWBBYDY")
            {
                str = mainSettingForYBNSRZZS(str, ywbm);
            }
            else if (ywbm == "CWBBYDY")
            {
                str = mainSettingForCWBBYDY(str);
            }

            return str;
        }

        public string saveData(string ywbm)
        {
            string str = "";
            if (ywbm.Equals("CWBBYDY"))
            {
                str = saveDataForCWBBYDY();
            }
            else
            {
                str = saveDataForYBNSRZZS(ywbm);
            }
            return str;
        }

        public string mainSettingForYBNSRZZS(string str, string ywbm)
        {
            JObject re_jo = new JObject();
            JValue re_jv = new JValue("");

            re_jv = JsonConvert.DeserializeObject<JValue>(str);
            re_jo = JsonConvert.DeserializeObject<JObject>(re_jv.ToString());

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

            GTXResult gr = GTXMethod.GetUserReportData(id, ywbm);
            if (gr.IsSuccess)
            {
                JArray jarr = new JArray();
                jarr = JsonConvert.DeserializeObject<JArray>(gr.Data.ToString());
                if (jarr.Count > 0)
                {
                    byte[] bytes = Convert.FromBase64String(jarr[0]["dataValue"].ToString().Replace(" ", "+"));
                    string dataValue = Encoding.Default.GetString(bytes);
                    JObject data_jo = JsonConvert.DeserializeObject<JObject>(dataValue);

                    re_jo["body"] = new JValue(JsonConvert.SerializeObject(data_jo));
                    str = "" + JsonConvert.SerializeObject(new JValue(JsonConvert.SerializeObject(re_jo))) + "";
                }
            }

            return str;
        }

        public string saveDataForYBNSRZZS(string ywbm)
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("saveData.json"));

            Request.InputStream.Seek(0, SeekOrigin.Begin);

            Stream inputStream = Request.InputStream;
            Encoding encoding = Request.ContentEncoding;
            StreamReader streamReader = new StreamReader(inputStream, encoding);
            string inputData = streamReader.ReadToEnd();

            JValue input_jv = JsonConvert.DeserializeObject<JValue>(inputData);
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(input_jv.ToString());

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
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), id, ywbm);
            if (saveresult.IsSuccess)
            {
                str = str.Replace("@@returnFlag", "Y");
            }
            else
            {
                str = str.Replace("@@returnFlag", "N");
            }

            return str;
        }

        public string saveDataForCWBBYDY()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("saveData_CWBBYDY.json"));
            return str;
        }

        public string mainSettingForCWBBYDY(string str)
        {
            JObject re_jo = new JObject();
            JValue re_jv = new JValue("");

            re_jv = JsonConvert.DeserializeObject<JValue>(str);
            re_jo = JsonConvert.DeserializeObject<JObject>(re_jv.ToString());

            JObject re_jo_body = JsonConvert.DeserializeObject<JObject>(re_jo["body"].ToString());

            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.BDDM == "WCWBBBS")
                        {
                            re_jo_body["cwbbbsjcsz"]["sssqq"] = item.SKSSQQ;
                            re_jo_body["cwbbbsjcsz"]["sssqz"] = item.SKSSQZ;
                        }
                    }
                }
            }

            re_jo["body"] = new JValue(JsonConvert.SerializeObject(re_jo_body));
            str = JsonConvert.SerializeObject(new JValue(JsonConvert.SerializeObject(re_jo)));
            return str;
        }

        public void cwbbydy()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("cwbbydy.aspx"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void ybnsrzzsxbsz()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("ybnsrzzsxbsz.aspx"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void ybnsrzzsqcs()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("ybnsrzzsqcs.aspx"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

    }
}
