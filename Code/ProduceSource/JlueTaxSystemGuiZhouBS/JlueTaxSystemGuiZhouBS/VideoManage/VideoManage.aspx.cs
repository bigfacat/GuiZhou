using JlueTaxSystemGuiZhouBS.Code;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace JlueTaxSystemGuiZhouBS
{
    public partial class VideoManage1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                publicmethod p = new publicmethod();
                string path = System.Web.Configuration.WebConfigurationManager.AppSettings["Practicepath"] + "/APIPractice/VideoManage.asmx/GetByCourseId?CourseId="+System.Web.Configuration.WebConfigurationManager.AppSettings["CourseId"];
                string resut = p.HttpGetFunction(path);
                ActionResult ar = JsonConvert.DeserializeObject<ActionResult>(resut);
                Session["VideoManage"] = ar.Data;
            }
            catch
            {


            }
        }
    }
}