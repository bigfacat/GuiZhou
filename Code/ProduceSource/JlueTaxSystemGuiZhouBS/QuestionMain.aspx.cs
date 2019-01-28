using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net.NetworkInformation;
using JlueTaxSystemGuiZhouBS.Code;
using JlueTaxSystemGuiZhouBS;

namespace JlueTaxSystemGuiZhouBS
{
    public partial class QuestionMain : System.Web.UI.Page
    {
        public string questionstr = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {
            string userid = Request.QueryString["userid"].ToString();
            string username = Request.QueryString["username"].ToString();
            string classid = Request.QueryString["classid"].ToString();
            string courseid = Request.QueryString["courseid"].ToString();
            string sortid = Request.QueryString["sortid"].ToString();
            APIResult obj = new APIResult();
            if (string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(classid) || string.IsNullOrEmpty(courseid) || string.IsNullOrEmpty(sortid))
            {
                Response.Write("参数为空");
            }
            else
            {
                Check c = new Check();
                bool res = c.ProcessRequest("get", userid, "", "");
                if (res == false)
                {
                    Response.Redirect("Error/500.html");
                }
            }

            publicmethod p = new publicmethod();
            questionstr = p.HttpGetFunction(System.Web.Configuration.WebConfigurationManager.AppSettings["tikupath"] + "/GTX/GTXUserQuestion/GetQID?classid=" + classid + "&userid=" + userid + "&sortid=" + sortid);

        }
    }
}