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
    public class sbxxController : Controller
    {
        public string getsbxx()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getsbxx.json"));
            JValue sbxx_jv = JsonConvert.DeserializeObject<JValue>(str);
            JObject sbxx_jo = JsonConvert.DeserializeObject<JObject>(sbxx_jv.ToString());

            JArray sbxxList = (JArray)sbxx_jo["sbxxList"];
            JObject sbxxList_model = (JObject)sbxxList[0];
            sbxxList.RemoveAll();

            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.SBZT == "未申报" || item.BDDM == "WCWBBBS")
                        {
                            continue;
                        }
                        else if (item.BDDM == "YHSSB")
                        {
                            GTXResult gr = GTXMethod.GetUserReportData(item.Id.ToString(), "");
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
                                    for (int i = 0; i < data_ja.Count; i++)
                                    {
                                        JObject sbxxList_item = new JObject(sbxxList_model);
                                        sbxxList_item["yzpzzlmc"] = item.TaskName;
                                        sbxxList_item["yzpzzlDm"] = item.BDDM;
                                        sbxxList_item["zsxmmc"] = item.ZSXM;
                                        sbxxList_item["sbrq"] = item.HappenDate;
                                        sbxxList_item["skssqq"] = item.SKSSQQ;
                                        sbxxList_item["skssqz"] = item.SKSSQZ;
                                        sbxxList_item["ybtse"] = data_ja[i]["bqybtse"];
                                        sbxxList.Add(sbxxList_item);
                                    }
                                }
                            }
                        }
                        else
                        {
                            JObject sbxxList_item = new JObject(sbxxList_model);
                            sbxxList_item["yzpzzlmc"] = item.TaskName;
                            sbxxList_item["yzpzzlDm"] = item.BDDM;
                            sbxxList_item["zsxmmc"] = item.ZSXM;
                            sbxxList_item["sbrq"] = item.HappenDate;
                            sbxxList_item["skssqq"] = item.SKSSQQ;
                            sbxxList_item["skssqz"] = item.SKSSQZ;
                            sbxxList_item["ybtse"] = item.SBSE;
                            sbxxList.Add(sbxxList_item);
                        }
                    }
                }
            }

            sbxx_jo["sbxxList"] = sbxxList;
            JValue re_jv = new JValue(JsonConvert.SerializeObject(sbxx_jo));

            string re_str = JsonConvert.SerializeObject(re_jv);
            return re_str;
        }
    }
}
