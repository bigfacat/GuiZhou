﻿/**
 * 附送资料多文件上传组件 
 * 基于JQuery、AngularJS等JS框架和uploadify多文件上传插件
 */

var upLoadFileNum=0;								    //正在上传的文件数
/*进度条变化设置设置*/
var orange = 25, yellow = 50, green = 85;
var sbywbm ='';
var gdslxDm = "";
var ywbm ='';
$(document).ready(function(){
	getSbywbm();	
	getGdslxDm();
	
	$("#uploadify").fileupload({
        dataType: 'json',
		url:'../attachmentSb/uploadXSLFile.do?sbywbm='+sbywbm+'&DZSWJ_TGC=' + DZSWJ_TGC + '&gdslxDm=' + gdslxDm,
        formData : { 'someKey' : 'someValue' },
        autoUpload: false,
        fileTypes: 'xls',
        disabled:false,
        maxFileSize: 10*1024*1024, // 10 MB
        sequentialUploads: true,
        queueID:'queue',
        paramName: 'xls',
        add: function (e, data) {
            $data = data;
        }
	}).on("fileuploadchange", function(e, data) {
		var isPass = validateBeforeSend(e, data, this);
		if(!isPass){
			return;
		}
		uploadify_onSelect(e, data, this);
	}).on("fileuploadstart",function(e, data){
		uploadify_onUploadStart(data, this);
	}).on("fileuploadfail",function(e, data){
		canceljudge();
		onFileuploadfail(e, data, this);
	}).on("fileuploaddone",function(e, data){
		uploadify_onUploadProgress(e, data, this);
		uploadify_onUploadSuccess(e, data, this);
	}).on("fileuploadprogress",function(e, data){
		uploadify_onUploadProgress(e, data, this);
	});
});

var onFileuploadfail = function(e, data, $this){
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var status = data.bitrateInterval;
	if (status === 500) {
        layer.alert("文件格式或大小不合标准", {title:"提示",icon: 5});
	} else if (status === 404){
		layer.alert("服务器无响应，请检查网络状况", {title:"提示",icon: 5});
	} else {
		layer.alert("上传出现未知异常!", {title:"提示",icon: 5});
	}
};

var validateBeforeSend = function(e, data, $this){
	var file = data.files[0];
	var settings = $($this).fileupload('option');
    var acceptFileTypes=new RegExp('(\.|\/)('+settings.fileTypes+')$', 'i');
    var msgText = "上传失败\n";
    var isError = false;
	if(file.size>settings.maxFileSize){
        msgText += "文件大小超过限制( " + settings.maxFileSize/1024 + " KB)"; 
        isError = true;
	}else if(acceptFileTypes &&
            !(acceptFileTypes.test(file.type) ||
            		acceptFileTypes.test(file.name))){
        msgText += "文件格式不正确，仅限 " + settings.fileTypes;  
        isError = true;
	}
	if(isError){
		canceljudge();
	    parent.layer.alert(msgText, {title:"提示",icon: 5});
	    return false;
	}
	return true;
};

//选择文件后调用
var uploadify_onSelect = function(e, data, $this) {
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var fileSize = Math.round(file.size / 1024);
	var suffix   = 'KB';
	if (fileSize > 1000) {
		fileSize = Math.round(fileSize / 1000);
		suffix   = 'MB';
	}
	var fileSizeParts = fileSize.toString().split('.');
	fileSize = fileSizeParts[0];
	if (fileSizeParts.length > 1) {
		fileSize += '.' + fileSizeParts[1].substr(0,2);
	}
	fileSize += suffix;
	var queue = $('#' + settings.queueID);
	if(file.size===undefined){
		queue.html('<span class="uploadify-button-text" id="data2">'+file.name+'</span>');
	}else{
		queue.html('<span class="uploadify-button-text" id="data2">'+file.name+"["+fileSize+"]"+'</span>');
	}
	$('#fs').html(0);
	$('#sczt').html("就绪");
	$("#sczt").removeAttr('style');
	if($("#fs").html()=='0'){
		$('#uploadjudge').show();
		$('#delete').show();
	}else{
		$('#uploadjudge').hide();
		$('#delete').show();
	}
};


