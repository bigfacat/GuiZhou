

/**
 * 初始化
 */
$(document).ready(function() {
	
	//获取局端数据按钮，企业所得税年度a与关联业务往来报告要隐藏。
	if(window.location.href.indexOf("gzsb=Y") == -1 && $("#ywbm").val().toLowerCase() != 'ybnsrzzsxbsz' &&$("#ywbm").val().toLowerCase() != 'qysdsjmandjcsz' && $("#ywbm").val().toLowerCase() != 'glywwlndbgsbjcsz'&& !$("#ywbm").val().match("CWBB")){
		$("#hqjdsj").show();
	}else{
		$("#hqjdsj").hide();
	}
	//财税管家企业所得税年度a 增加重置按钮
	if(window.location.href.indexOf("sjlybz=02")>-1&&$("#ywbm").val().toLowerCase() == 'qysdsjmandjcsz' ){
		$("#czan").show();
	}
	window.saveEvent = function () {
		if(typeof validateBeforeSubmit == "function"){
			var rtnFlag = false;
			if(!validateBeforeSubmit()){
				if ($("#ywbm").val().toLowerCase().indexOf("cwbb") > -1){
					rtnFlag = true;
					Message.errorInfo({
	    				title : "错误",
	    				message : "数据有误或空值或报送期间与属期不匹配！"
	    			});
				}else {
					return false;
				}
			}
			if (rtnFlag){
				return ;
			}
		}
		var drowMap = {};
		formData = $("#iframehtm").contents().find('#formDataSpan').html();
		var sssqQ = "";
		var sssqZ = "";
		if(formData!=null && formData!="" && $("#ywbm").val().match("CWBB")){
			var cwbbbsjcsz = jQuery.parseJSON(formData).cwbbbsjcsz;
			if(cwbbbsjcsz!=null){
				sssqQ = cwbbbsjcsz.sssqq;
				sssqZ = cwbbbsjcsz.sssqz;
			}
		}
		if(sssqQ==null || sssqQ==""){
			sssqQ = $("#sssqQ").val();
		}
		if(sssqZ==null || sssqZ==""){
			sssqZ = $("#sssqZ").val();
		}
		$("body").mask("正在保存数据，请稍候...");
		$.ajax({
			type : "POST",
	 		url : cp+"/setting/saveData.do?djxh="+$("#djxh").val()+"&ywbm="+$("#ywbm").val()+"&sssqQ="+sssqQ+"&sssqZ="+sssqZ+"&gdslxDm="+$("#gdslxDm").val()+"&test="+$("#test").val()+"&nsrsbh="+$("#nsrsbh").val()+"&swjgDm="+$("#swjgDm").val(),
	 		dataType:"json",      
	        contentType:"application/json",
	 		data:JSON.stringify(formData),
	 		success:function(data){
	 			$("body").unmask();
	 			var jsondata = jQuery.parseJSON(data);
				if("Y" == jsondata.returnFlag) {
					var msg=jsondata.warnInfo?jsondata.warnInfo.msg:"保存成功。";
					Message.succeedInfo({title : "提示", message : msg,
						handler : function() {
							 if(typeof saveDataCallback == 'function'){
			                    	saveDataCallback(data);
			                  }
						}
					});
				}else if("N" == jsondata.djxhIsSame){
					Message.errorInfo({
	    				title : "错误", message : "尊敬的纳税人：G000000表中纳税人信息与当前登录纳税人信息不一致，请点击【确定】刷新页面！",
	    				handler : function() {
	    					var url = window.location.href;
	    					if(url.indexOf("sjlybz=01")>-1){
	    						window.location.reload();
	    					}else{
	    						if(url.indexOf("sjlybz")>-1){
	    							var pre = url.substr(0,url.indexOf("sjlybz"));
	    							var andIndex = url.indexOf("&",url.indexOf("sjlybz"));
	    							var end = "";
	    							if(andIndex > -1){
	    								end = url.substr(andIndex);
	    							}else{
	    								end ="";
	    							}
	    							url = pre + "sjlybz=01"+end;
	    							window.location.href = url;
	    						}else{
	    							if(url.lastIndexOf("#")>-1){
	    								url = url.substr(0,url.length-1) + "&sjlybz=01#";
	    							}else{
	    								url = url + "&sjlybz=01";
	    							}
	    							window.location.href = url;
	    						}
	    						
	    					}
						}
	    			});
				}else{
					if(jsondata.errInfo){
						 if(jsondata.errInfo.code == "111"){
			 				Message.errorInfo({
			    				title : "错误", message : "财务会计制度准则与资料报送小类不匹配！"
			    			});
			 			} else if(jsondata.errInfo.code == "101"){
			 				Message.errorInfo({
			    				title : "错误", message : "数据有误或空值！"
			    			});
			 			} else if(jsondata.errInfo.code == "100"){
			 				Message.errorInfo({
			    				title : "错误", message : "报送期间与属期不匹配！"
			    			});
			 			} else {
			 				var msg = jsondata.errInfo.msg;
			 				Message.errorInfo({
			    				title : "错误", message : msg
			    			});
			 			}
			 			$("body").unmask();
					}else{
						Message.errorInfo({
							title : "错误", message : "保存失败，未知原因。"
						});
					}
				}
	
	 		},
	 		error:function(){
	 			$("body").unmask();
	 			Message.errorInfo({
					title : "错误", message : "保存失败，请稍侯再试。"
				});
	 		}
	 	});
	};
	
	/**提交表单,保存json对象到服务端**/
	$("#save").on("click", saveEvent);
	
	$("#hqjdsj").click(function(){
		var url = window.location.href;
		if(url.indexOf("sjlybz=01")>-1){
			window.location.reload();
		}else{
			if(url.indexOf("sjlybz")>-1){
				var pre = url.substr(0,url.indexOf("sjlybz"));
				var andIndex = url.indexOf("&",url.indexOf("sjlybz"));
				var end = "";
				if(andIndex > -1){
					end = url.substr(andIndex);
				}else{
					end ="";
				}
				url = pre + "sjlybz=01"+end;
				window.location.href = url;
			}else{
				if(url.lastIndexOf("#")>-1){
					url = url.substr(0,url.length-1) + "&sjlybz=01#";
				}else{
					url = url + "&sjlybz=01";
				}
				window.location.href = url;
			}
			
		}
	});
	
	$("#czan").click(function(){
		
		layer.confirm('&nbsp &nbsp &nbsp &nbsp尊敬的纳税人，重置后将从税局重新获取企业基础信息，如果您之前已经保存基础信息，数据可能将被覆盖。请确认是否重置？',{
			area: ['333px','200px'],
			title:'提示',
			btn : ['确定','取消'],
			btn2:function(index){
				return;
			}
		},function(index){

			 
			var url = window.location.href;
			if(url.indexOf("sjlybz=01")>-1){
				window.location.reload();
			}else{
				if(url.indexOf("sjlybz")>-1){
					var pre = url.substr(0,url.indexOf("sjlybz"));
					var andIndex = url.indexOf("&",url.indexOf("sjlybz"));
					var end = "";
					if(andIndex > -1){
						end = url.substr(andIndex);
					}else{
						end ="";
					}
					url = pre + "sjlybz=01"+end;
					window.location.href = url;
				}else{
					url = url + "&sjlybz=01";
					window.location.href = url;
				}
				
			}
		});
		
	});
	
	
	
	//进入页面后加载数据
	getInitData();
	
	var gdslxDm = $("#gdslxDm").val();
  	if(1 == gdslxDm){
    	$("#gdFlag").text("国税");
    }else{
    	$("#gdFlag").text("地税");
    }
  	var isGgUser = $("#isGgUser").val();
  	if("00"==isGgUser){
  		$("#gdFlag").text("国地");
  	}
});

