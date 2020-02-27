using JlveTaxSystemGuiZhou.Code;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace JlveTaxSystemGuiZhou
{
    /// <summary>
    /// ChuShiHua 的摘要说明
    /// </summary>
    public class ChuShiHua : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string method = context.Request.QueryString["Method"].ToString();
            string ClassId = context.Request.QueryString["ClassId"].ToString();
            string userId = context.Request.QueryString["userId"].ToString();
            string SortId = context.Request.QueryString["SortId"].ToString();
            string res = "";
            if (method == "Clear")
            {
                //国地税题目                
                publicmethod p = new publicmethod();
                string path = System.Web.Configuration.WebConfigurationManager.AppSettings["Practicepath"] + "/APIPractice/Chongzuo.asmx/GetGuiZhouData?UserId=" + userId + "&ClassId=" + ClassId + "&SortId=" + SortId + "&courseId=" + ConfigurationManager.AppSettings["CourseId"];
                string resut = p.HttpGetFunction(path).Replace("+", "%2B").Replace("#", "%23").Replace("=", "%3D").Replace("&", "%26");
                string billpath = System.Web.Configuration.WebConfigurationManager.AppSettings["tikupath"] + "/GTX/GDTXGuiZhouUserYSBQC/RedoAllQuestionsGuiZhou";
                res = p.HttpPost(billpath, string.Format("jsonData={0}", resut));
            }

            context.Response.Clear();
            context.Response.ContentType = "text/html";
            context.Response.Write(res);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
