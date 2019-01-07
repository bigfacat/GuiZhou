using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class sbzsController : Controller
    {

        public void fjssb()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("fjssb.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void ybnsrzzs()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("ybnsrzzs.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void yhssb()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("yhssb.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void tysb()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("tysb.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

        public void qysds_a_18yjd()
        {
            string str = System.IO.File.ReadAllText(Server.MapPath("qysds_a_18yjd.html"));
            Response.ContentType = "text/html;charset=UTF-8";
            Response.Write(str);
        }

    }
}
