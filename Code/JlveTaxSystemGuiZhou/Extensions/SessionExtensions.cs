using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace JlveTaxSystemGuiZhou.Extensions
{
    public static class SessionExtensions
    {
        public static string GetString(this HttpSessionStateBase session, string key)
        {
            return session[key].ToString();
        }

        public static void SetString(this HttpSessionStateBase session, string key, string value)
        {
            session.Add(key, value);
        }

        public static void SetString(this  HttpSessionState session, string key, string value)
        {
            session.Add(key, value);
        }

    }
}