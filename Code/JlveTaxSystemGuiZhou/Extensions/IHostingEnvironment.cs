using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlveTaxSystemGuiZhou.Extensions
{
    public class IHostingEnvironment
    {
        string EnvironmentName { get; set; }

        string ApplicationName { get; set; }

        public string WebRootPath { get { return AppDomain.CurrentDomain.BaseDirectory; } }

        public string ContentRootPath { get { return AppDomain.CurrentDomain.BaseDirectory; } }

    }
}