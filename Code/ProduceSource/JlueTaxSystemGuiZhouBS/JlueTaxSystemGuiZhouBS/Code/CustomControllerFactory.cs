using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JlueTaxSystemGuiZhouBS.Controllers;

namespace JlueTaxSystemGuiZhouBS.Code
{
    public class CustomControllerFactory : DefaultControllerFactory
    {
        protected override IController GetControllerInstance(System.Web.Routing.RequestContext requestContext, Type controllerType)
        {
            string logger = "test";
            if (controllerType.Name == "tysbController")
            {
                IController controller = Activator.CreateInstance(controllerType, new[] { logger }) as Controller;
                return controller;
            }
            return base.GetControllerInstance(requestContext, controllerType);
        }
    }
}