//开始上传文件后调用
var uploadify_onUploadStart = function(data,$this) {
	var file = data.files[0];
	var settings = $($this).fileupload('option');
	var trobj=$("#queue").parent().parent();
	var divwidth=trobj.width()/2;
	var divheight=trobj.height()/2;
	var divmargin=divheight/2;				
	var divhtml='<div class="uploadify-queue-item">\
		<span class="fileName">'+file.name+'</span><span id="data1"></span>\
		<div class="uploadify-progress">\
			<div class="uploadify-progress-bar1" id="bar1"><!--Progress Bar--></div>\
		</div>\
	</div>';
	//$("#divbar").html($("#divbar").html()+divhtml);
	divhtml='<div class="uploadify-queue-item">\
		<div class="progress" id="progress">\
			<b class="progress__bar" id="progress__bar">\
		    	<span class="progress__text" id="progress__text">\
		    	'+file.name+' <span class="progress__text" id="data3"></span>\
		    	</span>\
		  	</b>\
		</div>\
	</div>';
	divhtml='<div class="uploadify-div-bar2">\
		<div class="progress" id="progress">\
			<span class="progress__text" id="data3"></span>\
			<b class="progress__bar" id="progress__bar">\
		  	</b>\
		</div>\
	</div>';
	
	$("#queue").html(divhtml);
	$("#progress").addClass('progress--active');
	$("#sczt").removeAttr('style');
	$("#sczt").html("上传中");
	var param = {};
	upLoadFileNum = upLoadFileNum + 1;
	data.formData=param;
	if($("#fs").html()=='0'){
		$('#uploadjudge').show();
		$('#delete').show();
	}else{
		$('#uploadjudge').hide();
		$('#delete').show();
	}
};

//上传到服务器，服务器返回相应信息到data里
var uploadify_onUploadSuccess = function(e, data, $this){
	upLoadFileNum = upLoadFileNum - 1;
	if(upLoadFileNum == 0){
		setTimeout(function () {
			$("#divbar").html('');
		}, 3000);
	}	
	if(data != null){
		var data_={};
		try{
			data_ = data.result;
		}catch(e){
			data_.flag=='failure';
		}
		if(data_.flag=='ok'){
			$('#fs').html(1);
			$('#bcwjm').val(data_.targetName);			
			$('#sczt').html("成功");
			$("#sczt").removeAttr('style');
			//上传成功之后关闭对话框架，提示文件已上传成功，可以进入申报表页面申报
			var messageTips = "文件上传成功,点击下一步进入申报表页面申报!";
			if(sbywbm.indexOf("QYSDS_A_ND")>-1){
				messageTips = "文件上传成功!";
			}
			Message.succeedInfo({
				title : "提示", 
				message : messageTips,
				handler : function(sign) {
					if ("ok"===sign){
						closeModa(data_);
					}
				}
			});
		}else{
			$('#sczt').html("失败");
			$("#sczt").css({
				color: 'red'
			}); 
		}
	}else{
		$('#sczt').html("失败");
		$("#sczt").css({
			color: 'red'
		}); 
	}
	if($("#fs").html()==='0'){
		$('#uploadjudge').show();
		$('#delete').show();
	}else{
		$('#uploadjudge').hide();
		$('#delete').show();
	}
};