function autoResizeIframe (frameId,customizedHeight,customizedWidth) {
	var frame = document.getElementById(frameId);
	if (frame != null && !window.opera) {
		/* var frameDoc = frame.document || frame.ownerDocument;
		if (frameDoc != null) {
			var width = customizedWidth || frameDoc.body.scrollWidth;
			var height = customizedHeight || frameDoc.body.scrollHeight;
			frame.height = height;
			frame.width = width;
		} */
		if (frame.contentDocument && frame.contentDocument.body.offsetHeight) { 
			frame.height = frame.contentDocument.body.offsetHeight; 
		} else if (frame.Document && frame.Document.body.scrollHeight) { 
			frame.height = frame.Document.body.scrollHeight; 
		} 
	}
}

function updateFormData() {
	formData = $("#iframehtm").contents().find('#formDataSpan').html();
	console.log(formData);
}

function cloneFormData (scope, newData) {
    formData = jQuery.extend(true, {}, newData);
    scope.$apply();
}

function getInitData(){
	$("body").mask("加载数据中，请稍候...");
	$.ajax({
		type : "POST",
		url : cp+"/setting/mainSetting.do?djxh="+$("#djxh").val()
			+"&ywbm="+$("#ywbm").val()
			+"&sssqQ="+$("#sssqQ").val()+"&sssqZ="+$("#sssqZ").val()
			+"&skssqQ="+$("#sssqQ").val()+"&skssqZ="+$("#sssqZ").val()
			+"&nsrsbh="+$("#nsrsbh").val()+"&test="+$("#test").val()
			+"&gdslxDm="+$("#gdslxDm").val()
			+"&sjlybz="+$("#sjlybz").val()+"&bzz="+$("#bzz").val()
			+"&bbbsqDm="+$("#bbbsqDm").val()+"&zlbsxlDm="+$("#zlbsxlDm").val()
			+"&kjzdzzDm="+$("#kjzdzzDm").val()+"&isycs="+$("#isycs").val()
			+"&cusId="+$("#cusId").val()
			+"&gzsb="+(top.location.search.indexOf("gzsb=Y")>-1?"Y":"N"),
		dataType:"json",      
	    contentType:"application/json",
		success:function(data){
			var jsondata = jQuery.parseJSON(data);
			if("undefined" == typeof jsondata.returnFlag || "Y" == jsondata.returnFlag) {
				if(jsondata.body != null){
					$("#save").show();
					formData = jQuery.parseJSON(jsondata.body);
					flagDataLoaded = true;
					if(jsondata.extraParam){
						formData.extraParam = jsondata.extraParam;
					}
					$("#ywmc").val(jsondata.ywmc);
					$("body").unmask();
				}else{
					$("#save").hide();
					$("body").unmask();
					var index = layer.load(2,{shade: 0.3});
					layer.alert("获取初始数据失败，失败原因：未查询到初始化数据！", {title:"提示",icon: 5});
					layer.close(index);
					autoResizeIframe("iframehtm");
				}
			}else{
				$("#save").hide();
				var msg = jsondata.errInfo.msg;
				$("body").unmask();
				var index = layer.load(2,{shade: 0.3});
				if("INFO" == jsondata.errInfo.code){
					var msgInfo = msg.substring(0,msg.indexOf("(错误码"));
					layer.alert(msgInfo, {title:"提示",icon: 5});
				}else{
					msg="获取初始数据失败，失败原因：" + msg;
					if($("#ywbm").val().toLowerCase() == 'glywwlndbgsbjcsz'&&msg.indexOf("申报属期不存在年度申报记录")!=-1){
						msg="尊敬的纳税人您好，未检测到您年度申报记录，暂不予申报。请办理企业所得税年度申报。";
					}
					layer.alert(msg, {title:"提示",icon: 5});
				}
				layer.close(index);
				autoResizeIframe("iframehtm");
			}		
			
		},
		error:function(data){
			$("body").unmask();
			$("#save").hide();
			var index = layer.load(2,{shade: 0.3});
			layer.alert(data.responseText,{area: ['650px', '400px']});
			layer.close(index);
			autoResizeIframe("iframehtm");
		}
	});

}



