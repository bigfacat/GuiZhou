/**
 * 跳转原index页面，使用原框架进入对应功能页
 * @param url
 * @param m1
 * @param m2
 * @returns
 */
var contPath = "/xxmh";

//从旧门户打开
function goIndexUrl(url,m1,m2,qxkzsx){
	
	window.location.href = "/xxmh/html/index_old.html?gopage=true&url="+escape(url)+"&m1="+m1+"&m2="+m2+"&fromWhere="+"&qxkzsx="+qxkzsx;
}

//本页打开
function goUrl(url){
	window.location.href=url;
}

//新页面打开
function openUrl(url){
	window.open(url);
}

//页头获取已经菜单信息和用户信息
function getMenu(m1){
	$.get(contPath+"/portalSer/getRootMenu.do?t="+new Date().getTime(), function(data){
		var result = eval("("+data+")");
		if(result.flag=="ok"){
			var logoutUrl=result.logoutUrl;
			var ssoServerAddr=result.ssoServerAddr;
			var userName=result.userName;//用户名称
			var yhqymc=result.yhqymc;//用户企业名称
			var name = "欢迎，"+userName;
			if(yhqymc!=""){
				name += "&nbsp;&nbsp;&nbsp;纳税人："+yhqymc; 
			}
			$('#userName').html(name);
			$("#ssoServerAddr").val(ssoServerAddr);//单点登录地址
			$("#logoutUrl").val(logoutUrl);//退出登录地址
		}
	});
}

//获取url参数值
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
	else
	return null;
}

/**
 * 全局搜索拼接URL
 */
function makeUrl(secGnUrl,secCdid,thirdCdtb,thirdGndm){
	var url=secGnUrl;
	if(!url) return "";
	if(secGnUrl.indexOf("?")!=-1){
		url+="&";
	}else{
		url+="?";
	}
	if(secCdid!="") var cid=secCdid;
	url+="cdId="+cid+"&mflag="+thirdCdtb+"&gnDm="+thirdGndm;
	return url;
}
