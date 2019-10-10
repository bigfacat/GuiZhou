using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using System.Text.RegularExpressions;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Extensions;

namespace JlveTaxSystemGuiZhou
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // 在应用程序启动时运行的代码
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            AutofacMVCConfig.Run();
            AutofacWebApiConfig.Run();

            ControllerBuilder.Current.SetControllerFactory(new MyControllerFactory());

        }

        public override void Init()
        {
            this.PostMapRequestHandler += (sender, e) => myMapRequestHandler();
            this.BeginRequest += (sender, e) => myBeginRequest();
            this.PostAuthenticateRequest += (sender, e) => HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            this.PostAcquireRequestState += (sender, e) => createSession(Request);
            base.Init();
        }

        private void myBeginRequest()
        {
            string path = Request.Path;
            if (Regex.IsMatch(path, "biz") || Regex.IsMatch(path, "xxmh/html/index_login.html") || Regex.IsMatch(path, "qhsf"))
            {
                RouteTable.Routes.RouteExistingFiles = true;
                //Context.Handler = new CustomHandler();
                //Context.RemapHandler(new CustomHandler());
            }
            else
            {
                RouteTable.Routes.RouteExistingFiles = false;
            }

        }

        private void myMapRequestHandler()
        {
        }

        public static YsbqcSetting set { get; set; }

        void createSession(HttpRequest request)
        {
            string path = Request.Path;
            if (Regex.IsMatch(path, "index_login"))
            {
                set.createSession(request);
            }
        }

    }
}