var update = function(file, percent) {
	
	var fileSize = Math.round(file.size / 1024);
	var suffix   = 'KB';
	if (fileSize > 1000) {
		fileSize = Math.round(fileSize / 1000);
		suffix   = 'MB';
	}
	var fileSizeParts = fileSize.toString().split('.');
	fileSize = fileSizeParts[0];
	if (fileSizeParts.length > 1) {
		fileSize += '.' + fileSizeParts[1].substr(0,2);
	}
	fileSize += suffix;
	
	if(file.size===undefined){
		$('#data3').html(file.name);
	}else{
		$('#data3').html(file.name+"["+fileSize+"]"+' - ' + percent + '%');
	}

	if (percent >= 100) {
		percent = 100;
		$('#progress').addClass('progress--complete');
		$('#progress__bar').addClass('progress__bar--blue');
		if(file.size===undefined){
			$('#data3').html(file.name+' - Complete');
		}else{
			$('#data3').html(file.name+"["+fileSize+"]"+' - Complete');
		}
		$('#sczt').html("处理中");
	} else {
		if (percent >= green) {
			$('#progress__bar').addClass('progress__bar--green');
		} else if (percent >= yellow) {
			$('#progress__bar').addClass('progress__bar--yellow');
		} else if (percent >= orange) {
			$('#progress__bar').addClass('progress__bar--orange');
		}
	}
	$('#progress__bar').css({
		width : percent + '%'
	});
	$('#uploadjudge').show();
	$('#delete').show();
};

var uploadify_onUploadProgress = function(e, data, $this) {
	var file = data.files[0];
	var fileBytesLoaded=data.loaded;
	var fileTotalBytes=data.total;
	var settings = $($this).fileupload('option');

	// Setup all the variables
	var timer            = new Date();
	var newTime          = timer.getTime();
	var lapsedTime       = newTime - this.timer;
	if (lapsedTime > 500) {
		this.timer = newTime;
	}
	var lapsedBytes      = fileBytesLoaded - this.bytesLoaded;
	this.bytesLoaded     = fileBytesLoaded;
	var percentage       = Math.round(fileBytesLoaded / fileTotalBytes * 100);
    update(file, percentage);
};
//单个点击取消超链接判断
function canceljudge(){
	if($("#fs").html()=='1'){
		$('#fs').html(0);
		$('#sczt').html("未上传");
		$("#queue").html("");
	}else{
		$('#sczt').html("未上传");
		$("#queue").html("");
	}
	$('#bcwjm').val("");
	$('#delete').hide();
	$('#uploadjudge').hide();
}

//单个点击上传超链接判断
function uploadjudge(){
	if($("#fs").html()=='1'){
		layer.alert('文件已上传', {title:"提示",icon: 5});
		$('#uploadjudge').hide();
		$('#delete').show();
	}
	$data.process().done(function () {
        $data.submit();
    });
	if($("#fs").html()=='0'){
		$('#uploadjudge').show();
		$('#delete').show();
	}else{
		$('#uploadjudge').hide();
		$('#delete').show();
	}
}

