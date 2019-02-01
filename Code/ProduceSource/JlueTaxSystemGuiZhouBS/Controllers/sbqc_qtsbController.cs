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
    public class sbqc_qtsbController : Controller
    {
        string BDDM = "YHSSB";

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/setting.html")]
        public System.Web.Mvc.ActionResult setting()
        {
            GDTXGuiZhouUserYSBQC ysbqc = GTXMethod.GetYSBQCByBDDM(this.BDDM);
            string[] HappenDate = ysbqc.HappenDate.Split('-');
            ViewBag.tjNd = HappenDate[0];
            ViewBag.tjYf = HappenDate[1];

            return View();
        }

        public JObject enterQtsb()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("enterQtsb.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);

            JArray qtsbList =(JArray) re_jo["qtsbList"];
            JObject qtsbList_1 =(JObject) qtsbList[1];


            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.BDDM == "YHSSB")
                        {
                            qtsbList_1["skssqQ"] = item.SKSSQQ;
                            qtsbList_1["skssqZ"] = item.SKSSQZ;
                        }
                    }
                }
            }

            return re_jo;
        }

        public JObject sburlControl(string sbywbm)
        {
            JObject re_jo = new JObject();
            sbywbm = Request.QueryString["sbywbm"];
            string str = System.IO.File.ReadAllText(Server.MapPath("sburlControl_" + sbywbm + ".json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/setting/doWord.jsp")]
        public void doWord()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("doWord.jsp"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/setting/lhQtsbbs.jsp")]
        public void lhQtsbbs()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("lhQtsbbs.jsp"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

    }
}
