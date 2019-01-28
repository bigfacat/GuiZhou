using JlueTaxSystemGuiZhouBS;
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

namespace JlueTaxSystemGuiZhouBS
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
            try
            {
                if (method == "Clear")
                {
                    //国地税题目                
                    publicmethod p = new publicmethod();
                    string path = System.Web.Configuration.WebConfigurationManager.AppSettings["Practicepath"] + "/APIPractice/Chongzuo.asmx/GetGuiZhouData?UserId=" + userId + "&ClassId=" + ClassId + "&SortId=" + SortId + "&courseId=" + ConfigurationManager.AppSettings["CourseId"];
                    string resut = p.HttpGetFunction(path);
                    string billpath = System.Web.Configuration.WebConfigurationManager.AppSettings["tikupath"] + "/GTX/GDTXGuiZhouUserYSBQC/RedoAllQuestionsGuiZhou";
                    res = p.HttpPost(billpath, string.Format("jsonData={0}", resut));
                }
            }
            catch(Exception ex)
            {

            }
            context.Response.Clear();
            context.Response.ContentType = "text/html";
            context.Response.Write(res);
        }

        /// <summary>
        /// Json 字符串 转换为 DataTable数据集合
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public DataTable ToDataTable(string json)
        {
            DataTable dataTable = new DataTable();  //实例化
            DataTable result;
            try
            {
                JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
                javaScriptSerializer.MaxJsonLength = Int32.MaxValue; //取得最大数值
                ArrayList arrayList = javaScriptSerializer.Deserialize<ArrayList>(json);
                if (arrayList.Count > 0)
                {
                    foreach (Dictionary<string, object> dictionary in arrayList)
                    {
                        if (dictionary.Keys.Count<string>() == 0)
                        {
                            result = dataTable;
                            return result;
                        }
                        if (dataTable.Columns.Count == 0)
                        {
                            foreach (string current in dictionary.Keys)
                            {
                                dataTable.Columns.Add(current, dictionary[current].GetType());
                            }
                        }
                        DataRow dataRow = dataTable.NewRow();
                        foreach (string current in dictionary.Keys)
                        {
                            dataRow[current] = dictionary[current];
                        }

                        dataTable.Rows.Add(dataRow); //循环添加行到DataTable中
                    }
                }
            }
            catch
            {
            }
            result = dataTable;
            return result;
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