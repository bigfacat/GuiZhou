using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace JlueTaxSystemGuiZhouBS
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.RouteExistingFiles = true;

            routes.IgnoreRoute("xxmh/html/{*relpath}");
            routes.IgnoreRoute("sbzs-cjpt-web/biz/sbqc/{resource}.html");
            routes.IgnoreRoute("sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/{resource}.html");
            routes.IgnoreRoute("sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/{resource}.html");

            routes.MapRoute(
name: "zyywn",
url: "zyywn-cjpt-web/{controller}/{action}.do",
defaults: new { controller = "czgc", action = "queryWSDataList" }
);

            routes.MapRoute(
name: "yqsb",
url: "sbzs-cjpt-web/biz/yqsb/{controller}/{action}",
defaults: new { controller = "yqsbqc", action = "enterYqsbUrl" }
);

            routes.MapRoute(
name: "biz",
url: "sbzs-cjpt-web/biz/{controller}/{action}",
defaults: new { controller = "sbzs", action = "fjssb" }
);

            routes.MapRoute(
name: "zlpz",
url: "zlpz-cjpt-web/{controller}/{action}.do",
defaults: new { controller = "zlpz", action = "viewOrDownloadPdfFile" }
);

            routes.MapRoute(
name: "zzsybnsr",
url: "sbzs-cjpt-web/nssb/zzsybnsr/{controller}/{action}.do",
defaults: new { controller = "sffx", action = "getData" }
);

            routes.MapRoute(
name: "cwbb",
url: "sbzs-cjpt-web/biz/cwbb/{controller}/{action}",
defaults: new { controller = "cwbb_qy_kjzz_ybqy", action = "begin" }
);

            routes.MapRoute(
name: "web",
url: "sbzs-cjpt-web/{controller}/{action}.do",
defaults: new { controller = "nssb", action = "getsbxx" }
);

            routes.MapRoute(
name: "nssb",
url: "sbzs-cjpt-web/nssb/{controller}/{action}.do",
defaults: new { controller = "sbxx", action = "getsbxx" }
);

            routes.MapRoute(
name: "formula1",
url: "sbzs-cjpt-web/biz/cwbb/{controller}/formula/{action}.do",
defaults: new { controller = "", action = "exttbsm" }
);

            routes.MapRoute(
name: "formula",
url: "sbzs-cjpt-web/biz/sbzs/{controller}/formula/{action}.do",
defaults: new { controller = "", action = "exttbsm" }
);

            routes.MapRoute(
name: "sbzs",
url: "sbzs-cjpt-web/biz/sbzs/{controller}/{action}",
defaults: new { controller = "yhssb", action = "begin" }
);

            routes.MapRoute(
    name: "sbqc",
    url: "sbzs-cjpt-web/biz/sbqc/{controller}/{action}",
    defaults: new { controller = "sbqc_aqsb", action = "Index" }
);

            routes.MapRoute(
                name: "xxmh",
                url: "xxmh/{controller}/{action}.do",
                defaults: new { controller = "portalSer", action = "checkLogin" }
            );

            routes.MapRoute(
    name: "Default",
    url: "xxmh/{controller}/{action}",
    defaults: new { controller = "Home", action = "Index", id = "" }
);


        }
    }
}