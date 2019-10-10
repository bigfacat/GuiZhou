using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;
using System.Text;
using System.Web;
using System.Reflection;
using System.Text.RegularExpressions;
using JlveTaxSystemGuiZhou.Models;
using System.Web.Mvc;
using System.Web.SessionState;
using JlveTaxSystemGuiZhou.Extensions;
using System.Web.Http.Results;
using System.Net.Http;

namespace JlveTaxSystemGuiZhou.Code
{
    public class YsbqcSetting
    {
        public YsbqcSetting(IHostingEnvironment _he, IHttpContextAccessor _hca)
        {
            he = _he;
            hca = _hca;
        }

        IHostingEnvironment he { get; set; }

        IHttpContextAccessor hca { get; set; }

        public static bool isMvcController { get { return false; } }

        HttpRequest request { get { return System.Web.HttpContext.Current.Request; } }

        HttpSessionState session { get { return System.Web.HttpContext.Current.Session; } }

        string fileName { get; set; }

        string reqPath { get { return AppDomain.CurrentDomain.BaseDirectory + request.Path; } }

        DirectoryInfo Dir { get; set; }

        string JsonStr { get; set; }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        string str { get; set; }

        ContentResult cr { get; set; }

        XmlDocument xd { get; set; }

        public const string functionNotOpen = "FunctionNotOpen";

        public JObject GetJsonObject(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJobj = JsonConvert.DeserializeObject<JObject>(JsonStr);
                return retJobj;
            }
        }

