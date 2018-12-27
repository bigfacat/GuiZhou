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
    public class portalSerController : Controller
    {
        public JObject checkfxxx()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("checkfxxx.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        public JObject getSubMenus()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getSubMenus.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);
            return re_jo;
        }

        public JObject getRootMenu()
        {
            JObject re_jo = new JObject();
            string str = System.IO.File.ReadAllText(Server.MapPath("getRootMenu.json"));
            re_jo = JsonConvert.DeserializeObject<JObject>(str);

            GTXResult gr = GTXMethod.GetCompany();
            if (gr.IsSuccess)
            {
                JObject jo = new JObject();
                jo = JsonConvert.DeserializeObject<JObject>(gr.Data.ToString());
                if (jo.HasValues)
                {
                    JObject data_jo = jo;
                    re_jo["yhqymc"] = data_jo["NSRMC"];
                    re_jo["userName"] = data_jo["NSRSBH"];
                }
            }

            return re_jo;
        }

        public void checkLogin()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("checkLogin.json"));
            Response.ContentType = "application/json;charset=UTF-8";
            Response.Write(str);
        }

    }
}
