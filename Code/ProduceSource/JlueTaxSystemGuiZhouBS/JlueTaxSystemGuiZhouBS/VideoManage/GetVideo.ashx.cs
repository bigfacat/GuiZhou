using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlueTaxSystemGuiZhouBS.VideoManage
{
    /// <summary>
    /// GetVideo 的摘要说明
    /// </summary>
    public class GetVideo : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string CourseId = context.Request.QueryString["CourseId"].ToString();
            string res = "";
            try
            {
                publicmethod p = new publicmethod();
                string path = System.Web.Configuration.WebConfigurationManager.AppSettings["Practicepath"] + "/APIPractice/VideoManage.asmx/GetByCourseId?CourseId=" + CourseId;
                res = p.HttpGetFunction(path);
            }
            catch
            {

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