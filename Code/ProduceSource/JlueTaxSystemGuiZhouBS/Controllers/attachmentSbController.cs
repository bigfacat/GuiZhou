using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class attachmentSbController : Controller
    {
        public void getUploadList()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getUploadList.html"));
            Response.ContentType = "text/html; charset=utf-8";
            Response.Write(str);
        }

        public void getCwbbUploadList()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("getCwbbUploadList_sbywbm_cwbb_qy_kjzz_ybqy.html"));
            Response.ContentType = "text/html; charset=utf-8";
            Response.Write(str);
        }

    }
}
