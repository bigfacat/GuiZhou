using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;

namespace JlveTaxSystemGuiZhou.Extensions
{
    public class MyActionResult : ResponseMessageResult
    {
        public MyActionResult(HttpResponseMessage response) : base(response) { }
    }
}