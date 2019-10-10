using Autofac;
using Autofac.Integration.Mvc;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JlveTaxSystemGuiZhou
{
    public class AutofacMVCConfig
    {
        public static void Run()
        {
            var builder = new ContainerBuilder();

            builder.RegisterType(typeof(YsbqcSetting)).As(typeof(YsbqcSetting));
            builder.RegisterType(typeof(Service)).As(typeof(Service));
            builder.RegisterType(typeof(Repository)).As(typeof(Repository));
            builder.RegisterType(typeof(IHostingEnvironment)).As(typeof(IHostingEnvironment));
            builder.RegisterType(typeof(IHttpContextAccessor)).As(typeof(IHttpContextAccessor));

            builder.RegisterControllers(typeof(Global).Assembly);//注册所有的Controller
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            GTXMethod.set = Global.set = container.Resolve<YsbqcSetting>();
        }

    }
}