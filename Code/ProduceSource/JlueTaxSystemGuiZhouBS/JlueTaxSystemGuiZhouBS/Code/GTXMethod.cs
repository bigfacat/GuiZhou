using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;

namespace JlueTaxSystemGuiZhouBS.Code
{
    public class GTXMethod
    {

        public static GTXResult GetEnter()
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string userid = CurrentUser.GetInstance().GetCurrentUserId;
            string QuestionId = CurrentUser.GetInstance().GetCurrentQuestionId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GTXUserQuestion/GetEnter?userid=" + userid + "&questionid=" + QuestionId + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }
        /// <summary>
        /// 获取企业联系人
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetCompanyPerson()
        {
            string companyId = CurrentUser.GetInstance().GetCurrentCompanyId;
            string path = System.Configuration.ConfigurationManager.AppSettings["Practicepath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/CompanyPerson.asmx/GetByCompanyId?CompanyId=" + companyId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取企业信息表记录
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetCompany()
        {
            string companyId = CurrentUser.GetInstance().GetCurrentCompanyId;
            string path = System.Configuration.ConfigurationManager.AppSettings["Practicepath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/Company.asmx/GetByCompanyId?CompanyId=" + companyId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取学员题目信息
        /// </summary>
        /// <param name="id">用户题目id</param>
        /// <returns></returns>
        public static GTXResult GetUserQuestion(string id)
        {
            string userid = CurrentUser.GetInstance().GetCurrentUserId;
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GTXUserQuestion/GetEnter?userid=" + userid + "&questionid=" + id + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }


        /// <summary>
        /// 获取国地税的的应申报清册记录
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetGuiZhouYSBQC()
        {
            string userid = CurrentUser.GetInstance().GetCurrentUserId;
            string questionId = CurrentUser.GetInstance().GetCurrentQuestionId;
            string classid = CurrentUser.GetInstance().GetCurrentClassId;

            
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/GetList?userid=" + userid + "&questionId=" + questionId + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 国地税通用的保存报表数据
        /// </summary>
        /// <param name="jsonReportData">报表中的name value</param>
        /// <returns></returns>
        public static GTXResult SaveUserReportData(string jsonReportData, string userYsbqcId, string reportCode)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string userId = CurrentUser.GetInstance().GetCurrentUserId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Add", string.Format("classid={0}&jsonReportData={1}&userYsbqcId={2}&reportCode={3}&userId={4}"
                , classid, jsonReportData, userYsbqcId, reportCode, userId));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取国地税通用的已保存的报表数据
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetUserReportData(string userYsbqcId, string reportCode)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Get", string.Format("classid={0}&userYsbqcId={1}&reportCode={2}"
                , classid, userYsbqcId, reportCode));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 更新应申报清册的状态,已申报
        /// </summary>
        public static GTXResult UpdateYSBQC(string userYSBQCId, string SBZT)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/UpdateSBZT?Id=" + userYSBQCId + "&classid=" + classid + "&SBZT=" + SBZT;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        public static string getYnse(string taskname, string sbformdata)
        {
            string ynse = "0.00";
            string qty = "";
            double yse=0.00;
            if (taskname == "增值税小规模纳税人申报（新版）")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNode xnSB_NSSBB_MXXX = doc.SelectSingleNode("zzssyyxgmnsr/zzsxgmGrid/zzsxgmGridlb");
                XmlNodeList xnRecIDList = xnSB_NSSBB_MXXX.ChildNodes;
                XmlNode xnSB_NSSBB_JEXX = xnRecIDList[23];
                ynse = xnSB_NSSBB_JEXX.InnerText;
            }
            else if (taskname == "印花税纳税申报（报告）表")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNodeList xnSB_NSSBB_MXXX = doc.SelectNodes("yhssb/yhssbGrid/yhssbGridlb");
                foreach (XmlNode node in xnSB_NSSBB_MXXX)
                {
                    qty= node["bqybtse"].InnerText;
                    double a=Convert.ToDouble(qty);
                    double b = Convert.ToDouble(yse);
                    yse =a+b;
                    ynse = yse.ToString();
                }
               // XmlNode xnSB_NSSBB_JEXX = xnRecIDList[8];
               
            }
            else if (taskname == "附加税（费）申报")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNodeList xnSB_NSSBB_MXXX = doc.SelectNodes("fjssbb/sbxxGrid/sbxxGridlbVO");
                foreach (XmlNode node in xnSB_NSSBB_MXXX)
                {
                    qty = node["bqybtse"].InnerText;
                    double a = Convert.ToDouble(qty);
                    double b = Convert.ToDouble(yse);
                    yse = a + b;
                    ynse = yse.ToString();
                }
               // XmlNode xnSB_NSSBB_JEXX = xnRecIDList[14];
              
            }
            else if (taskname == "通用申报表（工会经费）")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNodeList xnSB_NSSBB_MXXX = doc.SelectNodes("fxmtySbb/sbxxGrid/sbxxGridlb");
                foreach (XmlNode node in xnSB_NSSBB_MXXX)
                {
                    qty = node["bqybtsfe"].InnerText;
                    double a = Convert.ToDouble(qty);
                    double b = Convert.ToDouble(yse);
                    yse = a + b;
                    ynse = yse.ToString();
                }
                //XmlNode xnSB_NSSBB_JEXX = xnRecIDList[18];
               
            }
            else if (taskname == "居民企业所得税月（季）度预缴纳税申报（A类）")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNode xnSB_NSSBB_MXXX = doc.SelectSingleNode("A200000Ywbd/sbbxxForm");
                XmlNodeList xnRecIDList = xnSB_NSSBB_MXXX.ChildNodes;
                XmlNode xnSB_NSSBB_JEXX = xnRecIDList[14];
                ynse = xnSB_NSSBB_JEXX.InnerText;
            }
            else if (taskname == "居民企业所得税月（季）度预缴纳税申报（B类）")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNode xnSB_NSSBB_MXXX = doc.SelectSingleNode("qysdshdzsyjdndsb/qysdsyddhndnssbbblFrom");
                XmlNodeList xnRecIDList = xnSB_NSSBB_MXXX.ChildNodes;
                XmlNode xnSB_NSSBB_JEXX = xnRecIDList[14];
                ynse = xnSB_NSSBB_JEXX.InnerText;
            }
            else if (taskname == "增值税一般纳税人申报")
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(sbformdata);
                XmlNode xnSB_NSSBB_MXXX = doc.SelectSingleNode("fxmtySbb/sbxxGrid/sbxxGridlb");
                XmlNodeList xnRecIDList = xnSB_NSSBB_MXXX.ChildNodes;
                XmlNode xnSB_NSSBB_JEXX = xnRecIDList[18];
                ynse = xnSB_NSSBB_JEXX.InnerText;
            }
            return ynse;
        }
        /// <summary>
        /// 更新应申报清册的申报税额
        /// </summary>
        public static GTXResult UpdateSBSE(string userYSBQCId, string SBSE)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/UpdateSBSE?Id=" + userYSBQCId + "&classid=" + classid + "&SBSE=" + SBSE;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 更新应申报清册的填报情况
        /// </summary>
        public static GTXResult UpdateYSBQCtbzt(string userYSBQCId, string reportCode, string tbzt)
        {
            string nowtbzt = tbzt;

            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/Updatetbzt?Id=" + userYSBQCId + "&classid=" + classid + "&tbzt=" + nowtbzt;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 更新应申报清册的填报情况
        /// </summary>
        public static GTXResult UpdateYSBQCxbsz(string userYSBQCId, string reportCode, string xbsz)
        {
            string nowxbsz = xbsz;

            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/Updatexbsz?Id=" + userYSBQCId + "&classid=" + classid + "&xbsz=" + nowxbsz;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 根据userYSBQCId获取国地税的的应申报清册记录
        /// </summary>
        /// <returns></returns>
        public static GTXResult GetAHYSBQCByUserYSBQCId(string UserYSBQCId)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;

            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXAHUserYSBQC/GetModel?Id=" + UserYSBQCId + "&classid=" + classid;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 删除用户报表数据
        /// </summary>
        /// <returns></returns>
        public static GTXResult DeleteUserReportData(string userYsbqcId, string reportCode)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string userId = CurrentUser.GetInstance().GetCurrentUserId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GDTXGuiZhouUserYSBQCReportData/Delete", string.Format("classid={0}&userYsbqcId={1}&userId={2}&reportCode={3}"
                , classid, userYsbqcId, userId, reportCode));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        //作废
        public static GTXResult InitDataDF(string UserYSBQCId)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string UserQuestionId = CurrentUser.GetInstance().GetCurrentUserQuestionId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/GTX/GDTXGuiZhouUserYSBQC/InitDataDF?classid=" + classid + "&UserYSBQCId=" + UserYSBQCId + "&UserQuestionId=" + UserQuestionId;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取报表数据配置记录
        /// </summary>
        /// <param name="toReportCode"></param>
        /// <returns></returns>
        public static GTXResult GetAHReportDataConfig(string toReportCode)
        {
            string path = System.Configuration.ConfigurationManager.AppSettings["Practicepath"];
            publicmethod p = new publicmethod();
            string fullpath = path + "/APIPractice/GuiZhou/ReportDataConfigGuiZhou.asmx/GetListByToReportCode?toReportCode=" + toReportCode;
            string json = p.Get(fullpath);
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        /// <summary>
        /// 获取匹配数据
        /// </summary>
        /// <param name="jsonName"></param>
        /// <returns></returns>
        public static GTXResult LoadAHReportData(string jsonName, string useYSBQCId)
        {
            string classid = CurrentUser.GetInstance().GetCurrentClassId;
            string path = System.Configuration.ConfigurationManager.AppSettings["tikupath"];
            publicmethod p = new publicmethod();
            string json = p.HttpPost(path + "/GTX/GTXGuiZhouUserYSBQCReportData/GetListByUserYSBQCIdAndKey"
                , string.Format("classid={0}&UserYSBQCId={1}&jsonnames={2}", classid, useYSBQCId, jsonName));
            return JsonConvert.DeserializeObject<GTXResult>(json);
        }

        public static string make(string ZSXMMC)
        {
            string id = "";
            GTXResult resultq = GTXMethod.GetGuiZhouYSBQC();
            if (resultq.IsSuccess)
            {
                List<GDTXGuiZhouUserYSBQC> ysbqclist = JsonConvert.DeserializeObject<List<GDTXGuiZhouUserYSBQC>>(resultq.Data.ToString());
                if (ysbqclist.Count > 0)
                {
                    foreach (GDTXGuiZhouUserYSBQC item in ysbqclist)
                    {
                        if (item.ZSXM == ZSXMMC)
                        {
                            id = item.Id.ToString();
                        }
                    }
                }
            }

            GTXResult upresult = GTXMethod.UpdateYSBQC(id, "已申报");
            if (upresult.IsSuccess)
            {
                return "";
            }
            else
            {
                return upresult.Message;
            }

        }

        public static JObject getNsrxx(JObject in_jo)
        {
            GTXResult gr1 = GetCompany();
            if (gr1.IsSuccess)
            {
                JObject jo = new JObject();
                jo = JsonConvert.DeserializeObject<JObject>(gr1.Data.ToString());
                if (jo.HasValues)
                {
                    JObject data_jo = jo;
                    in_jo["nsrmc"] = data_jo["NSRMC"];
                    in_jo["nsrsbh"] = data_jo["NSRSBH"];
                    in_jo["djzclxMc"] = data_jo["DJZCLX"];
                    in_jo["zcdz"] = data_jo["ZCDZ"];
                    in_jo["jydz"] = data_jo["SCJYDZ"];
                    in_jo["dhhm"] = data_jo["LXDH"];
                    in_jo["sshy"] = data_jo["GBHY"];
                    in_jo["hymc"] = data_jo["GBHY"];
                    in_jo["zgswskfjmc"] = data_jo["ZGDSSWJFJMC"];

                }
            }

            GTXResult gr2 = GetCompanyPerson();
            if (gr2.IsSuccess)
            {
                JArray ja = new JArray();
                ja = JsonConvert.DeserializeObject<JArray>(gr2.Data.ToString());
                if (ja.Count > 0)
                {
                    JObject data_jo = (JObject)ja[0];
                    in_jo["frxm"] = data_jo["Name"];
                    in_jo["fddbrsfzjhm"] = data_jo["IDCardNum"];

                }
            }

            return in_jo;
        }

    }
}