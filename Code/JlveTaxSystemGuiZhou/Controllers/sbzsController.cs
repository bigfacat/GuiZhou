using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Models;
using Newtonsoft.Json.Linq;
using System.Web.Mvc;
using System.Web;

namespace JlveTaxSystemGuiZhou.Controllers
{
    public class sbzsController : Controller
    {
        YsbqcSetting set { get; set; }

        Service service { get; set; }

        HttpRequestBase req { get { return Request; } }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        List<string> param { get; set; }

        Model m { get; set; }

        string viewName { get; set; }

        public sbzsController(YsbqcSetting _set, Service _ser)
        {
            set = _set;
            service = _ser;
            param = new List<string>();
        }

        [Route("sbzs-cjpt-web/biz/sbzs/{dm}")]
        public ActionResult sbzs(string dm)
        {
            param.Add(dm);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb")]
        public ActionResult sbqc_aqsb()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb")]
        public ActionResult sbqc_qtsb()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/sbqc/{submenu}/setting")]
        public ActionResult sbqc(string submenu)
        {
            m = service.getModel(Ywbm.fjssb.ToString());
            viewName = submenu + "_setting";
            return View(viewName, m);
        }

        [Route("sbzs-cjpt-web/biz/{menu}/{dm}/begin")]
        public ActionResult begin(string reset, string dm)
        {
            if (reset == "Y")
            {
                service.reset(dm);
            }
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbzf.do")]
        public ActionResult sbzf()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/nssb/sbzf/sbzfmx.do")]
        public ActionResult sbzfmx(int pzxh)
        {
            m = service.getModel(pzxh);
            return View(m);
        }

        [Route("sbzs-cjpt-web/nssb/sbxx/sbcx.do")]
        public ActionResult sbcx()
        {
            m = service.getModel(Ywbm.fjssb.ToString());
            return View(m);
        }

        [Route("sbzs-cjpt-web/cbxxcx/cbxxcx.do")]
        public ActionResult cbxxcx()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/setting/{dm}")]
        public ActionResult setting(string dm)
        {
            param.Add(dm);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/cwbb/cwbb_xqy_kjzz")]
        public ActionResult cwbb_xqy_kjzz()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/attachmentSb/getUploadList.do")]
        public ActionResult getUploadList()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/attachmentSb/getCwbbUploadList.do")]
        public ActionResult getCwbbUploadList()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("sbzs-cjpt-web/biz/{submenu}/{dm}/make")]
        public ActionResult make()
        {
            return View();
        }

        [Route("sbzs-cjpt-web/biz/sbzs/{dm}/well")]
        public ActionResult well(string dm)
        {
            m = service.getModel(dm);
            return View(m);
        }

        [Route("sbzs-cjpt-web/sb/gotoSbresult.do")]
        public ActionResult gotoSbresult(int ysqxxid)
        {
            service.UpdateSBZT(ysqxxid, SBZT.YSB);
            m = service.getModel(ysqxxid);
            m.msg = service.getSBCGMessage(ysqxxid);
            return View(m);
        }

        [Route("sbzs-cjpt-web/biz/cwbb/cwbb_main")]
        public ActionResult cwbb_main()
        {
            RedirectResult lrr = Redirect("/sbzs-cjpt-web/biz/setting/cwbbydy?gos=true&gdslxDm=1&skssqQ=2019-08-01&biz=null&kjzdzzDm=102&ywbm=CWBBYDY&isCwbabz=Y&tjNd=2019&sssqZ=2019-08-31&bbbsqDm=4&bzz=dzswj&skssqZ=2019-08-31&sssqQ=2019-08-01&zlbsxlDm=&tjYf=09&gsdq=152");
            return lrr;
        }

    }
}