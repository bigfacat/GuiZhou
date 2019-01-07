using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class cwbbController : Controller
    {
        public void cwbb_qy_kjzz_ybqy()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("cwbb_qy_kjzz_ybqy.aspx"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

    }
}
