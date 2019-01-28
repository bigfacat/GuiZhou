var browser = navigator.appName;
var PKICACOM_ID = "3C474273-7F8B-4690-8C34-855C4528658D";

if (browser == "Microsoft Internet Explorer"){ // IE浏览器
	document.writeln('<object classid="clsid:'+ PKICACOM_ID +'" id="CryTool" border="0" width="14" height="14"  style="display: none;"></object>');
} else if (browser == "Netscape"){ // IE11, Chrome,Firefox浏览器

	if (navigator.userAgent.search("Trident") != -1) {// IE11
		document.writeln('<object classid="clsid:'+ PKICACOM_ID +'" id="CryTool" border="0" width="14" height="14"  style="display: none;"></object>');
	} else {
		//FIXME 无效 不兼容 chrome Firefox*/
		document.writeln('<object classid="clsid:'+ PKICACOM_ID +'" id="CryTool" TYPE="application/x-itst-activex" border="0" width="14" height="14"  style="display: none;"></object>');
	}
}

/*检测Ca插件是否安装*/
function checkQyCa(){
	var loadImg = "${pageContext.request.contextPath }/js/plugs/layer-v2.2/layer/skin/default/loading-2.gif";
	$("#qyCaState").html("<font color='red'>企业CA控件检测中，请稍候...<img style='width:14px;margin-left:10px;' src='"+loadImg+"'/></font>");
	window.setTimeout(function(){
		if(CheckPlugin()){
			$("#qyCaState").html("<font color='green'>企业CA控件正常！可正常使用。</font>");
		}else{
			$("#qyCaState").html("<font color='red'>企业CA控件未安装，请<a href='javascript:downLoadCa();'>下载CA控件安装</a>。</font>");
		}
	}, 500);
}
//检查客户端是否安装了插件，没有则下载
function CheckPlugin() {
	try{
        if(document.all.CryTool.object == null) {
        	return false;
        }
        return true;
    }catch(e){
    	layer.alert("调用出现异常！！！", {title:"提示",icon: 5});
    }
}

function openDevice(userPin){

    if (CryTool.IsDeviceOpened()!= 0){
    	CryTool.CloseDevice();
    }
    CryTool.OpenDeviceEx(userPin);

    if(CryTool.ErrCode==0x57){
    	CryTool.OpenDeviceEx(userPin);
    }
    //devicePort = CryTool.strContainer;
    return CryTool.ErrCode;
}

function ClientHello() {

	CryTool.CheckKey();
	if (CryTool.ErrCode ==167){
    	layer.alert("USBKEY未插或未插好！", {title:"提示",icon: 5});
    	return null;

    }else if(CryTool.ErrCode == 187){
    	layer.alert("请安装USBKEY驱动！", {title:"提示",icon: 5});
    	return null;
    }else if(CryTool.ErrCode == 0){
    	
    	layer.prompt({title: '输入USBKEY口令，并确认', formType: 1, maxlength :9}, function(pass, index){
    		  layer.close(index);
    	    	//2、校验ukey密码
    	    	var errCode = openDevice(pass);
    	        if (errCode != 0 && errCode != -1) {
    				layer.alert("打开设备异常，请检查您的口令是否输入正确！！！ 错误信息：" + CryTool.ErrMsg, { title : "提示",icon : 5 });
    				return null;
    			}
    			// 只要不是纯粹单向认证,就需要服务器证书
    			var vbNullString = "";
    			var dwFlag = 0;

    			CryTool.ClientHello(dwFlag);
    			if (CryTool.ErrCode != 0) {
    				layer.alert("构建联接服务器的数据包出现了问题。  错误信息：" + CryTool.ErrMsg, { title : "提示", icon : 5 });
    				return null;
    			}
    	     	/* 返回接服务器的数据包*/
    			
    			getCaRumAndAuth(CryTool.strResult);
    	     	//return CryTool.strResult;
    	});

    	
    	//2、校验ukey密码
//    	CryTool.VerifyPinEx();
//    	if (CryTool.ErrCode != 0) {
//    		layer.alert("错误代码：VerifyPinEx error "+CryTool.ErrCode+"  错误信息："+CryTool.ErrMsg, {title:"提示",icon: 5});
//        	return null;
//    	} else {
//    		//var errCode = openDevice(userPin);
//    		var errCode = openDevice();
//            
//            if (errCode != 0 && errCode != -1){
//            	layer.alert("打开设备异常，请检查UKey设备是否插入！！！ 错误信息："+CryTool.ErrMsg, {title:"提示",icon: 5});
//            	return;
//            }
//            //只要不是纯粹单向认证,就需要服务器证书
//            var vbNullString="";
//            var dwFlag = 0;
//           	
//           	CryTool.ClientHello(dwFlag);
//           	if(CryTool.ErrCode != 0){
//           		layer.alert("构建联接服务器的数据包出现了问题。  错误信息："+CryTool.ErrMsg, {title:"提示",icon: 5});
//           		return;
//            }
//           	/* 返回接服务器的数据包*/
//           	return CryTool.strResult;
//    	}
        
    }
	
}

function ClientAuth(serverPacket){

	var errCode = 0;
	// 这里是否需要口令
	errCode = openDevice();

  	if (errCode != 0){
  		layer.alert("打开设备出现异常！！！ 。"+ {title:"提示",icon: 5});
  		return;
  	}

    //客户端验证ServerHello
   	CryTool.ClientAuth(serverPacket);

   	if (CryTool.ErrCode != 0){
   		layer.alert("验证 服务器的数据包出现了问题。  错误信息："+CryTool.ErrMsg, {title:"提示",icon: 5});
    	return;
   	}
    //产生客户端认证码后，关闭客户端
    CryTool.CloseDevice();
    //userId = CryTool.strUserId;
    return CryTool.strResult;
}

//XXX Chrome和Firefox浏览器下检测MIME类型是否存在，对IE无效
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

//通知用户安装最新客户端软件
function NotifyInsClient() {
	//layer.alert("您的客户端安装存在问题！", {title:"提示",icon: 5});
}

// 通知用户安装GDCA浏览器插件
function NotifyInsPlugin() {
	layer.alert("您的插件安装存在问题！", {title:"提示",icon: 5});
}

function downLoadCa(){
	window.open("http://file.taxcloud.sdds.gov.cn/soft/sddzswj_ca_setup_v2.13.zip","_blank");
}

function downLoadIE(){
	window.open("http://download.etaxcn.com/gddzswj/gddzswjwybsszgj.zip","_blank");
}