/**
 * 山东国税财税管家个性化需求，获取初始化数据
 * 
 * */
function getCwbbchssj(){
	$("body").mask("正在获取初始化数据.....");
	var djxh = $("#djxh").val();
	var nsrsbh = $("#nsrsbh").val();
	var sssqQ = $("#iframehtm").contents().find("#sssqqId").val();
	var sssqZ = $("#iframehtm").contents().find("#sssqzId").val();
	if(sssqQ==null || sssqQ == undefined || sssqQ=="" || sssqQ == "undefined"){
		//使用默认的税款所属期止，默认按月
		var _start = new Date();
		if(_start.getMonth() == 0){
			sssqQ = (_start.getFullYear()-1) + '-12-01';
			var _end = new Date(_start.getFullYear()+1,0,0);
			sssqZ = (_start.getFullYear()-1) + '-12-31'
		}else{
			sssqQ = _start.getFullYear() + '-' + ((_start.getMonth())<=9?'0'+(_start.getMonth()):(_start.getMonth())) + '-01';
			var _end = new Date(_start.getFullYear(),_start.getMonth(),0);
			sssqZ = _start.getFullYear() + '-' + ((_start.getMonth())<=9?'0'+(_start.getMonth()):(_start.getMonth())) + '-' + (_end.getDate());
		}
	}
	var gdslxDm = $("#gdslxDm").val();
	var pramData = {};
	pramData.djxh = djxh;
	pramData.sid = "Fxsw.SB.queryNsrCwbb.zlbsxlDm";
	pramData.gdslxDm = gdslxDm;
	pramData.nsrsbh = nsrsbh;
	pramData.sssqQ = sssqQ;
	pramData.sssqZ = sssqZ;
	pramData.rtnJson = "true";
	pramData.isNsrxx = "false";
	var formDataHtml = $("#iframehtm").contents().find('#formDataSpan').html();
	if(formDataHtml==null || formDataHtml=="" || formDataHtml=="undefined" || formDataHtml==undefined){
		$("body").unmask();
		Message.errorInfo({
			title : "错误", message : "获取初始化数据失败，请稍侯再试。"
		});
		return ;
	}
	var formData = jQuery.parseJSON(formDataHtml);
	$.ajax({
		type: "POST",
		async: false,
		url: cp+"/nssb/getSwkfptData.do"+location.search,
		dataType:"json",      
		contentType:"application/json",
		data:JSON.stringify(pramData),
		async:false,
		success:function(data){
			if (data!=""&&data!=null&&data!=undefined) {
				var jsondata = jQuery.parseJSON(data);
				if(formData!=null && formData!="" && formData.cwbbbsjcsz!=null && formData.cwbbbsjcsz!="" && jsondata!=null && jsondata.taxML!=null){
					var bsqj = jsondata.taxML.bsqj;
					if(bsqj==null || bsqj==""){
						bsqj = "04";
					}
					bsqj=bsqj=="4"?"04":bsqj;
					bsqj=bsqj=="3"?"03":bsqj;
					bsqj=bsqj=="1"?"01":bsqj;
					var sssqq = jsondata.taxML.sssqq;
					var sssqz = jsondata.taxML.sssqz;
					var zlbsxl = jsondata.taxML.zlbsxlDm;
					var kjzdzzDm = jsondata.taxML.kjzdzzDm;
					formData.cwbbbsjcsz.bsqj = bsqj;
					formData.cwbbbsjcsz.sssqq = sssqq;
					formData.cwbbbsjcsz.sssqz = sssqz;
					formData.cwbbbsjcsz.zlbsxl = zlbsxl;
					formData.cwbbbsjcsz.cwkjzdzz = kjzdzzDm;
					var dateIsTrue = cwbbCheckDate(bsqj,sssqq,sssqz);
					if(!dateIsTrue){
						//如果税款所属期起止和报送期间不对应，则根据报送期间设置默认的所属期起止
						var ssqJson = cwbbBsqjForSsq(bsqj);
						sssqq = ssqJson.sssqq;
						sssqz = ssqJson.sssqz;
						formData.cwbbbsjcsz.sssqq = ssqJson.sssqq;
						formData.cwbbbsjcsz.sssqz = ssqJson.sssqz;
					}
					
					if("01"==bsqj){
						formData.cwbbbsjcsz.nbsssqq = sssqq;
						formData.cwbbbsjcsz.nbsssqz = sssqz;
					}
					var isSave = true;//是否可以保存，当接口返回的值都不为空时，可以保存；
					if(sssqq!=null && sssqq!=""){
						$("#sssqQ").val(sssqz);
					}else{
						isSave = false;
					}
					if(sssqz!=null && sssqz!=""){
						$("#sssqZ").val(sssqz);
					}else{
						isSave = false;
					}
					if(zlbsxl!=null && zlbsxl!=""){
						$("#iframehtm").contents().find("#zlbsxlDm").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#zlbsxlDm").attr('disabled',false);
						isSave = false;
					}
					if(bsqj!=null && bsqj!=""){
						$("#iframehtm").contents().find("#bsqjId").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#bsqjId").attr('disabled',false);
						isSave = false;
					}
					if(kjzdzzDm!=null && kjzdzzDm!=""){
						$("#iframehtm").contents().find("#cwkjzdzzDm").attr('disabled',true);
					}else{
						$("#iframehtm").contents().find("#cwkjzdzzDm").attr('disabled',false);
						isSave = false;
					}
					$("#iframehtm").contents().find("#sssqqId").val(sssqq);
					$("#iframehtm").contents().find("#sssqzId").val(sssqz);
					$("#iframehtm").contents().find("#bsqjId").val(bsqj);
					$("#iframehtm").contents().find("#cwkjzdzzDm").val(kjzdzzDm);
					$("#iframehtm").contents().find("#zlbsxlDm").val(zlbsxl);
					$("#iframehtm").contents().find('#formDataSpan').html(JSON.stringify(formData));
					if(typeof updateCwbbData == 'function'){
						updateCwbbData(formData);
	                }
					if(isSave){
						//保存数据
						saveFormData(formData);
					}else{
						$("body").unmask();
					}
				}else{
					$("body").unmask();
					Message.errorInfo({
						title : "错误", message : "获取初始化数据失败，请稍侯再试。"
					});
				}
			}else{
				$("body").unmask();
				Message.errorInfo({
					title : "错误", message : "获取初始化数据失败，请稍侯再试。"
				});
			}
		},
 		error:function(data){
 			$("body").unmask();
			Message.errorInfo({
				title : "错误", message : "获取初始化数据失败，请稍侯再试。"
			});
 		}
	});
	
	
	function saveFormData(formData){
		//获取初始化数据之后保存数据
		$.ajax({
			type : "POST",
			async: false,
	 		url : cp+"/setting/saveData.do?djxh="+$("#djxh").val()+"&ywbm="+$("#ywbm").val()+"&sssqQ="+formData.cwbbbsjcsz.sssqq+"&sssqZ="+formData.cwbbbsjcsz.sssqz+"&gdslxDm="+$("#gdslxDm").val()+"&test="+$("#test").val()+"&nsrsbh="+$("#nsrsbh").val()+"&swjgDm="+$("#swjgDm").val(),
	 		dataType:"json",      
	        contentType:"application/json",
	 		data:JSON.stringify(formData),
	 		success:function(data){
	 			var jsondata = jQuery.parseJSON(data);
				if("Y" != jsondata.returnFlag) {
					if(jsondata.errInfo){
						 if(jsondata.errInfo.code == "111"){
			 				Message.errorInfo({
			    				title : "错误", message : "财务会计制度准则与资料报送小类不匹配！"
			    			});
			 			} else if(jsondata.errInfo.code == "101"){
			 				Message.errorInfo({
			    				title : "错误", message : "数据有误或空值！"
			    			});
			 			} else if(jsondata.errInfo.code == "100"){
			 				Message.errorInfo({
			    				title : "错误", message : "报送期间与属期不匹配！"
			    			});
			 			} else {
			 				var msg = jsondata.errInfo.msg;
			 				Message.errorInfo({
			    				title : "错误", message : msg
			    			});
			 			}
					}else{
						$("body").unmask();
						Message.errorInfo({
							title : "错误", message : "获取初始化数据失败，未知原因。"
						});
					}
				}
				$("body").unmask();
	 		},
	 		error:function(){
	 			$("body").unmask();
	 			Message.errorInfo({
					title : "错误", message : "获取初始化数据失败，请稍侯再试。"
				});
	 		}
	 	});
	}
}


