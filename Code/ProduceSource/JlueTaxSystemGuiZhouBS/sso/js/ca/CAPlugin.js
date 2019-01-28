/**
 * 需要依赖弹层插件layer，如果没有该插件，请改写所有的alert方法
 * **/
var browser = navigator.appName;
// 需要调用的COM组件classid号
var PKICACOM_uuid = "CA969C6B-869A-4508-B54A-A81722F35EA3";

// 判断浏览器类型选择合适的ActiveX适配器调用方式
if (browser == "Microsoft Internet Explorer") // IE浏览器
{
	document.writeln("<OBJECT id=\"PKICACOM\" classid=\"CLSID:" + PKICACOM_uuid
			+ "\" style=\"display:none\"></OBJECT>");
} else if (browser == "Netscape") // IE11, Chrome,Firefox浏览器
{
	if (navigator.userAgent.search("Trident") != -1) // IE11
	{
		document.writeln("<OBJECT id=\"PKICACOM\" classid=\"CLSID:"
				+ PKICACOM_uuid + "\" style=\"display:none\"></OBJECT>");
	} else {
		document
				.writeln("<OBJECT id=\"PKICACOM\" TYPE=\"application/gdca-activex\" clsid=\"{"
						+ PKICACOM_uuid
						+ "}\" WIDTH=\"0\" HEIGHT=\"0\"></OBJECT>");
	}
}

var MyPKICACOM = document.getElementById("PKICACOM");

// Chrome和Firefox浏览器下检测MIME类型是否存在，对IE无效
function DetectGDCAFFlugin() {
	var mimetype = navigator.mimeTypes["application/gdca-activex"];
	if (mimetype) {
		var plugin = mimetype.enabledPlugin;
		if (plugin) {
			return true;
		}
	} else {
		return false;
	}
}

// 通知用户安装最新客户端软件
function NotifyInsClient() {
	//layer.alert("您的客户端安装存在问题！", {title:"提示",icon: 5});
}

// 通知用户安装GDCA浏览器插件
function NotifyInsPlugin() {
	layer.alert("您的插件安装存在问题！", {title:"提示",icon: 5});
}

// 检查客户端是否安装了插件，没有则下载
// 针对不同种浏览器分别处理
function CheckPlugin() {
	if (browser == "Microsoft Internet Explorer") // IE浏览器
	{
		// 对于IE浏览器，通过尝试调用COM组件中的某个方法来判断是否安装了客户端
		try {
			var rv = MyPKICACOM.GetRandom("8", 0);
		} catch (e) {
			NotifyInsClient();
			return false;
		}// try..catch
	} else if (browser == "Netscape") // 如果是IE11, Chrome或Firefox浏览器
	{
		if (navigator.userAgent.search("Trident") != -1) // IE11
		{
			// 对于IE浏览器，通过尝试调用COM组件中的某个方法来判断是否安装了客户端
			try {
				var rv = MyPKICACOM.GetRandom("8", 0);
			} catch (e) {
				NotifyInsClient();
				return false;
			}// try..catch
		} else {
			if (DetectGDCAFFlugin()) {
				try {
					var rv = MyPKICACOM.GetRandom("8", 0);
				} catch (e) {
					NotifyInsClient();
					return false;
				}// try..catch
			} else {
				NotifyInsPlugin();
				return false;
			}
		}
	} else // 如果是Opera浏览器或其它
	{
		layer.alert("很抱歉，目前不支持当前浏览器，请使用IE、火狐、Chrome等浏览器！", {title:"提示",icon: 5});
		return false;
	}
	return true;
}// funcion CheckPlugin

/*******************************************************************************
 * 函数名称：cert_AuthLogin_SignRandom 
 * 创建作者：羊城 
 * 创建日期：2016.3.24
 * 函数功能：该函数为本页面核心函数，实现了客户端COM控件的动态加载、读取用户签名证书
 * 使用用户签名密钥（需要输入PIN码）在客户端对服务器端第一次处理后传递的随机数签名，并返回签名值。 
 * 输入参数： 签名原文
 * 输出参数： 签名值
 * 修改记录：
 ******************************************************************************/

