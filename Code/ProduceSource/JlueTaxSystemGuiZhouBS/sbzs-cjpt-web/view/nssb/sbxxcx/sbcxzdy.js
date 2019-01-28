/**
 * 申报查询自定义js
 */

/**
 * 申报信息（电厅）打印pdf 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询国地税归档信息
 * @param pzxh
 * @param gdslxDm
 */
function dtprintPdf(pzxh,gdslxDm){
	var top="auto"//默认自动
	if(window.top==window.self){
		//不存在父页面
	}else{
		top=window.parent.document.documentElement.scrollTop+200+"px";
	}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var printPdfUrl = "printPdf.do?pzxh=" + pzxh +"&gdslxDm="+gdslxDm;
	$.ajax({
		url : printPdfUrl,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			var pdfName = eval("(" + data + ")");
			if (pdfName == null || pdfName == "") {
				alertMSGs('非本渠道申报，暂不提供打印!', {icon : 5});
				return;
			}
			var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName="+ pdfName + "&gdslxDm=" + gdslxDm +"&DZSWJ_TGC=" + DZSWJ_TGC ;;
			window.open(url);
		},
		error : function() {
			alertMSGs('链接超时或网络异常', {icon : 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
	
}


/**
 * 申报信息（产品） pdf显示 此方法可重写 ,重写此方法可根据地方实际情况获取pdf信息 此处默认查询产品归档信息
 * @param pzxh
 * @param version
 * @param gdslxDm
 */
function printPdf(pzxh, version,gdslxDm){
	var weburl = window.location.href;
	var top="auto"//默认自动
	if(window.top==window.self){
		//不存在父页面
	}else{
		top=window.parent.document.documentElement.scrollTop+200+"px";
	}
	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var openPdfurl = "openPdf.do?pzxh=" + pzxh + "&version=" + version+"&gdslxDm="+gdslxDm;
	$.ajax({
		url : openPdfurl,
		type : "GET",
		data : {},
		dataType : "json",
		contentType : "application/json",
		success : function(data) {
			var pdfurl = eval("(" + data + ")");
			if(version =="1" || version =="3"){
				if(pdfurl == null || pdfurl==""){
					alertMSGs('无对应pdf信息，请联系管理员核实!', {icon: 5});
					return;
				}
				var url = "/zlpz-cjpt-web/view/ssws/viewAttachment.jsp?targetName=" + pdfurl+"&gdslxDm="+gdslxDm+ "&DZSWJ_TGC=" + DZSWJ_TGC ;
				window.open(url);
			}else{
				var arrUrl = weburl.split("?");
				pdfurl=pdfurl+"&"+arrUrl[1];
				window.open(pdfurl);
			}
		},
		error : function() {
			alertMSGs('链接超时或网络异常', {icon : 5});
		},
		complete : function() {
			layer.close(index);
		},
		timeout : 1000000000
	});
}

/*
 * 提示
 */
function alertMSGs(msg){
	layui.use('layer', function(){
		var layer = layui.layer;
		layer.open({
			type : 1,
			area : [ '300px' ], //固定宽高400px
			offset : top,
			title : [ '提示信息' ],
			scrollbar : false,
			content : msg,
			btn : ['关闭' ],
			btnAlign : 'r', //按钮居右
			yes : function() {
				layer.closeAll();
			}
		});
	}); 
}