function cwbbBsqjForSsq(bsqj){
	//计算当前时间
	var date = new Date();
	var year = date.getFullYear();//当前年
    var month = date.getMonth() + 1;//当前月
    
    var ldate = new Date(year,month-1,0);
    var lday = ldate.getDate();//当前月最后一天
    var lmonth = month - 1;
    var lyear = year - 1;
    
    var ssqJson = {};
    
    if (month==1){//一月上期是去年12月
    	year = lyear;
    	lmonth = 12;
    }
    
    if ("01"==bsqj){//年报
    	ssqJson.sssqq = lyear+"-01-01";
    	ssqJson.sssqz = lyear+"-12-31";
    } else if ("02"==bsqj){//半年报
    	if (month < 7){//去年下半年
    		ssqJson.sssqq = lyear+"-07-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else {//今年上半年
    		ssqJson.sssqq = year+"-01-01";
        	ssqJson.sssqz = year+"-06-30";
    	}
    } else if ("03"==bsqj){//季报
    	if (month >= 1 && month < 4){//去年最后一季度
    		ssqJson.sssqq = lyear+"-10-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else if (month >= 4 && month < 7){//今年第一季度
    		ssqJson.sssqq = year+"-01-01";
        	ssqJson.sssqz = year+"-03-31";
    	} else if (month >= 7 && month < 10){//今年第二季度
    		ssqJson.sssqq = year+"-04-01";
        	ssqJson.sssqz = year+"-06-30";
    	} else if (month >= 10 && month <= 12){//今年第三季度
    		ssqJson.sssqq = year+"-07-01";
        	ssqJson.sssqz = year+"-09-30";
    	}
    } else if ("04"==bsqj){//月报
    	if (month < 11 && month > 1){
    		ssqJson.sssqq = year+"-0"+lmonth+"-01";
        	ssqJson.sssqz = year+"-0"+lmonth+"-"+lday;
    	} else {
    		ssqJson.sssqq = year+"-"+lmonth+"-01";
        	ssqJson.sssqz = year+"-"+lmonth+"-"+lday;
    	}
    } else if ("11"==bsqj){//季报最后一个月
    	if (month >= 1 && month < 4){//去年最后一季度
    		ssqJson.sssqq = lyear+"-12-01";
        	ssqJson.sssqz = lyear+"-12-31";
    	} else if (month >= 4 && month < 7){//今年第一季度
    		ssqJson.sssqq = year+"-03-01";
        	ssqJson.sssqz = year+"-03-31";
    	} else if (month >= 7 && month < 10){//今年第二季度
    		ssqJson.sssqq = year+"-06-01";
        	ssqJson.sssqz = year+"-06-30";
    	} else if (month >= 10 && month <= 12){//今年第三季度
    		ssqJson.sssqq = year+"-09-01";
        	ssqJson.sssqz = year+"-09-30";
    	}
    }
	return ssqJson;
}


