using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Web.SessionState;
using System.Text;
using JlueTaxSystemGuiZhouBS.Code;

namespace JlueTaxSystemGuiZhouBS.Controllers
{
    public class saveController : Controller
    {
        public JObject saveYsqbw(string ywbm)
        {
            JObject re_json = new JObject();

            string inputData = HttpUtility.UrlDecode(Request.Form["saveData"], Encoding.GetEncoding("utf-8"));
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(inputData);

            GDTXGuiZhouUserYSBQC item = GTXMethod.GetYSBQCByBDDM(ywbm);

            List<GTXNameValue> nameList = new List<GTXNameValue>();
            GTXNameValue nv = new GTXNameValue();
            nv.key = "data";
            byte[] bytes = Encoding.Default.GetBytes(JsonConvert.SerializeObject(input_jo));
            string _result = Convert.ToBase64String(bytes);
            nv.value = _result;
            nameList.Add(nv);
            GTXResult saveresult = GTXMethod.SaveUserReportData(JsonConvert.SerializeObject(nameList), item.Id.ToString(), item.BDDM);
            if (saveresult.IsSuccess)
            {
                string sbse = GTXMethod.getSbseFromJSON(item.BDDM, input_jo);
                if (sbse != "")
                {
                    GTXMethod.UpdateSBSE(item.Id.ToString(), sbse);
                }

                re_json["returnFlag"] = "Y";
                re_json["viewOrDownload"] = "view";
            }
            else
            {
                re_json["returnFlag"] = "N";
                re_json["viewOrDownload"] = "view";
            }

            return re_json;
        }

    }
}