function cert_AuthLogin_SignRandom(randomData) {
	if (!CheckPlugin()) {
		return null;
	}
	var ReadOutSignCert; // 用户签名证书
	var randomData; // 服务器端传来的随机数
	var randomData_b64; // BASE64的随机数
	var ClientSignData; // 客户端签名值

	/***************************************************************************
	 * 第一步：获取多CA兼容COM控件
	 **************************************************************************/
	// var MyPKICACOM = document.getElementById("PKICACOM");
	/***************************************************************************
	 * 第二步：获取服务器端传来的参数，包括服务器端出来的随机数
	 **************************************************************************/

	// 获取服务器端传来的随机数
	if (randomData == "") {
		layer.alert("未得到服务器端传来的随机数！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第三步：用户选择并导出用户签名证书，导出的用户签名证书需传给验签方用于数字验签
	 **************************************************************************/

	try {
		ReadOutSignCert = MyPKICACOM.ExportCert(0, 2); // 1:enc cert, 2: sign
														// cert
	} catch (objError) {
		layer.alert("选择加载用户签名证书出错！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第四步：在客户端对随机数进行签名
	 **************************************************************************/

	/***************************************************************************
	 * 对随机数进行BASE64位编码，并设置到待签名内容中，这步是签名前的必要步骤，因为签名的原文必须是BASE64编码
	 **************************************************************************/
	try {
		randomData_b64 = MyPKICACOM.Base64Encode(randomData);
	} catch (objError) {
		layer.alert("BASE64编码出错！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 对传入的BASE64位已编码数据进行数字签名，签名后的数据保存在ClientSignData中
	 **************************************************************************/
	try {
		ClientSignData = MyPKICACOM.SignWithCert(0, 100, randomData_b64,
				ReadOutSignCert); // 100: PKCS7,110: PKCS1
	} catch (objError) {
		layer.alert("您的CA登录失败，请连接您的CA认证装置或检查CA认证装置的驱动程序。", {title:"提示",icon: 5});
		return null;
	}

	// alert("对数据的签名值" + SignOutData);
	if (ClientSignData == "") {
		layer.alert("客户端签名失败，请检查！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第五步：签名成功,回传相应数据
	 **************************************************************************/
	return ClientSignData;
}

/**
 * pk1签名
 * @param randomData 签名原文
 * @returns
 */
function cert_AuthLogin_SignRandom_pk1(randomData) {
	if (!CheckPlugin()) {
		return null;
	}
	var ReadOutSignCert; // 用户签名证书
	var randomData; // 服务器端传来的随机数
	var randomData_b64; // BASE64的随机数
	var ClientSignData; // 客户端签名值
	var signAlgo = "sha1WithRsa";//签名算法

	/***************************************************************************
	 * 第一步：获取多CA兼容COM控件
	 **************************************************************************/
	// var MyPKICACOM = document.getElementById("PKICACOM");
	/***************************************************************************
	 * 第二步：获取服务器端传来的参数，包括服务器端出来的随机数
	 **************************************************************************/

	// 获取服务器端传来的随机数
	if (randomData == "") {
		layer.alert("未得到服务器端传来的随机数！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第三步：用户选择并导出用户签名证书，导出的用户签名证书需传给验签方用于数字验签
	 **************************************************************************/

	try {
		ReadOutSignCert = MyPKICACOM.ExportCert(0, 2); // 1:enc cert, 2: sign
														// cert
	} catch (objError) {
		layer.alert("选择加载用户签名证书出错！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第四步：在客户端对随机数进行签名
	 **************************************************************************/

	/***************************************************************************
	 * 对随机数进行BASE64位编码，并设置到待签名内容中，这步是签名前的必要步骤，因为签名的原文必须是BASE64编码
	 **************************************************************************/
	try {
		randomData_b64 = MyPKICACOM.Base64Encode(randomData);
	} catch (objError) {
		layer.alert("BASE64编码出错！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 对传入的BASE64位已编码数据进行数字签名，签名后的数据保存在ClientSignData中
	 **************************************************************************/
	try {
		ClientSignData = MyPKICACOM.SignWithCert(0, 110, randomData_b64,
				ReadOutSignCert); // 100: PKCS7,110: PKCS1
	} catch (objError) {
		layer.alert("您的CA登录失败，请连接您的CA认证装置或检查CA认证装置的驱动程序。", {title:"提示",icon: 5});
		return null;
	}

	// alert("对数据的签名值" + SignOutData);
	if (ClientSignData == "") {
		layer.alert("客户端签名失败，请检查！", {title:"提示",icon: 5});
		return null;
	}

	/***************************************************************************
	 * 第五步：签名成功,回传相应数据
	 **************************************************************************/
	var ret = {};
	ret.randnum = randomData;
	ret.signData = ClientSignData;
	ret.signCert = ReadOutSignCert;
	ret.signAlgo = signAlgo;
	return ret;
}
