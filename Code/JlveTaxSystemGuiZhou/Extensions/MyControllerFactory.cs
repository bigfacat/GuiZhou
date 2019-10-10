using JlveTaxSystemGuiZhou.Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace JlveTaxSystemGuiZhou.Extensions
{
    public class MyControllerFactory : DefaultControllerFactory
    {
        
        protected override Type GetControllerType(RequestContext requestContext, string controllerName)
        {
            return base.GetControllerType(requestContext, controllerName);
        }

        public override IController CreateController(RequestContext requestContext, string controllerName)
        {
            IController iController = base.CreateController(requestContext, controllerName);
            return iController;
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            IController iController = base.GetControllerInstance(requestContext, controllerType);//如果用到了依赖注入，可从注入容器获取
            if (typeof(Controller).IsAssignableFrom(controllerType))
            {
                Controller controller = iController as Controller;
                if (controller != null)
                    //YsbqcSetting.isMvcController = true;
                return controller;
            }
            return iController;
        }

    }
}