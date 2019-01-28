/**
 * @file autoLoadJS.js
 * @title 自动加载js
 * @description form填表页目前已加载许多框架js,如果需要修改则必须同时修改多个index.jsp,
 * 				引入autoLoadJS.js后只需修改此文件的加载内容即可做到修改全部index.jsp
 * @copyright Copyright(c) Foresee Science & Technology Ltd.
 * @author huangweiping@foresee.com.cn
 * @version 1.0
 * @history 修订历史（历次修订内容、修订人、修订时间等）
 */

// 将index.jsp需要引入的公用js加入此数组，开头的
//$res$-/sxsq-cjpt-web/abacus/_res_   
//$cp$-/sxsq-cjpt-web     
//ywbm-xgmzzs
var jsList = new Array();
jsList = [
	"$cp$/abacus$ywlx$_res/ywbm/js/ywbm.js",
	"$cp$/abacus$ywlx$_res/commonDeliver.js"
    /*"$cp$/abacus/resources/js/lib/pdfcheck.js",
    "$res$/js/abacus/fxsmInitData.js",
	"$res$/js/message/Message.js",
	"$cp$/$yw$_res/common.js",
	"$res$/js/lib/json3.min.js",
	"$res$/js/lib/jsonpath.js",
	"$res$/js/lib/mask.js",
	"$res$/js/abacus/fsjpath.js",
	"$res$/js/abacus/formulaFunction.js",
	"$res$/js/abacus/formEngine.js",
	"$res$/js/abacus/formulaEngine.js",
	"$res$/js/abacus/sbCommon.js",
	"$res$/js/abacus/menuBtnEvent.js",
	"$res$/js/abacus/viewEvent.js",
	"$res$/js/lib/message.js",
	"$res$/js/abacus/formDebuging.js",
	"$res$/js/layer-v2.2/layer/layer.js",
	"$res$/js/layer-v2.2/layer/extend/layer.ext.js"*/
	];

// 获取站点路径 与 业务编码 - 在index.jsp已有设置全局变量，赋值给本地变量即可
var cp = getContextPath();     		// eg. /sbzs-cjpt-web
var res = cp + "/abacus/_res_";		// eg. /sbzs-cjpt-web/abacus/_res_
var ywlx = cp.substring(0, cp.indexOf("-"));	// eg. /sbzs
var t_ywbm = getYwbm(); 					// eg. xgmzzs

// 动态加载公共js，页面加载时添加，由于index.jsp页面有部分js代码，所以jquery.min.js依然在页面引入，
window.onload = function autoLoadJavaScript () {
	// 加载js列表
	for (i=0 ; i<jsList.length ; i++) {
		// 创建script标签
		var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        var url = jsList[i].replace("$res$",res).replace("$cp$",cp).replace("$ywlx$",ywlx).replace(/ywbm/g,t_ywbm);
        oScript.src = url;
        
		// 在body节点末尾增加标签
		var temp = document.getElementsByTagName("body");
        if (temp && temp.length > 0) {
        	temp[0].appendChild(oScript);
            console.log("动态添加js:"+url);
        } else {
        	console.log("动态增加头部信息节点失败, 无法获取 HEAD 节点, 添加js:"+url+"失败");
        }
	}
}

/**
 * 获取根目录
 * @returns	eg. /sbzs-cjpt-web、/sxsq-cjpt-web
 */
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return result;
}

/**
 * 获取ywbm
 * @returns	eg. xgmzzs、ybnsrzzs
 */
function getYwbm() {
	var pathName = document.location.pathname;
	var node = pathName.split("/");
	var ywbm = node[4];
	return ywbm;
}