function closeModa(data_){
	var $myModa1 = $(window.parent.document).find("#myModa1");
	$winbox_bg=$(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({"z-index":100})
	$winbox_bg.hide().animate({opacity:0})
	$myModa1.hide().animate({top:"10%",opacity:"0"},300);
	
	//财务报表业务
	//上传文件成功之后，解析上传的excel到金三报文，生成formData替换默认数据
	data_.ywbm = sbywbm;
	if (sbywbm.indexOf("CWBB") > -1){
		var ywbm = $(window.parent.frames["frmMain"].document).find("input[id='ywbm']").val();
		var swjgDm = $(window.parent.frames["frmMain"].document).find("input[id='swjgDm']").val();
		var djxh = $(window.parent.frames["frmMain"].document).find("input[id='djxh']").val();
		var sssqQ = $(window.parent.frames["frmMain"].document).find("input[id='sssqQ']").val();
		var sssqZ = $(window.parent.frames["frmMain"].document).find("input[id='sssqZ']").val();
		var gdslxDm = $(window.parent.frames["frmMain"].document).find("input[id='gdslxDm']").val();
		var nsrsbh = $(window.parent.frames["frmMain"].document).find("input[id='nsrsbh']").val();
		var test = $(window.parent.frames["frmMain"].document).find("input[id='test']").val();
		var dzbdbmList = $(window.parent.frames["frmMain"].document).find("input[id='dzbdbmList']").val();
		
		data_.swjgDm = swjgDm;
		data_.djxh = djxh;
		data_.sssqQ = sssqQ;
		data_.sssqZ = sssqZ;
		data_.gdslxDm = gdslxDm;
		data_.nsrsbh = nsrsbh;
		data_.test = test;
		data_.dzbdbmList = dzbdbmList;
		
		getExcelXml(data_);
	}else if(sbywbm.indexOf("KJGRSDSSB") > -1){
		var swjgDm = $(window.parent.frames["frmMain"].document).find("input[id='swjgDm']").val();		
		var djxh = $(window.parent.frames["frmMain"].document).find("input[id='djxh']").val();
		var sssqQ = $(window.parent.frames["frmMain"].document).find("input[id='sssqQ']").val();
		var sssqZ = $(window.parent.frames["frmMain"].document).find("input[id='sssqZ']").val();
		var gdslxDm = $(window.parent.frames["frmMain"].document).find("input[id='gdslxDm']").val();
		var nsrsbh = $(window.parent.frames["frmMain"].document).find("input[id='nsrsbh']").val();
		var nsrmc = $(window.parent.frames["frmMain"].document).find("input[id='nsrmc']").val();
		var sid = "com.foresee.dzswj.ysq.hxfw.api.IKjgrsdssbSvc";
		if(swjgDm==undefined||swjgDm==null||swjgDm=='null'){
			swjgDm=window.parent.parent.frames["frmMain"]["jsonParams"]["swjgDm"];
		}
		if(djxh==undefined||djxh==null||djxh=='null'){
			djxh=window.parent.parent.frames["frmMain"]["jsonParams"]["djxh"];
		}
		if(sssqQ==undefined||sssqQ==null||sssqQ=='null'){
			sssqQ=window.parent.parent.frames["frmMain"]["jsonParams"]["sssqQ"];
		}
		if(sssqZ==undefined||sssqZ==null||sssqZ=='null'){
			sssqZ=window.parent.parent.frames["frmMain"]["jsonParams"]["sssqZ"];
		}
		if(gdslxDm==undefined||gdslxDm==null||gdslxDm=='null'){
			gdslxDm=window.parent.parent.frames["frmMain"]["jsonParams"]["gdslxDm"];
		}
		if(nsrsbh==undefined||nsrsbh==null||nsrsbh=='null'){
			nsrsbh=window.parent.parent.frames["frmMain"]["jsonParams"]["nsrsbh"];
		}
		if(nsrmc==undefined||nsrmc==null||nsrmc=='null'){
			nsrmc=window.parent.parent.frames["frmMain"]["jsonParams"]["nsrmc"];
		}
		data_.swjgDm = swjgDm;
		data_.djxh = djxh;
		data_.sssqQ = sssqQ;
		data_.sssqZ = sssqZ;
		data_.gdslxDm = gdslxDm;
		data_.nsrsbh = nsrsbh;
		data_.sid = sid;
		data_.nsrmc = encodeURIComponent(nsrmc);
		$(window.parent.parent.frames["frmMain"].document).find("input[id='sfsc']").val('Y');
		var index = window.parent.layer.load(0,{shade: 0.3});
		getExcelDataAndTempSave(data_,index);		
	}else if(sbywbm.indexOf("QYSDS_A_ND") > -1){
		//$("body").mask("正在导入数据，请稍候...");
		var swjgDm = $(window.parent.frames["frmMain"].document).find("input[id='swjgDm']").val();
		var djxh = $(window.parent.frames["frmMain"].document).find("input[id='djxh']").val();
		var sssqQ = $(window.parent.frames["frmMain"].document).find("input[id='sssqQ']").val();
		var sssqZ = $(window.parent.frames["frmMain"].document).find("input[id='sssqZ']").val();
		var gdslxDm = $(window.parent.frames["frmMain"].document).find("input[id='gdslxDm']").val();
		var nsrsbh = $(window.parent.frames["frmMain"].document).find("input[id='nsrsbh']").val();
		var nsrmc = $(window.parent.frames["frmMain"].document).find("input[id='nsrmc']").val();
		data_.swjgDm = swjgDm;
		data_.djxh = djxh;
		data_.sssqQ = sssqQ;
		data_.sssqZ = sssqZ;
		data_.gdslxDm = gdslxDm;
		data_.nsrsbh = nsrsbh;
		data_.nsrmc = encodeURIComponent(nsrmc);
		var formData = window.parent.frames["frmMain"].window.formData;
		//将选择了哪些表的值传到参数
		if(formData!=undefined && formData!=null && formData!=""){
			var formInitStr = formData.qcs.initData.qysdsndAInitData.formInitStr;
			data_.formInitStr = formInitStr;
		}
		getExcelQysdsandXml(data_);		
		}
		}
		
/**
 * 解析导入的Excel
 */
function getExcelXml(file){
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var rtnJson = {};
	//Excel文件解析
	$.ajax({
		type: "POST",
 		url: mainUrl+"/nssb/cwbb/excelImport.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(file),
        success:function(data){
 			if (data!==undefined&&data!=null&&data!=='') {
 				rtnJson = JSON.parse(data);
 				if(rtnJson.code === "SUCCESS"){

 				replaceFormData(rtnJson.body);
 				}else{
 					window.parent.layer.alert(rtnJson.msg, {title:"提示",icon: 5});
 				}
 				
 			}
 		},
 		error:function(data){
 			window.parent.layer.alert('发生服务异常！', {title:"提示",icon: 5});
 		}
	
	});
}

/**
 * 解析导入的Excel并暂存
 */
function getExcelDataAndTempSave(file,index){
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var rtnJson = {};
	//Excel文件解析
	$.ajax({
		type: "POST",
 		url: mainUrl+"/nssb/sbImport.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(file),
 		success:function(data){		
 			if (data==="OK") {
 				//$(window.parent.parent.frames["frmMain"].document).find("input[id='sczt']").val('Y');
 				if(sbywbm.indexOf("TYDKDJSB") === -1){
 					prepareForm();
 				}
 			}
 		},
 		error:function(data){
 			var errmsg=data.responseText;
 			errmsg=errmsg.replace("未知异常","校验异常");
 			var start=errmsg.indexOf("<H2>Exception:");
 			if(start>-1){
 				var end=errmsg.indexOf("</H2>",start);
 				var ulTag=errmsg.indexOf("</ul>",start);
 				if(ulTag>-1&&end>-1){
 					errmsg=errmsg.replace(errmsg.substring(start,ulTag),errmsg.substring(start,end)); 					
 				}
 			} 			 		
 			window.parent.layer.close(index);  			 			
 			window.parent.parent.layer.alert(errmsg, {title:"提示",area: ['800px', '450px'],offset: '100px'}); 	
 		}
	});
}


/**
 * 解析导入的Excel
 */
function getExcelQysdsandXml(file){
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	var rtnJson = {};
	var formData;
	var frmMain = window.parent.frames["frmMain"];
	if(frmMain == null){
		return 0;
	}else{
		formData = window.parent.frames["frmMain"].window.formData;
	}
	
	var params = {};
	params.file = file;
	params.formData = formData;
	//Excel文件解析
	$.ajax({
		type: "POST",
 		url: mainUrl+"/nssb/qysds/excelImport.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(params),
 		success:function(data){
 			if (data!==undefined&&data!=null&&data!=='') {
 				rtnJson = JSON.parse(data);
 				if(rtnJson.code === "SUCCESS"){
 					replaceQysdsFormData(rtnJson.body);
 				}else{
 					window.parent.layer.alert(rtnJson.msg, {title:"提示",icon: 5});
 				}
 				
 			}
 		},
 		error:function(data){
 			window.parent.layer.alert('发生服务异常！', {title:"提示",icon: 5});
 		}
	});
}

/**
 * 更新页面旧的数据模型
 * @param jsonData
 */
function replaceFormData(jsonData) {
	
	var formData = jQuery.parseJSON(jsonData);
	var frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
	//注意对象之间的直接引用
	var oldCjbdxml = window.parent.frames["frmMain"].window.formData.SB100VO.SB100BdxxVO.cjbdxml;
	var newCjbdxml = formData.sB100VO.sB100BdxxVO.cjbdxml;
	var gdzcdplVO=formData.sB100VO.sB100BdxxVO.cjbdxml.gdzcdplVO;
	var copyedCjbdxml = deepcopy(oldCjbdxml,newCjbdxml);
    if(gdzcdplVO!=null){
    	window.parent.frames["frmMain"].window.formData.SB100VO.SB100BdxxVO.cjbdxml =newCjbdxml;
    }else{
    	window.parent.frames["frmMain"].window.formData.SB100VO.SB100BdxxVO.cjbdxml = copyedCjbdxml;
    }
    formData = window.parent.frames["frmMain"].window.formData;
	var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
	var viewEngine = frmSheet[0].contentWindow.viewEngine;
	var body = frmSheet[0].contentWindow.document.body;
	
	frmSheet = $(window.parent.document).find("iframe[id='frmMain']");
	var formEngine = frmSheet[0].contentWindow.formEngine;
	var formulaEngine = frmSheet[0].contentWindow.formulaEngine;
	var types = ['10','12','03','13','02'];
	formulaEngine.applyImportFormulasBytypes(types);
	viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
	var flagExecuteInitial = false;
	formulaEngine.applyImportFormulas(false);//不能重新计算，因为如果json中期初数的时候（initData），会触发公式，特别是有本年累计数的公式
	viewEngine.formApply($viewAppElement);
	viewEngine.tipsForVerify(body);
	
}

function getSbywbm(){
	if(window.parent.frames["frmMain"]!==undefined){
		sbywbm = $(window.parent.frames["frmMain"].document).find("#sbywbm").val();	
		//ywbm = $(window.parent.frames["frmMain"].document).find("input[id='ywbm']").val();
		//if(ywbm==undefined||ywbm==null||ywbm==''){
			ywbm = window.parent.frames["frmMain"]["jsonParams"]["ywbm"];
		//}
	}else if(window.parent.parent.frames["frmMain"]!==undefined){
		sbywbm = $(window.parent.parent.frames["frmMain"].document).find("#sbywbm").val();
		//ywbm = $(window.parent.parent.frames["frmMain"].document).find("input[id='ywbm']").val();
		//if(ywbm==undefined||ywbm==null||ywbm==''){
			ywbm = window.parent.parent.frames["frmMain"]["jsonParams"]["ywbm"];
		//}
	}
	if(sbywbm===undefined||sbywbm==null||sbywbm===''){
		if (ywbm!==undefined&&ywbm!==null&&ywbm!==''){
			sbywbm = ywbm.toLocaleUpperCase();
		}
	}
}

function getGdslxDm(){
	if(window.parent.frames["frmMain"]!==undefined){
		gdslxDm = window.parent.frames["frmMain"]["jsonParams"]["gdslxDm"];
	}else if(window.parent.parent.frames["frmMain"]!==undefined){
		gdslxDm = window.parent.parent.frames["frmMain"]["jsonParams"]["gdslxDm"];
	}
}

function prepareForm(){			
	var swjgDm = $(window.parent.frames["frmMain"].document).find("input[id='swjgDm']").val();
	var djxh = $(window.parent.frames["frmMain"].document).find("input[id='djxh']").val();
	var sssqQ = $(window.parent.frames["frmMain"].document).find("input[id='sssqQ']").val();
	var sssqZ = $(window.parent.frames["frmMain"].document).find("input[id='sssqZ']").val();
	var gdslxDm = $(window.parent.frames["frmMain"].document).find("input[id='gdslxDm']").val();
	var nsrsbh = $(window.parent.frames["frmMain"].document).find("input[id='nsrsbh']").val();		
	var zgswskfjDm = $(window.parent.frames["frmMain"].document).find("input[id='zgswskfjDm']").val();	
	var sfmxsb =$(window.parent.frames["frmMain"].document).find("input[id='sfmxsb']").attr("checked");
	var testModel="";	
	if(swjgDm===undefined||swjgDm==null){
		swjgDm=window.parent.parent.frames["frmMain"]["jsonParams"]["swjgDm"];
	}
	if(djxh===undefined||djxh==null){
		djxh=window.parent.parent.frames["frmMain"]["jsonParams"]["djxh"];
	}
	if(sssqQ==undefined||sssqQ==null){
		sssqQ=window.parent.parent.frames["frmMain"]["jsonParams"]["sssqQ"];
	}
	if(sssqZ==undefined||sssqZ==null){
		sssqZ=window.parent.parent.frames["frmMain"]["jsonParams"]["sssqZ"];
	}
	if(gdslxDm==undefined||gdslxDm==null){
		gdslxDm=window.parent.parent.frames["frmMain"]["jsonParams"]["gdslxDm"];
	}
	if(nsrsbh==undefined||nsrsbh==null){
		nsrsbh=window.parent.parent.frames["frmMain"]["jsonParams"]["nsrsbh"];
	}
	if(zgswskfjDm==undefined||zgswskfjDm==null){
		zgswskfjDm=swjgDm;
	}
	if(sfmxsb==undefined||sfmxsb==null){
		sfmxsb=window.parent.parent.frames["frmMain"]["jsonParams"]["sfmxsb"];
	}
	if(sfmxsb=='checked'){
		sfmxsb = true;
	}else{
		sfmxsb = false;	
	}
	if(window.parent.parent.frames["frmMain"]["jsonParams"]["test"]=="true"){
		testModel="&test=true";
	}
	parent.loadFrmMainURL("/sbzs-cjpt-web/biz/sbzs/kjgrsdssb/form?gdslxDm="+gdslxDm+"&sssqQ="+sssqQ+"&sssqZ="+sssqZ+
			"&djxh="+djxh+"&nsrsbh="+nsrsbh+"&zgswskfjDm="+zgswskfjDm+"&swjgDm="+swjgDm+"&sfmxsb="+sfmxsb+testModel);	
	// 调用父页面的函数，清空按钮区域
	parent.cleanMeunBtn();		
}



/**
 * 更新企业所得税页面旧的数据模型
 * @param jsonData
 */
function replaceQysdsFormData(jsonData) {
	
//	var zhrmghgjmqycczzndnssbYwbw = jQuery.parseJSON(jsonData);
	var rtnFormData = jQuery.parseJSON(jsonData);
	var zhrmghgjmqycczzndnssbYwbw = rtnFormData.zhrmghgjmqycczzndnssbYwbw;
	//A105080这张表需要特殊处理
	if(jsonData.indexOf("zczjtxqkjnstzmxbgridVO")>-1){
		if(zhrmghgjmqycczzndnssbYwbw!=null && zhrmghgjmqycczzndnssbYwbw.zczjtxqkjnstzmxb!=null && zhrmghgjmqycczzndnssbYwbw.zczjtxqkjnstzmxb.zczjtxqkjnstzMxbGrid!=null){
			var zczjtxqkjnstzmxbgridlb = zhrmghgjmqycczzndnssbYwbw.zczjtxqkjnstzmxb.zczjtxqkjnstzMxbGrid.zczjtxqkjnstzmxbgridVO;
			if(zczjtxqkjnstzmxbgridlb!=null && zczjtxqkjnstzmxbgridlb.length>0){
				for(i=0;i<zczjtxqkjnstzmxbgridlb.length;i++){
					var zczjtxqkjnstzmxbgridVO = zczjtxqkjnstzmxbgridlb[i];
					var nstzyy = zczjtxqkjnstzmxbgridVO.nstzyy;
					if(nstzyy!=null && nstzyy!=""){
						var nstzyyArr = nstzyy.split(",");
						if(nstzyyArr!=null && nstzyyArr.length>0){
							var nstzyy_tmp = new Array(); ;
							for(j=0;j<nstzyyArr.length;j++){
								nstzyy_tmp[j] = nstzyyArr[j];
							}
							zczjtxqkjnstzmxbgridVO.nstzyy_tmp = nstzyy_tmp;
						}else{
							zczjtxqkjnstzmxbgridVO.nstzyy_tmp = "";
						}
					}else{
						zczjtxqkjnstzmxbgridVO.nstzyy_tmp = "";
					}
					zhrmghgjmqycczzndnssbYwbw.zczjtxqkjnstzmxb.zczjtxqkjnstzMxbGrid.zczjtxqkjnstzmxbgridVO[i] = zczjtxqkjnstzmxbgridVO;
				}
			}
		}
	}
	var frmSheet = $(window.parent.frames["frmMain"].document).find("iframe[id='frmSheet']");
	//注意对象之间的直接引用
	var formData = window.parent.frames["frmMain"].window.formData;
	var a=formData.zhrmghgjmqycczzndnssbYwbw ;
	var b= zhrmghgjmqycczzndnssbYwbw;
	formData.zhrmghgjmqycczzndnssbYwbw=deepcopy(a,b);
	formData.qcs = rtnFormData.qcs;
	var $viewAppElement = frmSheet.contents().find("#viewCtrlId");
	var viewEngine = frmSheet[0].contentWindow.viewEngine;
	var body = frmSheet[0].contentWindow.document.body;
	
	var frmSheet = $(window.parent.document).find("iframe[id='frmMain']");
	var formEngine = frmSheet[0].contentWindow.formEngine;
	var formulaEngine = frmSheet[0].contentWindow.formulaEngine;
	
	viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
	var flagExecuteInitial = false;
	try{
		formulaEngine.applyImportFormulas(true);
	}catch(e){
		//viewEngine.formApply($viewAppElement);
		//$(window.parent.frames["frmMain"].document).find("#divSheetlist").find("li:eq(0)").find("a").click();
	}finally {
		// 上传excel模板数据后，刷新公式
		viewEngine.formApply($viewAppElement);
		viewEngine.tipsForVerify(body);
	}
	//$("body").mask("数据导入成功");
	//$("body").unmask();
}

//a 旧对象。b 新对象。把b对象copy到a对象上，返回。
function deepcopy(a,b) {
  var _clone = isArray(a)?[]:{};
  var i=0,
  _arg=arguments,_co='',len=_arg.length;
  if(!_arg[1]){
      _clone=this;
  }
  for(;i<len;i++){
      _co = _arg[i];
      for(var name in _co){
    	  if(!isEmpty(_clone[name]) && isEmpty(_co[name])){
    		  continue;
    	  }
          //深度拷贝
          if( typeof _co[name] === 'object'){
          	if(_clone[name] == undefined || isArray(_co[name]) != isArray(_clone[name]) || _clone[name].constructor.name !== _co[name].constructor.name )
          		_clone[name] = isArray(_co[name])?[]:{};
          	 _clone[name] = deepcopy(_clone[name],_co[name]);
          }else{
              _clone[name] = _co[name];
          }
      }
  }

  return _clone;
}

function isEmpty(_o){
	if(_o === undefined){
		return true;
	}
	if(typeof _o === "string"){
		return _o === '';
	}
	if(typeof _o === "object"){
		return JSON.stringify(_o) == "{}" || _o.length == 0; 
	}
	if(_o.constructor === Array){
		return _0.length === 0;
	}
}

function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}
