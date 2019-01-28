/**
 * 一般纳税人期初数设置js
 */

/**
 * 初始化回调方法
 */
function initCallback() {
	parent.autoResizeIframe("iframehtm");
	var url = parent.location.href;
	if (parent.formData != "" && url.indexOf("sjlybz=01") > -1) {
		/*
		 * parent.Message.succeedInfo({title : "提示", message : "获取局端数据成功。",
		 * handler : function() {
		 *  } });
		 */
	}
	parent.$("#qcsszTab").find("li").click(function() {
		var id = $(this).attr("href");
		if($(id).length>0){
			$(id)[0].scrollIntoView({
			    behavior: "smooth", // or "auto" or "instant"
			    block: "end" // or "end"
			});
		}
	});
	$(".NewTableMain").find("input[tips]").hover(function(){
		var id = this.id;
		var tipsTxt = $(this).attr("tips");
		var tip_index = layer.tips(tipsTxt, '#'+id,{
						  tips: [1,'#0FA6D8'] //还可配置颜色
						  //,tipsMore: true
					      ,time: 0
						});
		$(this).data('tipIndex', tip_index);
	},function(){
        layer.close($(this).data('tipIndex'));
	});
	if(url.indexOf("gzsb=Y") == -1){
		parent.$("#hqjdsj").show();
	}
	parent.$("#qcsszTab").show();
	var jsonData = parent.formData;
	if(jsonData.sssq.rqQ != undefined && typeof jsonData.sssq.rqQ == "string"){
		var year = jsonData.sssq.rqQ.substr(0,4);
		if(year >= "2017"){
			$("#gzld").attr("readonly",true);
			$("#gzld").parent("td").removeClass("EditInput01").addClass("ReadInput01");
		}
	}
};

parent.saveDataCallback = function(data){
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var result = pathName.substr(0, index + 1);
	var url = parent.location.protocol + "//" + parent.location.host +  result +"/biz/sbzs/ybnsrzzs" + parent.location.search;
	if((parent.location.search && parent.location.search.indexOf("gotoSbb=Y")>-1) || (parent.location.search && parent.location.search.indexOf("gzsb=Y")>-1)){
		parent.window.location.href = url;
	}
	
}