using Autofac;
using Autofac.Integration.WebApi;
using JlveTaxSystemGuiZhou.Code;
using JlveTaxSystemGuiZhou.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace JlveTaxSystemGuiZhou
{
    public class AutofacWebApiConfig
    {
        public static void Run()
        {
            ContainerBuilder builder = new ContainerBuilder();
            HttpConfiguration config = GlobalConfiguration.Configuration;

            //builder.RegisterApiControllers(Assembly.GetExecutingAssembly()).PropertiesAutowired();

            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            builder.RegisterType<YsbqcSetting>().As<YsbqcSetting>().InstancePerRequest();
            builder.RegisterType<Service>().As<Service>().InstancePerRequest();
            builder.RegisterType<Repository>().As<Repository>().InstancePerRequest();
            builder.RegisterType<IHostingEnvironment>().As<IHostingEnvironment>().InstancePerRequest();
            builder.RegisterType<IHttpContextAccessor>().As<IHttpContextAccessor>().InstancePerRequest();

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

    }
}