function cwbbCheckDate(sbqj, sssqq, sssqz){
	var flag = false;
	if (sbqj != null && sbqj.length !=0 && sssqq != null && sssqq.length !=0 && sssqz != null && sssqz.length !=0){
		var year = sssqq.split("-")[0];
		var ssqzyear = sssqz.split("-")[0];
		var startmonth = sssqq.split("-")[1];
		var endmonth = sssqz.split("-")[1];
		var sday = "01";
		var eday = "";
		var cnum = parseInt(endmonth,10)-parseInt(startmonth,10);
		
		var smallmonth = ["04","06","09","11"];
		var bigmonth = ["01","03","05","07","08","10","12"];
		for (var i = 0; i < smallmonth.length; i++){
			if (endmonth==smallmonth[i]){
				eday="30";
			}
		}
		for (var i = 0; i < bigmonth.length; i++){
			if (endmonth==bigmonth[i]){
				eday="31";
			}
		}
		if (endmonth=="02"){
			if ((parseInt(year,10)%400==0)||(parseInt(year,10)%4==0 &&parseInt(year,10)%100 != 0)){
				eday="29";
			} else {
				eday="28";
			}
		}
		if (sday==sssqq.split("-")[2] && eday==sssqz.split("-")[2]){
			//03季报，04月报，11季报最后一个月
			if ("03"==sbqj && cnum==2){
				if (("01"==startmonth && "03"==endmonth)||("04"==startmonth && "06"==endmonth)||("07"==startmonth && "09"==endmonth)||("10"==startmonth && "12"==endmonth)){
					flag = true;
				}
			}else if ("04"==sbqj && cnum==0){
				flag = true;
			}else if ("11"==sbqj && cnum==0){
				if (("03"==startmonth && "03"==endmonth)||("06"==startmonth && "06"==endmonth)||("09"==startmonth && "09"==endmonth)||("12"==startmonth && "12"==endmonth)){
					flag = true;
				}
			}else if("01"==sbqj && cnum==11){
				if(year==ssqzyear && "01"==startmonth && "12"==endmonth){
					flag = true;
				}
			}
		}

	}
	return flag;
}