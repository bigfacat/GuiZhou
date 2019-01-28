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
    public class sbzfController : Controller
    {
        public void sbzf()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("sbzf.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public string getsbzf()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getsbzf.json"));
            JValue sbzf_jv = JsonConvert.DeserializeObject<JValue>(str);
            JObject sbzf_jo = JsonConvert.DeserializeObject<JObject>(sbzf_jv.ToString());
            JArray sbzfList = (JArray)sbzf_jo["sbzfList"];
            JObject sbzfList_model = (JObject)sbzfList[0];
            sbzfList.RemoveAll();

            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.SBZT == "未申报")
                        {
                            continue;
                        }
                        JObject sbzfList_item = new JObject(sbzfList_model);
                        sbzfList_item["yzpzzlmc"] = item.TaskName;
                        sbzfList_item["yzpzzlDm"] = item.BDDM;
                        sbzfList_item["zsxmmc"] = item.ZSXM;
                        sbzfList_item["sbrq"] = item.HappenDate;
                        sbzfList_item["skssqq"] = item.SKSSQQ;
                        sbzfList_item["skssqz"] = item.SKSSQZ;
                        sbzfList_item["ybtse"] = item.SBSE;
                        sbzfList.Add(sbzfList_item);

                    }
                }
            }
            sbzf_jo["sbxxList"] = sbzfList;
            JValue re_jv = new JValue(JsonConvert.SerializeObject(sbzf_jo));
            string re_str = JsonConvert.SerializeObject(re_jv);
            return re_str;
        }

        public string getSsqz()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getSsqz.json"));
            return str;
        }

        public string getSbqx()
        {
            JObject re_jo = new JObject();
            re_jo.Add("reCode", "1");
            re_jo.Add("qxbz", "0");

            string str = JsonConvert.SerializeObject(re_jo);
            return str;
        }

        public string sbzfmx(string sbblxDm)
        {
            string str = "作废成功";
            try
            {
                string id = "";
                GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
                if (resultq.IsSuccess)
                {
                    List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                    if (ysbqclist.Count > 0)
                    {
                        foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                        {
                            if (item.BDDM == sbblxDm)
                            {
                                id = item.Id.ToString();
                            }
                        }
                    }
                }

                GTXMethod.UpdateYSBQC(id, "未申报");
                GTXMethod.DeleteUserReportData(id, sbblxDm);
                GTXMethod.DeleteUserReportData(id, "");

            }
            catch (Exception ex)
            {
                str = "作废失败," + ex.Message;
            }
            return str;
        }

    }
}
