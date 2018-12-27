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
    public class sbqc_aqsbController : Controller
    {
        public JObject enterSbqc()
        {
            JObject re_jo = new JObject();
            re_jo = getSbqc();
            return re_jo;
        }

        public JObject sbqxControl()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("sbqxControl.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        public JObject sburlControl(string sbywbm)
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath(sbywbm+".json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        public JObject cburlControl(string sbywbm)
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("cburlControl.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        public JObject refreshSbqc(string type,string uuid)
        {
            JObject re_jo = new JObject();
            string re_str = "";

            if (type == "oneRefresh")
            {
                re_str = System.IO.File.ReadAllText(Server.MapPath(type + ".json"));
                re_jo = JsonConvert.DeserializeObject<JObject>(re_str);

                GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
                if (resultq.IsSuccess)
                {
                    List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                    if (ysbqclist.Count > 0)
                    {
                        foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                        {
                            if (item.Id.ToString() == uuid && item.SBZT == "已申报")
                            {
                                re_jo["code"] = "0";
                                re_jo.Add("sbrq", item.HappenDate);
                                break;
                            }

                        }
                    }
                }

            }
            else
            {
                re_jo = getSbqc();
            }

            return re_jo;
        }

        public JObject getSbqc()
        {
            JObject re_jo = new JObject();
            string re_str = "";

            re_str = System.IO.File.ReadAllText(Server.MapPath("enterSbqc.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(re_str);

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
                            if (item.SBZT == "已申报")
                            {
                                re_jo["sbqcList"][0]["sbztDm"] = "210";
                                re_jo["sbqcList"][0]["sbrq"] = item.HappenDate;
                            }
                            re_jo["sbqcList"][0]["uuid"] = item.Id;
                            re_jo["sbqcList"][0]["skssqQ"] = item.SKSSQQ;
                            re_jo["sbqcList"][0]["skssqZ"] = item.SKSSQZ;
                            re_jo["sbqcList"][0]["sbqx"] = item.SBQX;

                            continue;
                        }
                        if (item.BDDM == "FJSSB" )
                        {
                            if (item.SBZT == "已申报")
                            {
                                re_jo["sbqcList"][1]["sbztDm"] = "210";
                                re_jo["sbqcList"][1]["sbrq"] = item.HappenDate;
                            }
                            re_jo["sbqcList"][1]["uuid"] = item.Id;
                            re_jo["sbqcList"][1]["skssqQ"] = item.SKSSQQ;
                            re_jo["sbqcList"][1]["skssqZ"] = item.SKSSQZ;
                            re_jo["sbqcList"][1]["sbqx"] = item.SBQX;

                            continue;
                        }
                        if (item.BDDM == "WCWBBBS")
                        {
                            if (item.SBZT == "已申报")
                            {
                                re_jo["cwbbList"][0]["bsrq"] = item.HappenDate;
                            }
                            re_jo["cwbbList"][0]["bsssqQ"] = item.SKSSQQ;
                            re_jo["cwbbList"][0]["bsssqZ"] = item.SKSSQZ;
                            re_jo["cwbbList"][0]["bsqx"] = item.SBQX;

                            continue;
                        }
                    }
                }
            }
            return re_jo;
        }

    }
}