        public JArray GetJsonArray(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJarr = JsonConvert.DeserializeObject<JArray>(JsonStr);
                return retJarr;
            }
        }

        public JToken GetJsonValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                string val = JsonConvert.DeserializeObject<JValue>(JsonStr).Value<string>();
                bool bl = Regex.IsMatch(val, @"\A[\[\{]");
                if (!bl)
                {
                    if (Regex.IsMatch(val, "\\A\""))
                    {
                        retJtok = JsonConvert.DeserializeObject<JValue>(val);
                    }
                    else
                    {
                        retJtok = new JValue(val);
                    }
                }
                else
                {
                    retJtok = JsonConvert.DeserializeObject<JToken>(val);
                    //retJval = new JValue(JsonConvert.SerializeObject(retJtok));
                }
                return retJtok;
            }
        }

        public string GetString(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    if (!string.IsNullOrEmpty(p))
                    {
                        fileName += p + ".";
                    }
                }
                fileName += "json";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retStr = JsonStr;
                return retStr;
            }
        }

        public ContentResult GetHtml(List<string> param, string fileExtension = "html")
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += fileExtension;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                cr = new ContentResult() { Content = JsonStr, ContentType = "text/html;charset=utf-8" };
                //cr = Content(JsonStr, "text/html", Encoding.UTF8);
                return cr;
            }
        }

        public JValue GetXmlValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "xml";
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                xd = new XmlDocument();
                xd.LoadXml(JsonConvert.DeserializeObject<JValue>(JsonStr).Value.ToString());
                retJval = new JValue(xd.InnerXml);
                return retJval;
            }
        }

        public SessionModel getSession()
        {
            if (session == null)
            {
                //return null;
                throw new Exception("session为空");
            }
            SessionModel sm = new SessionModel();
            foreach (PropertyInfo pi in sm.GetType().GetProperties())
            {
                pi.SetValue(sm, session[pi.Name]);
            }
            return sm;
        }

        public void insertSession(JObject jo)
        {
            session.SetString("questionId", jo["questionId"].ToString());
            session.SetString("userquestionId", jo["userquestionId"].ToString());
            session.SetString("companyId", jo["companyId"].ToString());
            session.SetString("classId", jo["classId"].ToString());
            session.SetString("courseId", jo["courseId"].ToString());
            session.SetString("userId", jo["userId"].ToString());
            session.SetString("Name", jo["Name"].ToString());
        }

        public void createSession(HttpRequest Request)
        {
            string questionId = Request.QueryString["questionId"];
            string userquestionId = Request.QueryString["userquestionId"];
            string companyId = Request.QueryString["companyId"];
            string classId = Request.QueryString["classid"];
            string courseId = Request.QueryString["courseid"];
            string userId = Request.QueryString["userid"];
            string Name = Request.QueryString["Name"];

            if (!string.IsNullOrEmpty(questionId))
            {
                JObject jo = new JObject();
                jo["questionId"] = questionId;
                jo["userquestionId"] = userquestionId;
                jo["companyId"] = companyId;
                jo["classId"] = classId;
                jo["courseId"] = courseId;
                jo["userId"] = userId;
                jo["Name"] = Name;

                insertSession(jo);

                string split = "/";
                string logPath = he.ContentRootPath + split + "Log";
                DirectoryInfo[] DIs = Directory.CreateDirectory(logPath).GetDirectories();
                foreach (DirectoryInfo DI in DIs)
                {
                    if (DI.LastWriteTime.Date != DateTime.Now.Date)
                    {
                        DI.Delete(true);
                    }
                }

                string path = he.ContentRootPath + split + "Log" + split + getSession().userId;
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                string fileFullPath = path + split + "Session.json";
                StringBuilder str = new StringBuilder();
                str.Append(JsonConvert.SerializeObject(jo));
                StreamWriter sw = System.IO.File.CreateText(fileFullPath);
                sw.WriteLine(str.ToString());
                sw.Close();
            }
        }

        public JValue JTokenToJValue(JToken jt)
        {
            Type type = jt.GetType();
            if (type == typeof(JObject) || type == typeof(JArray))
            {
                return new JValue(JsonConvert.SerializeObject(jt));
            }
            else
            {
                return new JValue(jt.Value<string>());
            }
        }

        public string JsonToString(JToken jt)
        {
            return JsonConvert.SerializeObject(jt, Formatting.None);
        }

        public ContentResult JsonResult(object obj)
        {
            str = JsonConvert.SerializeObject(obj);
            return new ContentResult() { Content = str, ContentType = "application/json;charset=utf-8" };
        }

        public void JsonResult(object obj, out JsonResult<JToken> jr)
        {
            //str = JsonConvert.SerializeObject(obj);
            //cr = new ContentResult() { Content = str, ContentType = "application/json;charset=utf-8" };
            jr = new JsonResult<JToken>(obj as JToken, new JsonSerializerSettings(), Encoding.UTF8, new HttpRequestMessage());
        }

        public void PlainResult(JToken obj, out ResponseMessageResult rmr)
        {
            str = JsonConvert.SerializeObject(obj);
            if (isMvcController)
            {
                //rmr = new ContentResult() { Content = str, ContentType = "text/plain;charset=utf-8" };
                rmr = null;
            }
            else
            {
                rmr = new ResponseMessageResult(new HttpResponseMessage() { Content = new StringContent(str) });
            }
        }

        public void PlainResult(string str, out ResponseMessageResult rmr)
        {
            if (isMvcController)
            {
                //rmr = new ContentResult() { Content = str, ContentType = "text/plain;charset=utf-8" };
                rmr = null;
            }
            else
            {
                rmr = new ResponseMessageResult(new HttpResponseMessage() { Content = new StringContent(str) });
            }
        }

        public void ValueResult(JToken obj, out JsonResult outjr)
        {
            str = JsonConvert.SerializeObject(obj);
            outjr = new JsonResult() { Data = str, ContentType = "application/json;charset=utf-8" };
        }

        public void ValueResult(JToken obj, out JsonResult<string> outjr)
        {
            str = JsonConvert.SerializeObject(obj);
            //JsonResult jr = new JsonResult() { Data = str, ContentType = "application/json;charset=utf-8" };
            outjr = new JsonResult<string>(str, new JsonSerializerSettings(), Encoding.UTF8, new HttpRequestMessage());
        }

        public void ValueResult(JValue obj, out JsonResult outjr)
        {
            outjr = new JsonResult() { Data = obj, ContentType = "application/json;charset=utf-8" };
        }

        public void ValueResult(JValue obj, out JsonResult<string> outjr)
        {
            outjr = new JsonResult<string>(obj.Value.ToString(), new JsonSerializerSettings(), Encoding.UTF8, new HttpRequestMessage());
        }

        public void XmlValueResult(JValue obj, out JsonResult outjr)
        {
            outjr = new JsonResult() { Data = obj.Value, ContentType = "application/json;charset=utf-8" };
        }

        public void XmlValueResult(JValue obj, out JsonResult<string> jr)
        {
            jr = new JsonResult<string>(obj.Value.ToString(), new JsonSerializerSettings(), Encoding.UTF8, new HttpRequestMessage());
        }

    }
}