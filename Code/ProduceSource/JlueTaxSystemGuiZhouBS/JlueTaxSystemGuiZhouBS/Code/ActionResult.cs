using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JlueTaxSystemGuiZhouBS.Code
{
    public class ActionResult
    {
        /// <summary>
        /// 是否返回成功
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// 返回代码
        /// </summary>
        public int Code { get; set; }
        /// <summary>
        /// 返回提示信息
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// 返回数据
        /// </summary>
        public string Data { get; set; }
    }
}