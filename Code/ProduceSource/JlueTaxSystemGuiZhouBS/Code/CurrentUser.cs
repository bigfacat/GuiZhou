using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace JlueTaxSystemGuiZhouBS.Code
{
    public class CurrentUser
    {
        private static CurrentUser singleton;
        private CurrentUser()
        {
        }
        public static CurrentUser GetInstance()
        {
            if (singleton == null)
            {
                singleton = new CurrentUser();
            }
            return singleton;
        }

        #region 当前用户信息
        /// <summary>
        /// 获取当前用户填写的报表编号
        /// </summary>
        public string GetReportCode
        {
            get { return System.Web.HttpContext.Current.Session["reportCode"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户id
        /// </summary>
        public string GetCurrentUserId
        {
            get { return System.Web.HttpContext.Current.Session["userId"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户登录名
        /// </summary>
        public string GetCurrentUserName
        {
            get { return System.Web.HttpContext.Current.Session["username"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户ClassId，题库用
        /// </summary>
        public string GetCurrentClassId
        {
            get { return System.Web.HttpContext.Current.Session["classId"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户CourseId，题库用
        /// </summary>
        public string GetCurrentCourseId
        {
            get { return System.Web.HttpContext.Current.Session["courseId"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户sortid，题库用
        /// </summary>
        public string GetCurrentSortid
        {
            get { return System.Web.HttpContext.Current.Session["sortid"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户共享的题目questionId
        /// </summary>
        public string GetCurrentQuestionId
        {
            get { return System.Web.HttpContext.Current.Session["questionId"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户的题目questionId
        /// </summary>
        public string GetCurrentUserQuestionId
        {
            get { return System.Web.HttpContext.Current.Session["userquestionId"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户发生日期
        /// </summary>
        public string GetCurrentHappenDate
        {
            get { return System.Web.HttpContext.Current.Session["happenDate"].ToString(); }
        }
        /// <summary>
        /// 获取当前用户操作公司id
        /// </summary>
        public string GetCurrentCompanyId
        {
            get { return System.Web.HttpContext.Current.Session["companyId"].ToString(); }
        }

        /// <summary>
        /// 获取当前用户操作公司名称
        /// </summary>
        public string GetCurrentCompanyName
        {
            get { return System.Web.HttpContext.Current.Session["companyName"].ToString(); }
        }

        /// <summary>
        /// 获取当前用户操作公司纳税人识别号
        /// </summary>
        public string GetCurrentCompanyNSRSBH
        {
            get { return System.Web.HttpContext.Current.Session["companyNSRSBH"].ToString(); }
        }

        /// <summary>
        /// 税款申报期起
        /// </summary>
        public string GetCurrentQuestionSKSSQQ
        {
            get { return System.Web.HttpContext.Current.Session["skssqq"].ToString(); }
        }

        /// <summary>
        /// 税款申报期止
        /// </summary>
        public string GetCurrentQuestionSKSSQZ
        {
            get { return System.Web.HttpContext.Current.Session["skssqz"].ToString(); }
        }

        /// <summary>
        /// 申报期限
        /// </summary>
        public string GetCurrentQuestionSBQX
        {
            get { return System.Web.HttpContext.Current.Session["sbqx"].ToString(); }
        }

        /// <summary>
        /// 发生日期
        /// </summary>
        public string GetCurrentQuestionHappenDate
        {
            get { return System.Web.HttpContext.Current.Session["happenDate"].ToString(); }
        }

        /// <summary>
        /// 当前用户的各自单独的应申报清册id
        /// </summary>
        public string GetCurrentUserYSBQCId
        {
            get { return System.Web.HttpContext.Current.Session["userYSBQCId"].ToString(); }
        }

        /// <summary>
        /// 当前用户共享的应申报清册id
        /// </summary>
        public string GetCurrentYSBQCId
        {
            get { return System.Web.HttpContext.Current.Session["ysbqcId"].ToString(); }
        }
        #endregion
    }
}