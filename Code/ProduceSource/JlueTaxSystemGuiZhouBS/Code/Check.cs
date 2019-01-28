using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace JlueTaxSystemGuiZhouBS.Code
{
    public class Check : System.Web.UI.Page
    {
        private static string keys = "``ww.Jinglue.0512#A=0";
        private static int obv = -1000998309;
        public static int ev = 7200;

        public Boolean ProcessRequest(string Method, string UserId, string Time, string skey)
        {
            APIResult obj = new APIResult();
            string method = Method;
            string userId = UserId;
            string IP = GetClientIp();
            Pro p = new Pro();
            Boolean b = false;
            if (method == "get")
            {
                p = General(IP, 0, userId);
                Session["i"] = p.i;
                Session["s"] = p.s;
                Session["t"] = p.t;
                b = true;
            }
            if (method == "check")
            {
                string time = Time;
                string key = skey;
                b = CheckKey(IP, General(IP, Convert.ToInt32(time), userId));
            }
            return b;
        }
        /// <summary>
        /// 获取MD5值
        /// </summary>
        /// <returns></returns>
        public static string GetMD5(string sDataIn)
        {
            System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] bytValue, bytHash;
            bytValue = System.Text.Encoding.UTF8.GetBytes(sDataIn);
            bytHash = md5.ComputeHash(bytValue);
            md5.Clear();
            string sTemp = "";
            for (int i = 0; i < bytHash.Length; i++)
            {
                sTemp += bytHash[i].ToString("X").PadLeft(2, '0');
            }
            return sTemp.ToLower();
        }

        /// <summary>  
        /// 获取客户端Ip  
        /// </summary>  
        /// <returns></returns>  
        public String GetClientIp()
        {
            String clientIP = "";
            if (System.Web.HttpContext.Current != null)
            {
                clientIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(clientIP) || (clientIP.ToLower() == "unknown"))
                {
                    clientIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_CLIENT_IP"];
                    if (string.IsNullOrEmpty(clientIP))
                    {
                        clientIP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                    }
                    else
                    {
                        clientIP = "Unknown";
                    }
                }
            }
            return clientIP;
        }

        /// <summary>
        /// 生成密钥
        /// </summary>
        /// <param name="IP"></param>
        /// <param name="timestamp"></param>
        /// <param name="Id"></param>
        /// <returns></returns>
        public Pro General(string IP, int timestamp, string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return null;
            }
            if (timestamp == 0)
            {
                timestamp = ConvertDateTimeInt(DateTime.Now) + obv;
            }
            if (string.IsNullOrEmpty(IP))
            {
                IP = GetClientIp();
            }
            string str = "|" + Id + "," + keys + "-" + IP + "]" + timestamp;
            Pro p = new Pro();
            p.i = Id;
            p.s = GetMD5(str);
            p.t = timestamp.ToString();
            return p;
        }

        /// <summary>
        /// 检查密钥是否能用
        /// </summary>
        /// <returns></returns>
        public Boolean CheckKey(string IP, Pro p)
        {
            if (string.IsNullOrEmpty(IP))
            {
                IP = GetClientIp();
            }
            Pro newp = General(IP, Convert.ToInt32(p.t), p.i);
            if (p.s == newp.s)
            {
                int hh = Math.Abs(ConvertDateTimeInt(DateTime.Now) - (Convert.ToInt32(p.t) - obv));
                if (Math.Abs(ConvertDateTimeInt(DateTime.Now) - (Convert.ToInt32(p.t) - obv)) <= ev)
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// DateTime时间格式转换为Unix时间戳格式
        /// </summary>
        /// <param name=”time”></param>
        /// <returns></returns>
        private int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;

        }
    }

    public class Pro
    {
        public string i { get; set; }
        public string s { get; set; }
        public string t { get; set; }
    }

    public class APIResult
    {
        public object data { get; set; }
        public string message { get; set; }
        public bool success { get; set; }
    }
}