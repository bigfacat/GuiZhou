
/**
 * 填报页[上一步]按钮动作
 */
function backBegin() {
	
	var backBegin = $("#backBegin").val();
			
	if(backBegin != 'null' && backBegin != null && backBegin != ''){
		backBegin = window.location.protocol +"//"+ window.location.host + backBegin; 
		window.location.href=backBegin;
	}
}

/**
 * 截取时间
 * */
function getServerTime2Day() {
	if(typeof(serverTime) != "undefined" && serverTime !=null){
		return serverTime.substring(0,serverTime.indexOf(" "));
	}else{
		return null;
	}
}
function getServerTime2Sec() {
	if(typeof(serverTime) != "undefined" && serverTime !=null){
		return serverTime;
	}else{
		return null;
	}
}

/**
 * 保存，暂存
 */
var prepareMakeFlag = true;

function tempSave() {
	//$(top.document).find("body").mask("正在保存数据，请稍候...");
	//暂存时增加校验的逻辑
	
	if(checkDIffDjxh()){//djxh不一致，不进行保存
		return;
	}
	var regEvent = new RegEvent();
	var tips = regEvent.verifyAllNoAlert();
	var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录
	
	var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['secondLoadTag'] = $("#secondLoadTag").val();
    d['_bizReq_path_'] = _bizReq_path_;
    d['_guideParam'] = _guideParam;
    d['formData'] = encodeURIComponent(JSON.stringify(formData));
	$.ajax({
		type : "POST",
		url : "xTempSave?",
		dataType : "json",
		//contentType : "text/json",
		data : d,
		success : function(data) {
			if ('Y' == data.returnFlag) {
				if('' != tips){
					parent.layer.alert(tips, {title: "暂存成功！(但表格校验没通过，请检查)", icon: 5});
				}else{
					var url1=$("frmMain").context.URL.toString();
					if(url1.indexOf("cwbb")!=-1){
						if(url1.indexOf("bzz=dzswj")!=-1){
							parent.layer.alert("暂存成功,请点击下一步完成申报！", {
								icon : 1
							});
						}else{
							parent.layer.alert("暂存成功！", {
								icon : 1
							});
						}
					}else{
						parent.layer.alert("暂存成功！", {
							icon : 1
						});
					}
				}
				
			} else {
				parent.layer.alert('尊敬的纳税人：暂存失败，请稍后再试！', {
					icon : 5
				});
			}
			$(top.document).find("body").unmask();
		},
		error : function() {
			$(top.document).find("body").unmask();
			parent.layer.alert('尊敬的纳税人：暂存失败，请稍后再试！', {
				icon : 5
			});
		}
	});
}





function prepareMakeYBNSRZZS(isSecondCall){
	var frame = window;
	

	try {
		//点击下一步，进行子窗口的特色检验
		var child = document.getElementById("frmSheet").contentWindow;
		try{
			if(typeof(child.nextstepCheck) === 'function'){
				if(!child.nextstepCheck()){ 
					prepareMakeFlag = true;
					return;
				}
			}
		}catch(e){}
	
		var tip = true;
		// isSecondCall为true时，忽略进入下一步
		if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall ===  true)) {
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}

		}
		
	} catch (ex) {
		console.log("ERROR[" + ex + "]");
		prepareMakeFlag = true;
		return;
	}
	var url = window.location.href;
	var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
	//SXGS12366-126需求
	if(swjgDm!=null && swjgDm!=undefined && swjgDm.substring(0,3)=="161" && url!=null && url!=undefined && url.indexOf("ybsb=Y") > -1){
		var proMessageForYbsb = "<div style=\"padding-left:20px;\">系统采集的仅为纳税人通过税控系统开具和接收的发票信息，对未开票收入等非发票信息和其他特殊事项数据，需要纳税人在申报表中进一步核实、完善。【确定】【取消】。点击确定则进行继续申报，点击取消则回到申报表数据填写界面。</div><br/>";
	    parent.layer.confirm(proMessageForYbsb,{
			icon : 3,
			title:'提示',
			btn : ['确认','取消'],
			btn2:function(index){
				parent.layer.close(index);
			}
		},function(index){
			parent.layer.close(index);
			prepareMakeFlag = true;
			prepareMake(isSecondCall);
		});
	}else{
		parent.layer.close(index);
		prepareMakeFlag = true;
		prepareMake(isSecondCall);
	}
}

//一般纳税人增值税点击下一步一窗式比对方法
function prepareMakeYCSBD(isSecondCall){
	var frame = window;
	

	try {
		//点击下一步，进行子窗口的特色检验
		var child = document.getElementById("frmSheet").contentWindow;
		try{
			if(typeof(child.nextstepCheck) === 'function'){
				if(!child.nextstepCheck()){ 
					prepareMakeFlag = true;
					return;
				}
			}
		}catch(e){}
	
		var tip = true;
		// isSecondCall为true时，忽略进入下一步
		if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall ===  true)) {
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}

		}
		
	} catch (ex) {
		console.log("ERROR[" + ex + "]");
		prepareMakeFlag = true;
		return;
	}
	
	$.ajax({
		type : "GET",
		url : "/sbzs-cjpt-web/nssb/ycsbd/getReture.do?djxh=" + $("#djxh").val()
			+ "&gdslxDm=" + $("#gdslxDm").val(),
		dataType : "json",
		contentType : "application/json",
		data : "json",
		success : function(data) {
			if(data == "false"){
				prepareMake(isSecondCall);
			}else if(data == "true"){
				parent.layer.confirm(
						'下一步进入一窗式比对，请确认！<br/>继续：进行一窗式比对。<br/>返回：回到填写页面。',
						{
							icon : 3,
							title : '提示',
							btn : [ '继续', '返回' ],
							btn2 :function(index) {
								parent.layer.close(index);
							}
						},function(index) {
							parent.layer.close(index);
							parent.layer.load(2,{shade: 0.3});
							$.ajax({
								type : "POST",
								url : "/sbzs-cjpt-web/nssb/ycsbd/getMessage.do?djxh=" + $("#djxh").val()
									+ "&gdslxDm=" + $("#gdslxDm").val()+ "&sssqQ=" + $("#sssqQ").val() 
									+ "&sssqZ=" + $("#sssqZ").val() + "&swjgDm=" + $("#swjgDm").val(),
								dataType : "json",
								contentType : "application/json",
								data : JSON.stringify(formData),
								success : function(data) {
									parent.layer.closeAll("loading");
									data = JSON.parse(data);
									var code = data.code;
									var ycsbdqztgbz = data.ycsbdqztgbz;
									if(code=='00'){
										var proMessage = "<div style=\"padding-left:20px;\">一窗式比对通过，请确认是否提交申报？</div><br/>";
										parent.layer.confirm(proMessage,{
											icon : 3,
											title:'提示',
											btn : ['确认','终止'],
											btn2:function(index){
												parent.layer.close(index);
											}
										},function(index){
											parent.layer.close(index);
											prepareMakeFlag = true;
											prepareMake(isSecondCall);
										});
									}else if(code == '01'){
										var message = data.result;
										var messageText = message;
										if(message!=null && message != undefined && message != ""){
											if(!typeof message == "object"){
												message = JSON.parse(message);
											}
											messageText = "<style>"
											+".ycsbdForm {padding:0 20px 0 20px}"
											+".ycsbdForm table {background-color: #b5b5b5;border-spacing: 1px;}"
											+".ycsbdForm table tr {border-style:hidden}"
											+".ycsbdForm table tr th,.ycsbdForm table tr td {background-color: #f8fcfd;padding: 1px 5px 1px 5px;}"
											+".ycsbdForm table tr td input {border:none;width:100px;height:100%}"
											+"</style>";
											messageText += "<div class=\"ycsbdForm\">";
											if(ycsbdqztgbz == 'N'){
												messageText += "<div> <b>温馨提示</b>：您的申报表一窗式比对不通过，请点击“终止”回到【填写申报表】页面，修改数据后再次提交。<br/><br/> </div>";
											}else{
												messageText += "<div> <b>温馨提示</b>：您的申报表一窗式比对不通过，是否继续申报？如果需要继续申报，请点击“继续”，如果需要调整申报表后再申报请点击“终止”。 </div>";
											}
											messageText += "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">";
											messageText += "<col width=\"60\"><col with=\"280\"><col with=\"120\"><col with=\"280\"><col with=\"120\">";
											messageText +="<tr><th>序号</th><th>抄报内容</th><th>抄报金额</th><th>申报内容</th><th>申报金额</th></tr>";
											for(var index in message){
												var item = message[index];
												var text = "";
												if(item.ewbhxh){
													text += "<td algin=\"center\">"+ item.ewbhxh +"</td>";
												}else{
													text += "<td></td>";
												}
												if(item.wbnr){
													text += "<td>"+ item.wbnr +"</td>";
												}else{
													text += "<td></td>";
												}
												if(item.wbje){
													text += "<td  aligin=\"right\"><input type=input readonly value=\""+ item.wbje +"\"/></td>";
												}else{
													text += "<td></td>";
												}
												if(item.sbnr){
													text += "<td>"+ item.sbnr +"</td>";
												}else{
													text += "<td></td>";
												}
												if(item.sbje){
													text += "<td aligin=\"right\"><input type=input readonly value=\""+ item.sbje +"\"/></td>";
												}else{
													text += "<td></td>";
												}
												if(text != ""){
													messageText += "<tr>" + text + "</tr>";
												}
											}
											
											if(ycsbdqztgbz != 'N'){
												messageText += "</table>"
													+"<input type=\"checkbox\" id=\"sfjxsb\" value=\"1\"/><label id=\"qrjxsb\" for=\"sfjxsb\">\"我确认数据无误，继续申报，并于申报后至前台清卡。\"</label>"
													+"<div>	&diams;选择“继续”按钮，纳税人需要在申报后，到办税服务大厅进行清卡解锁！</div>"
													+"<div>	&diams;选择“终止”按钮，停留填写申报表页面！</div>"
													+"</div>";
											}else{
												messageText += "</table><br/></div>";
											}
											
										}
										parent.layer.closeAll('loading');
										if(ycsbdqztgbz == 'N'){
											parent.layer.confirm(messageText,{
												area: ['900px','500px'],
												title:'提示',
												btn : ['终止'],
												btn2:function(index){
													parent.layer.close(index);
												}
											});
										}else{
											parent.layer.confirm(messageText,{
												area: ['900px','500px'],
												title:'提示',
												btn : ['继续','终止'],
												btn2:function(index){
													parent.layer.close(index);
												}
											},function(index){
												if(parent.$("#sfjxsb").is(':checked') || parent.$("#sfjxsb").prop('checked') || parent.$("#sfjxsb").attr('checked') == 'checked'){
													parent.layer.close(index);
													prepareMake(isSecondCall);
												}else{
													parent.$("#qrjxsb").css("color","red");
												}
											});
										}
									}else{
										var errMsg = data.errorMsg;
										var errStack = data.errStack;
										parent.layer.alert("调用一窗式比对发生异常，异常信息为："+errMsg);
										console.info(errMsg);
										console.info(errStack);
									}
								},error : function(XMLHttpRequest, textStatus, e){
									parent.layer.close("loading");
									//获取一窗式比对结果失败
									//"timeout", "error", "notmodified" 和 "parsererror"
									if(textStatus == 'timeout'){
										parent.layer.alert("调用一窗式比对超时，请确认您的网络状况，稍候再试！");
									}else if(textStatus == 'error'){
										parent.layer.alert("调用一窗式比对发生错误！");
									}else if(textStatus == 'parsererror'){
										//程序异常
										
									}else if(textStatus == 'notmodified'){
										//
									}
									
									}
								});
						});
			}else{
				parent.layer.alert(data);
			}
		}
		
	});
}

//消费税点击下一步一窗式比对方法
function prepareMakeXFSSBBD(isSecondCall){
	var frame = window;
	

	try {
		//点击下一步，进行子窗口的特色检验
		var child = document.getElementById("frmSheet").contentWindow;
		try{
			if(typeof(child.nextstepCheck) === 'function'){
				if(!child.nextstepCheck()){ 
					prepareMakeFlag = true;
					return;
				}
			}
		}catch(e){}
	
		var tip = true;
		// isSecondCall为true时，忽略进入下一步
		if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall ===  true)) {
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}

		}
		
	} catch (ex) {
		console.log("ERROR[" + ex + "]");
		prepareMakeFlag = true;
		return;
	}
	
	$.ajax({
		type : "GET",
		url : "/sbzs-cjpt-web/nssb/xfssbbd/getReture.do?djxh=" + $("#djxh").val()
			+ "&gdslxDm=" + $("#gdslxDm").val(),
		dataType : "json",
		contentType : "application/json",
		data : "json",
		success : function(data) {
			if(data == "N"){
				prepareMake(isSecondCall);
			}else if(data == "Y"){
				parent.layer.close(index);
				parent.layer.load(2,{shade: 0.3});
				$.ajax({
					type : "POST",
					url : "/sbzs-cjpt-web/nssb/xfssbbd/getMessage.do?djxh=" + $("#djxh").val()
						+ "&gdslxDm=" + $("#gdslxDm").val()+ "&sssqQ=" + $("#sssqQ").val() 
						+ "&sssqZ=" + $("#sssqZ").val() + "&swjgDm=" + $("#swjgDm").val() 
						+ "&nsrsbh=" + $("#nsrsbh").val(),
					dataType : "json",
					contentType : "application/json",
					data : JSON.stringify(formData),
					success : function(data) {
						parent.layer.closeAll("loading");
						data = JSON.parse(data);
						var code = data.code;
						if(code=='00'){
							prepareMake(isSecondCall);
						}else if(code == '01'){
							var bdycyy = data.bdycyy;
							var message = data.result;
							var messageText = message;
							if(message!=null && message != undefined && message != ""){
								if(!typeof message == "object"){
									message = JSON.parse(message);
								}
								messageText = "<style>"
								+".ycsbdForm {padding:0 20px 0 20px}"
								+".ycsbdForm table {background-color: #b5b5b5;border-spacing: 1px;}"
								+".ycsbdForm table tr {border-style:hidden}"
								+".ycsbdForm table tr th,.ycsbdForm table tr td {background-color: #f8fcfd;padding: 1px 5px 1px 5px;}"
								+".ycsbdForm table tr td input {border:none;width:100px;height:100%}"
								+"</style>";
								var defaultWidth = 174;
								messageText += "<div class=\"ycsbdForm\">";
								messageText += "<div style=\"color:red\"> <b>温馨提示</b>：您的申报表比对结果不通过，请点击“返回”按钮回到【填写申报表】页面，修改数据后再次提交。<br/>";
								if(bdycyy!="" && bdycyy!=null && bdycyy!=undefined){
									messageText += "<b>异常提示</b>："+ bdycyy;
									defaultWidth = 200;
								}
								messageText += "</div>";
								messageText += "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\">";
								messageText += "<col width=\"60px\"><col width=\"250px\"><col width=\"65px\"><col width=\"250px\"><col width=\"250px\">";
								messageText +="<tr><th width=\"60px\">序号</th><th width=\"250px\">比对项目名称</th><th width=\"65px\">比对结果</th><th width=\"250px\">发票列名称</th><th width=\"250px\">申报列名称</th></tr>";
								var showWidth = "";
								for(var index in message){
									var length = 0;
									var tempLength = 0;
									var item = message[index];
									var text = "";
									if(item.ewbhxh){
										text += "<td align=\"center\">"+ item.ewbhxh +"</td>";
									}else{
										text += "<td></td>";
									}
									if(item.bdxmmc){
										text += "<td align=\"left\">"+ item.bdxmmc +"</td>";
										tempLength = Math.ceil((item.bdxmmc.length/15));
										length = Math.max(tempLength,length);
									}else{
										text += "<td></td>";
									}
									if(item.bdtgbz){
										text += "<td align=\"center\" style=\"color:red;\">"+ item.bdtgbz +"</td>";
									}else{
										text += "<td></td>";
									}
									if(item.fplmc){
										text += "<td align=\"left\">"+ item.fplmc +"</td>";
										tempLength = Math.ceil((item.fplmc.length/15));
										length = Math.max(tempLength,length);
									}else{
										text += "<td></td>";
									}
									if(item.sblmc){
										text += "<td align=\"left\">"+ item.sblmc +"</td>";
										tempLength = Math.ceil((item.sblmc.length/15));
										length = Math.max(tempLength,length);
									}else{
										text += "<td></td>";
									}
									defaultWidth = defaultWidth + length*26;
									if(text != ""){
										messageText += "<tr>" + text + "</tr>";
									}
								}
								showWidth = defaultWidth>=500?500:defaultWidth;
								showWidth = showWidth + "px";
								messageText += "</table><br/></div>";
							}
							parent.layer.closeAll('loading');
							parent.layer.confirm(messageText,{
								area: ['900px',showWidth],
								title:'申报比对异常提示（成品油消费税申报）',
								btn : ['返回'],
								btn2:function(index){
									parent.layer.close(index);
								}
							});
						}else{
							var errMsg = data.errorMsg;
							var errStack = data.errStack;
							parent.layer.alert("调用比对发生异常，异常信息为："+errMsg);
							console.info(errMsg);
							console.info(errStack);
						}
					},error : function(XMLHttpRequest, textStatus, e){
						parent.layer.close("loading");
						//获取一窗式比对结果失败
						//"timeout", "error", "notmodified" 和 "parsererror"
						if(textStatus == 'timeout'){
							parent.layer.alert("调用比对超时，请确认您的网络状况，稍候再试！");
						}else if(textStatus == 'error'){
							parent.layer.alert("调用比对发生错误！");
						}else if(textStatus == 'parsererror'){
							//程序异常
							
						}else if(textStatus == 'notmodified'){
							//
						}
						
						}
					});
			}else{
				parent.layer.alert(data);
			}
		}
		
	});
}

function checkDIffDjxh() {
	var isDiff = false;
	var url = location.search; // 获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var ywbm = $("#ywbm").val().toUpperCase();
	if(ywbm.indexOf("CWBB_")!=-1){
		var urlDjxh = theRequest["djxh"];
		var temp=$("#_query_string_").val();
		var djxhindex=temp.indexOf("djxh");
		var query_stringDjxh=temp.substr(djxhindex+7,20);
		if(undefined!=urlDjxh&&urlDjxh!=""&&urlDjxh!=null&&undefined!=query_stringDjxh&&query_stringDjxh!=""&&query_stringDjxh!=null&&urlDjxh!=query_stringDjxh){
			Message.errorInfo({
				title : "错误",
				message : "登记序号不一致，请退出重新申报!"
			});
			isDiff = true;
		}
		var urlbzz = theRequest["bzz"];
		if("dzswj" == urlbzz){
			var qcsDjxh = formData.qcs.djNsrxx.djxh;
			if(undefined!=urlDjxh&&urlDjxh!=""&&urlDjxh!=null&&undefined!=query_stringDjxh&&query_stringDjxh!=null&&query_stringDjxh!="null"&&query_stringDjxh!="" && query_stringDjxh != qcsDjxh){
				Message.errorInfo({
					title : "错误",
					message : "页面中的纳税人信息与登录的纳税人信息不一致，请重置或退出后重新申报!"
				});
				isDiff = true;
			}
		}
	}
	return isDiff;
}

/**
 * 委托代征点击下一步
 * @param isSecondCall
 */
function prepareMakeWtdz(isSecondCall) {
	try {
		//点击下一步，进行子窗口的特色检验
		var child = document.getElementById("frmSheet").contentWindow;
		try{
			if(typeof(child.nextstepCheck) === 'function'){
				if(!child.nextstepCheck()){ 
					prepareMakeFlag = true;
					return;
				}
			}
		}catch(e){}
	
		var tip = true;
		// isSecondCall为true时，忽略进入下一步
		if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall ===  true)) {
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}

		}
		
	} catch (ex) {
		console.log("ERROR[" + ex + "]");
		prepareMakeFlag = true;
		return;
	}
	
	if(typeof wtdzGetDjxhsCallback === "function"){
		wtdzGetDjxhsCallback();
	} else {
		prepareMake(true);
	}
}

function pjdjValidate(zyspjdjObj, fb, jdmc){
	var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
	for(var i in zyspjdjObj){
		var zyspjdj = zyspjdjObj[i];
		if(zyspjdj[jdmc]==fb[jdmc] && zyspjdj[jdmc] != ""){
			pjdjFlag = 1;
			var pjdj_fb = parseFloat(fb['jsxse'])/parseFloat(fb['jsxsl']);
			if(parseFloat(fb['jsxsl'])==0){
				pjdj_fb = 0;
			}
			if((Math.abs(pjdj_fb-parseFloat(zyspjdj['pjdj']))/parseFloat(zyspjdj['pjdj'])).toFixed(2)>0.1){
				pjdjFlag = 0;
				break;
			}
		}
	}
	return pjdjFlag;
}

function setStyle(msg){
	 return "<p style='line-height=20px;padding:10px;margin:10xp 0px;'>"+msg+"</p>";
}

/**
 * 资源税申报
 * @param isSecondCall
 */
function prepareMakeZyssb(isSecondCall) {
	var newFB1Obj = formData.zyysbywbw.zysywbwbody.BDA0610888.yklsmsyGrid.yklsmsyGridlbVO;
	var newFB2Obj = formData.zyysbywbw.zysywbwbody.BDA0610889.jklsmsyGrid.jklsmsyGridlbVO;
	var zyspjdjObj = formData.qcs.initData.zyspjdj.zyspjdjmxxx;
	var zyspjdjObj_zs=[];//州市
	var zyspjdjObj_sdsj=[];//省地税局
	var pjdjTemp = [];//平均单价不通过校验的数据明细临时数组
	for(var i in zyspjdjObj){
		var zyspjdj = zyspjdjObj[i];
		if(zyspjdj['swjgDm'].indexOf('000000')!=-1){
			zyspjdjObj_zs.push(zyspjdj);
		}else{
			zyspjdjObj_sdsj.push(zyspjdj);
		}
	}
	for(var i in newFB1Obj){
		var fb1 = newFB1Obj[i];
		var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
		pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb1 , 'zszmDm');
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb1 , 'zspmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb1 , 'zszmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb1 , 'zspmDm');
		}
		if(pjdjFlag===0 && fb1['cjclbz']!=='N'){
			pjdjTemp.push(fb1);
		}
	}
	for(var i in newFB2Obj){
		var fb2 = newFB2Obj[i];
		var pjdjFlag = 2;//平均单价通过校验标志，0：不通过，1：通过，2：还未找到匹配的条目
		pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb2 , 'zszmDm');
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_zs, fb2 , 'zspmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb2 , 'zszmDm');
		}
		if(pjdjFlag===2){
			pjdjFlag=pjdjValidate(zyspjdjObj_sdsj, fb2 , 'zspmDm');
		}
		if(pjdjFlag===0 && fb2['cjclbz']!=='N'){
			pjdjTemp.push(fb2);
		}
	}
	var zyssbGridlbObj = formData.qcs.formContent.BDA0610887.zyssbGrid.zyssbGridlbVO;
	var zspmDm2Mc = {};
	var zszmDm2Mc = {};
	for(var i in zyssbGridlbObj){
		var zyssbGridlb = zyssbGridlbObj[i];
		var zszmDm = zyssbGridlb['zszmDm'];
		var zspmDm = zyssbGridlb['zspmDm'];
		var zszmMc = zyssbGridlb['zszmMc'];
		var zspmMc = zyssbGridlb['zspmMc'];
		if(zszmDm!=undefined && zszmDm!=''){
			zszmDm2Mc[zszmDm]=zszmMc;
		}
		if(zspmDm!=undefined && zspmDm!=''){
			zspmDm2Mc[zspmDm]=zspmMc;
		}
	}
	var pm_zm = "";
	for(var i=0;i< pjdjTemp.length;i++){
		var fb = pjdjTemp[i];
		var zspmMc = zspmDm2Mc[fb['zspmDm']];
		pm_zm+=zspmMc;
		if(fb['zszmDm']!="" && fb['zszmDm']!=undefined){
			var zszmMc = zszmDm2Mc[fb['zszmDm']];
			pm_zm+=('['+zszmMc+']');
		}
		if(i!==pjdjTemp.length-1){
			pm_zm+='、';
		}
	}
	if(pjdjTemp.length!==0){
		 parent.layer.confirm(setStyle('根据纳税人申报销售额和销售量检测，（"'+pm_zm+'"） 存在销售额与销售量不匹配或申报不实可能，请予确认。'),{
				title:'提示',
				btn : ['确认','取消']
			},function(index){
				parent.layer.close(index);
				prepareMake(isSecondCall);
			},function(index){
				parent.layer.close(index);
			});
	}else{
		prepareMake(isSecondCall);
	}
}

/**
 * 契税申报
 * @param isSecondCall
 */
function beforeSubmitFormQssb() {
	//契税的初始化减免性质码表太大，必须过滤掉一些没用到的节点
	var zspmDm = formData.sb030QssbVO.zspmDm;
	var jmlxDm = formData.sb030QssbVO.jmlxDm;
	if(jmlxDm==''){
		formData.qcs.initData.jmxxlist.option=[];
		formData.sb030QssbVO.jmxzMc='';
		return;
	}
	var optionList = formData.qcs.initData.jmxxlist.option;
	var optionListTemp = [];
	for(var index in optionList){
		var option = optionList[index];
		var pc = option['pc'];
		var dm = option['dm'];
		if(pc===zspmDm && dm===jmlxDm){
			optionListTemp.push(option);
		}
	}
	formData.sb030QssbVO.jmxzMc=optionListTemp[0]['mc'];
	formData.qcs.initData.jmxxlist.option=optionListTemp;
}

/**
 * 申报[下一步]按钮动作
 * isSecondCall:true:为true时，忽略进入下一步;
 * sb:表示走福建签章流程的时候直接进入回执页，不需要弹框展示PDF
 */
function prepareMake(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	
	//判断是否为企业税务人员登陆，如果是则使得点击下一步按钮失效
	if("undefined" !== typeof otherParams && "undefined" !== typeof otherParams.LoginType && otherParams.LoginType === 'LOGIN_TYPE_SWRY'){
		parent.layer.alert('尊敬的纳税人，您是以企业身份登陆，不能进行下一步申报操作！', {title:"提示",icon: 5});
		return;
	}
	if(checkDIffDjxh()){//djxh不一致，不进行保存
		return;
	}
	
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			// isSecondCall为true时，忽略进入下一步
			if(!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
				var regEvent = new RegEvent();
				tip = regEvent.verifyAllComfirm(prepareMake);
				if (!tip) {
					// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
					$("body").unmask();
					prepareMakeFlag = true;
					return;
				}
			}
			// TODO 大连/贵州要求-点击下一步提示未上传附送资料
			var fszlFrame = window.parent.frames["fszlFrame"].document || window.parent.frames[1].document;
			var sybbfs = $("#sybbfs", fszlFrame).val();
			if (sybbfs>0) {
				if(parent.formstyle==='form1'){
					parent.layer.alert("请上传必报的附送资料！", {title: "提示", icon: 5});
				}else{
					parent.layer.alert("请点击\"附送资料\"上传相关文件！", {title: "提示", icon: 5});
				}
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
			if (tip) {
				var sbywbm = $("#ywbm").val().toUpperCase();
				// 委托代征申报 在点击申报的时候把明细表中的数据汇总的主表
				if (sbywbm === "WTDZSB") {
					var s = wtdzcCollect();
					if (s == false) {
						$("body").unmask();
						prepareMakeFlag = true;
						return;
					}
				}
				
				//企业所得税税种申报时，对未附报财务会计报表的企业进行提醒。
               if(sbywbm === "QYSDS_A"){
            	 //是否是千户企业标志
            		var sfqhqy = formData.qcs.initData.qysds2015JmJdAsbInitData.sfqhqy;
            	   	if (sfqhqy == "Y") {
            	   		var sfjx=confirm("该纳税人未报送本属期的财务会计报表，请按期报送。逾期未报送的按《税收征收管理法》有关规定进行处理。继续申报请确定，否则请取消 ")
						if(!sfjx){
							$("body").unmask();
							prepareMakeFlag = true;
							return;
						}
            	   		
					}
               }
               if(sbywbm === "TYSB"){
              		var sftjbz = submitValid();
              	   	if (sftjbz ==false) {
              	   		layer.alert("请选择需要申报的项目！", {icon: 2});  						
  						$("body").unmask();
  						prepareMakeFlag = true;
  						return;
  					}
                 }
               ////GDSDZSWJ-6221：环保税B表，简易申报，关闭零申报操作
               if (sbywbm === "HBS_B") {
            		var wrdlshj = formData.ywbw.sbskxxGrid.wrdlshj;
            		var sblx=formData.ywbw.hbssbForm.sblx;
            		var swjgDm=(formData.qcs.initData.kzxx.nsrjbxx.swjgDm).substring(0,3);
            		if (wrdlshj == 0&&sblx=="02"&&swjgDm=="244"){
            			parent.layer.alert('尊敬的纳税人，您[污染当量数或计税依据]为【0.00】，为确保你填写的数据准确性，请重新核实申报表单数据填写。', {title:"提示",icon: 5});
            			$("body").unmask();
  						prepareMakeFlag = true;
  						return;
            		}
				}
			}
			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			if($("#ywbm").val().toUpperCase()=='QSSB'){
				beforeSubmitFormQssb();
			}
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));

		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		var ywbm = $("#ywbm").val().toUpperCase();
		if(ywbm=="QYSDS_A" || ywbm=="YBNSRZZS" || ywbm.indexOf("CWBB_")==0){
			var swjgDm= "";
			var url = window.location.href;
			if(ywbm.indexOf("CWBB_")==0){
				swjgDm = formData.qcs.djNsrxx.zgswjdm;//财务报表的报文结构和其他申报表的结构不一样
			}else{
				swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
			}
			if(swjgDm.substring(0,3)=="137" && url.indexOf("bzz=csgj") > -1){
			    var proMessage = "<div style=\"padding-left:20px;\">请确认是否提交申报？</div><br/>";
			    parent.layer.confirm(proMessage,{
					icon : 3,
					title:'提示',
					btn : ['确认','取消'],
					btn2:function(index){
						parent.layer.close(index);
						$("body").unmask();
						prepareMakeFlag = true;
						return;
					}
				},function(index){
					parent.layer.close(index);
					
					submitForm(isSecondCall);// 提交表单
				});
			}else{
				if(ywbm=="QYSDS_A"){
					var sfsyxxwlqy= formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy;
            	   	var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
            	   var xwzg=formData.qcs.initData.qysds2015JmJdAsbInitData.xxwlzg;
            	  var sjlreLj=  formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sjlreLj;
            	  var byjynssdeLj=  formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.byjynssdeLj;
            	  var yjfs= formData.qcs.initData.qysds2015JmJdAsbInitData.yjfs;
            	   	
            	   	if(yjfs!="3"&&sjlreLj<=500000&&byjynssdeLj<=500000&&sfsyxxwlqy=="N"&&swjgDm.substring(1,3)=="63"&&(xwzg=="0"||xwzg=="3"||xwzg=="4"||xwzg=="6")){
            	   	  var proMessage1 = "<div style=\"padding-left:20px;\">请确认今年预计是否达到享受小微企业税收标准？</div><br/>";
            	   		
            	   	parent.layer.confirm(proMessage1,{
    					icon : 3,
    					title:'提示',
    					btn : ['确认','取消'],
    					btn2:function(index){
    						parent.layer.close(index);
        					 submitForm(isSecondCall);// 提交表单
    						
    					}
    				},function(index){
    					formData.qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy="Y"; 
    					var _jpath="qysdsczzsyjdSbbdxxVO.qysdsyjdyjnssbbal.qysdsyjdyjnssbbalFrom.sfsyxxwlqy";
						var jbzsLj=	"qysdsczzsyjdSbbdxxVO.jmsdsemxbbw.jmsdsemxbFbThree.jbzsLj"
						 formulaEngine.apply(_jpath,jbzsLj);  
						var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
						var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
						var body = $("#frmSheet")[0].contentWindow.document.body;
					  // 3、刷新校验结果和控制结果
						viewEngine.formApply($viewAppElement);
						viewEngine.tipsForVerify(body);
						
    					parent.layer.close(index);
						$("body").unmask();
						prepareMakeFlag = true;
						return;
    				});
            	   	}else{ submitForm(isSecondCall);}// 提交表单
					
				}else{
					submitForm(isSecondCall);// 提交表单
				}
							
			}
		}else{
			submitForm(isSecondCall);// 提交表单
		}
	}
}


function prepareMakeshow(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	var saveData = JSON.stringify(formData);
	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
	var submitData = JSON.stringify(formData);
	if (saveData == submitData) {
		submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
	}
	$("#saveData1").val(encodeURIComponent(saveData));
	$("#submitData1").val(encodeURIComponent(submitData));
	var d = {};
    var t = $('#myform').serializeArray();
    $.each(t, function() {
    	d[this.name ] = this.value;
    });
    d['saveData1'] = encodeURIComponent(saveData);
    d['submitData1'] = encodeURIComponent(submitData);
	$.ajax({
		type : "POST",
		async:false,
		url :  location.protocol + "//" + location.host + window.contextPath+"/save/saveYsqbw.do",
		data:d,
		dataType : "json",
		success : function() {
			
		},
		error : function() {
			
		}
	});
	
	var zlpzWebContextPath = $("#zlpzWebContextPath").val();
	if(zlpzWebContextPath ==null || typeof zlpzWebContextPath == 'undefined'){
		zlpzWebContextPath = "/zlpz-cjpt-web";
	}
	
	url = zlpzWebContextPath+"/zlpz/openPdfshow.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val();
	//window.location.href = url;
	//var url = location.protocol + "//" + location.host+"/zlpz-cjpt-web/zlpz/openPdfshow.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val()+"&showBtnIDs="+showBtnIDs;
	parent.window.open(url);
}

/**
 * 仅用于主干查看静态pdf按钮
 *
 * @param isSecondCall
 */
function prepareMakeSteamKey() {
    // TODO 置标志位 调用父页面的方法按钮 失效，
    // 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
    var saveData = JSON.stringify(formData);
    formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
    var submitData = JSON.stringify(formData);
    if (saveData == submitData) {
        submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
    }
    $("#saveData1").val(encodeURIComponent(saveData));
    $("#submitData1").val(encodeURIComponent(submitData));
    var d = {};
    var t = $('#myform').serializeArray();
    $.each(t, function() {
        d[this.name ] = this.value;
    });
    d['saveData1'] = encodeURIComponent(saveData);
    d['submitData1'] = encodeURIComponent(submitData);
    $.ajax({
        type : "POST",
        async:false,
        url :  location.protocol + "//" + location.host + window.contextPath+"/save/saveYsqbw.do",
        data:d,
        dataType : "json",
        success : function() {

        },
        error : function() {

        }
    });
    var zlpzWebContextPath = $("#zlpzWebContextPath").val();
    if(zlpzWebContextPath ==null || typeof zlpzWebContextPath == 'undefined'){
        zlpzWebContextPath = "/zlpz-cjpt-web";
    }
    //var queryString =  $("#zlpzWebContextPath").val();

    var url = zlpzWebContextPath+"/zlpzxfa/DownPdfSignBySteamKey.do?_query_string_="+encodeURIComponent($("#_query_string_").val())+"&_bizReq_path_="+$("#_bizReq_path_").val()+"&ysqxxid="+$("#ysqxxid").val();
    //var url =  zlpzWebContextPath+"/zlpzxfa/DownPdfSignBySteamKey.do?_query_string_="++"&ysqxxid=<%=ysqxxid%>&ywbm=<%=ywbm%>&_bizReq_path_="+_bizReq_path_;
    window.open(url);
}

/**
 * 申报[下一步]按钮动作
 */
//function otherValidate() {
//	
//	var flag = false;
//
//	var saveData = JSON.stringify(formData);
//	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
//	var submitData = JSON.stringify(formData);
//	if (saveData == submitData) {
//		submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
//	}
//	$("#saveData1").val(encodeURIComponent(saveData));
//	$("#submitData1").val(encodeURIComponent(submitData));
//
//	var dataPara = $("#myform").serializeObject();   
//    
//    $.ajax({
//		type : "POST",
//		async:false,
//		url : location.protocol + "//" + location.host + window.contextPath
//				+ "/otherValidate/validate.do?_query_string_=" + $("#_query_string_").val()
//				+ "&gdslxDm=" + $("#gdslxDm").val()
//				+ "&ysqxxid=" + $("#ysqxxid").val() 
//				+ "&_bizReq_path_=" + _bizReq_path_,
//		dataType : "json",
//		contentType : "text/json",
//		data : encodeURIComponent(JSON.stringify(dataPara)),
//		success : function(data) {
//			if ('Y' == data.returnFlag) {
//				flag = true;
//			} else {
//				parent.layer.alert(tips, {title: "校验失败", icon: 5});
//			}
//		},
//		error : function() {
//			parent.layer.alert('校验失败.', {
//				icon : 5
//			});
//		}
//	});
//
//    return flag;
//}

/**
 * 校验按钮注册
 */
function verifyMake() {
	var Variable = regEvent.verifyAll();
	if (Variable == true) {
		parent.layer.alert("校验通过，可申报。", {
			icon : 1
		});
	} else {
		// parent.layer.alert("校验失败，请检查。", {icon: 5});
		return false;
	}
}



/**
 * 打印按钮
 */
function printForm() {
	window.frames["frmSheet"].window.focus();
	window.frames["frmSheet"].window.print();
}

/**
 * 关闭按钮注册
 */
function closeForm() {
	var frame = window;
	parent.layer.confirm("确定关闭？", {
		icon : 2,
		title : '提示'
	}, function(index) {
		if (navigator.userAgent.indexOf("MSIE") > 0) {
			if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
				frame.opener = null;
				frame.close();
			} else {
				frame.open('', '_top');
				frame.top.close();
			}
		} else if (navigator.userAgent.indexOf("Firefox") > 0) {
			frame.location.href = 'about:blank ';
			frame.close();
		} else if (navigator.userAgent.indexOf("Chrome") > 0) {
			/*window.location.href = 'about:blank ';
			window.close();*/
			top.open(location, '_self').close();
		} else {
			frame.open('', '_top');
			frame.top.close();
		}
		parent.layer.close(index);
	});
}

/**
 * 一般纳税人 期初数链接
 */
function linkQcssz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsqcs.aspx";
	}
	if (sbywbm == "QYSDS_A") {
		ywbm = "qysdsjmaqcssz";
	}
	var url = location.protocol + "//" + location.host + window.contextPath
			+ "/biz/setting/" + ywbm + "?bzz=csgj&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val();
	// 不集成session的url，需要加些其他参数
	if (oldurl.indexOf("test=true") > -1) {
		url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
				+ "&test=true";
	}
	window.open(url);
}

/**
 * 一般纳税人 基础设置链接
 */
function linkJcsz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsjcsz";
	}
	if (sbywbm == "QYSDS_A" || sbywbm == "QYSDS_B" || sbywbm == "FJM_QYSDS_A"
			|| sbywbm == "FJM_QYSDS_B") {
		ywbm = "qysdsjcsz";
	}
	if (sbywbm.match("CWBB")) {
		if(oldurl.indexOf("isycs=1")!=-1){
			ywbm = "cwbbycsjcsz";
		}else if(oldurl.indexOf("bzz=csgj")!=-1){
			ywbm = "cwbbjcsz";
		}else if(oldurl.indexOf("bzz=dzswj")!=-1){
			ywbm = "cwbbydy";
		}else{
			ywbm = "cwbbydy";
		}
		var urlArg = window.location.search;
		var cwbburl = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + urlArg;
		if(cwbburl.indexOf("fromsbb=true")==-1){
			cwbburl = cwbburl + "&fromsbb=true";
		}
		parent.window.open(cwbburl, "_self");
	}else{
		var url = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + "?gdslxDm="
		+ $("#gdslxDm").val();
		// 不集成session的url，需要加些其他参数
		if (oldurl.indexOf("test=true") > -1) {
			url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
					+ "&test=true"+ "&sssqQ=" + $("#sssqQ").val() 
					+ "&sssqZ=" + $("#sssqZ").val();
		}
		window.open(url);
	}
	

}

/**
 * 重置按钮
 */
function resetForm() {
	var frame = window;
	parent.layer.confirm("重置申报表将覆盖您申报表中已填写的相关数值，并重新生成申报表，请确认是否继续？", {
		icon : 3,
		title : '提示'
	}, function(index) {
		var url = frame.location.href;
		if (url.indexOf("reset=Y") == -1) {
			if(url.indexOf("?")>-1){
				url = url + "&reset=Y";
			}else{
				var action = $("#myform").attr("action");
				action = action.replace("make","begin");
				$("#myform").attr("action",action);
				$("#_query_string_").val("");
				$("#reset").val("Y");
				$("#toForm").val("true");
				$("#myform").submit();
				parent.layer.close(index);
				return;
			}
			
		}
		// 清空按钮工具条
		$(".areaHeadBtn", frame.parent.document).empty();
		frame.location.href = url;
		parent.layer.close(index);
	});
	
}

/**
 * 重置按钮，没有提示就重置
 * 
 * */
function resetForm2(){
	var frame = window;
	var url = frame.location.href;
	if (url.indexOf("reset=Y") == -1) {
		url = url + "&reset=Y";
	}
	// 清空按钮工具条
	$(".areaHeadBtn", frame.parent.document).empty();
	frame.location.href = url;
}

/**
 * 导入按钮（仅提供测试使用）
 */
function import01() {
	var jsonXml = window.prompt("导入的json报文内容", "");
	$("body").mask("正在保存数据，请稍候...");
	$.ajax({
		type : "POST",
		url : "saveData.do?djxh=" + $("#djxh").val() 
			+ "&sbywbm=" + $("#ywbm").val() 
			+ "&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val() 
			+ "&bz=" + $("#bzz").attr("value"),
		dataType : "json",
		contentType : "application/json",
		data : jsonXml,
		success : function(data) {
			if ('000' == data.code) {
				window.location.reload();
			} else {
				parent.layer.alert('保存失败.', {
					icon : 5
				});
			}
			$("body").unmask();
		},
		error : function() {
			$("body").unmask();
			parent.layer.alert('保存失败.', {
				icon : 5
			});
		}
	});
}

/**
 * 导出按钮（仅提供测试使用）
 */
function export01() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	/*
	 * if(!tip){ parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2}); $("body").unmask();
	 * return ; }
	 */
	$("body").unmask();
	var jsonXml = JSON.stringify(formData);
	layer.open({
		title : '导出的json报文',
		shadeClose : true,
		shade : 0.4,
		area : [ '500px', '600px' ],
		content : jsonXml
	});
}

/**
 * 自动化测试导出按钮（仅提供测试使用）
 */
function autoTestJson(sceneName) {
	var jsonXml = JSON.stringify(formData);
	var tempData = {};
	tempData.sceneName = sceneName;
	tempData.jsonData = jsonXml;
	var url = "http://10.10.0.161:8088/autoTest/jsp/exportedJson/exportedJson.jsp";
	layer.open({
		type : 2,
		title : '导出的json报文到自动化测试',
		shadeClose : true,
		shade : 0.4,
		skin: 'CLYM-style',
		area : [ '600px', '380px' ],
		content : url,
		success: function (layero, index) {
			layero.find("iframe")[0].contentWindow.postMessage(JSON.stringify(tempData),url);
		}
	});
	
//	window.frames[0].postMessage(jsonXml,'http://10.10.11.220:8080/autoTest/jsp/exportedJson/exportedJson.jsp');
	
}

/**
 * 自动化测试按钮（仅提供测试使用）
 */
function autoTestBtn() {
	
	var jsonXml = JSON.stringify(formData);
	var parameJson = {};
	parameJson.djxh = $("#djxh").val();
	parameJson.nsrsbh = $("#nsrsbh").val();
	parameJson.gdslxDm = $("#gdslxDm").val();
	parameJson.ywbm = $("#ywbm").val();
	parameJson.test = $("#test").val();
	parameJson.nsqx = "06";
	
	var paramArr =window.location.search.substring(1).split("&");
	for (var i = 0; i < paramArr.length; i++){
		if (paramArr[i].match("nsqx_dm")){
			parameJson.nsqx = paramArr[i].split("=")[1];
		}
	}
	
//	var url = "http://10.10.11.220:8080/autoTest/jsp/exportedJson/integrationSbJson.jsp";//本机联调
	var url = "http://10.10.0.161:8088/autoTest/jsp/exportedJson/integrationSbJson.jsp";//测试环境地址
	
	$.ajax({
		type: "POST",
 		url: window.contextPath+"/nssb/auto/autoGetNsrxx.do",
 		dataType:"json",      
        contentType:"application/json",
        data:JSON.stringify(parameJson),
        async:true,
 		success:function(data){
 			if (!$.isEmptyObject(data)){
 				var tempData = eval('('+data+')');
 				tempData.json = eval('('+jsonXml+')');
 				layer.open({
 	 				type : 2,
 	 				title : '自动化测试',
 	 				shadeClose : true,
 	 				shade : 0.4,
 	 				skin: 'CLYM-style',
 	 				area : [ '1200px', '550px' ],
 	 				content : url,
 	 				success: function (layero, index) {
 	 					layero.find("iframe")[0].contentWindow.postMessage(JSON.stringify(tempData),url);
 	 				}
 	 			});
 			}
 			
 		}
	});
	
	
//	window.frames[0].postMessage(jsonXml,'http://10.10.11.220:8080/autoTest/jsp/exportedJson/exportedJson.jsp');
	
}

/**
 * 导出报盘 XML
 */
function exportXML() {
	//$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	/*
	 * if(!tip){ parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2}); $("body").unmask();
	 * return ; }
	 */
	$("body").unmask();

	var saveData = JSON.stringify(formData); // 保存的报文。用于表单还原
	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
	var submitData = JSON.stringify(formData); // 需要提交的报文，用来导出的报文

	// 如果保存的报文与提交报文一致，则把保存报文置空，减少网络传输
	if (saveData == submitData) {
		saveData = "";
	}
	$("body").unmask();

	parent.layer.alert("正在导出磁盘，需要再次导出，可进入此页面操作！", {
		icon : 1
	});
	//$("body").mask("正在导出到磁盘，请稍候...");
	if(submitData.charAt("1") === '"'){//当json文本类似于{"jmxxGrid":{"jmxxGridlb":......时
		//将引号内部的单引号替换为双引号。
		submitData = submitData.replace(/'/g,'\\"');
	}else if (submitData.charAt("1") === "'"){//当json文本类似于{'jmxxGrid':{'jmxxGridlb':......时
		//do nothing. 暂时未发现会出现此类情况。
	}
	// 由于ajxax返回不能是二进制流形式，通过form表单来请求。
	var form = $("<form>"); // 定义一个form表单
	form.attr("style", "display:none");
	form.attr("target", "");
	form.attr("method", "post");
	form.attr("action", pathRoot + "/biz/" + _bizReq_path_
			+ "/xExportXML?_query_string_=" + encodeURIComponent($("#_query_string_").val())
			+ "&ysqxxid=" + $("#ysqxxid").val()
			+ "&gdslxDm=" + $("#gdslxDm").val()
			+ "&_bizReq_path_=" + _bizReq_path_
			+ "&dzbdbmList=" + $("#dzbdbmList").val());
	var formHtml = "<input  type='hidden' name='saveData' value='"
			+ encodeURIComponent(saveData)
			+ "'><input  type='hidden' name='submitData' value='"
			+ encodeURIComponent(submitData) + "'>";

	// 增加非单点登陆模式
	var url = window.location.href;
	if (url.indexOf("test=true") > -1) {
		formHtml += "<input  type='hidden' name='test' value='true'>";
	}

	$("body").append(form);// 将表单放置在web中
	form.append(formHtml);
	form.submit();// 表单提交
	form.remove();
	$("body").unmask();
	
	if(window.location.search.indexOf("gzsb=Y")==-1 && window.location.search.indexOf("gzsb=zx")==-1){
		//点击导出报盘屏蔽其他按钮
		$(".areaHeadBtn li a", window.parent.document).each(function(){
			var _$this = $(this);
			if(_$this.attr("id") != "btnExportXML"){
				$(this).hide();
			}
		});
	}
	
}
/**
 * 只导出报盘 XML，不改变任何业务状态
 */
function exportXMLOnly() {

	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	/*
	 * if(!tip){ parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2}); $("body").unmask();
	 * return ; }
	 */
	$("body").unmask();

	var saveData = JSON.stringify(formData); // 保存的报文。用于表单还原
	formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
	var submitData = JSON.stringify(formData); // 需要提交的报文，用来导出的报文

	// 如果保存的报文与提交报文一致，则把保存报文置空，减少网络传输
	if (saveData == submitData) {
		saveData = "";
	}
	$("body").unmask();

	parent.layer.alert("正在导出到磁盘，请稍候通过其他途径可以再次导出", {
		icon : 1
	});
	$("body").mask("正在导出到磁盘，请稍候...");
	if(submitData.charAt("1") === '"'){//当json文本类似于{"jmxxGrid":{"jmxxGridlb":......时
		//将引号内部的单引号替换为双引号。
		submitData = submitData.replace(/'/g,'\\"');
	}else if (submitData.charAt("1") === "'"){//当json文本类似于{'jmxxGrid':{'jmxxGridlb':......时
		//do nothing. 暂时未发现会出现此类情况。
	}
	
	// 由于ajxax返回不能是二进制流形式，通过form表单来请求。
	var form = $("<form>"); // 定义一个form表单
	form.attr("style", "display:none");
	form.attr("target", "");
	form.attr("method", "post");
	form.attr("action", pathRoot + "/biz/" + _bizReq_path_
			+ "/xExportXML?_query_string_=" + encodeURIComponent($("#_query_string_").val())
			+ "&ysqxxid=" + $("#ysqxxid").val()
			+ "&gdslxDm=" + $("#gdslxDm").val()
			+ "&_bizReq_path_=" + _bizReq_path_
			+ "&dzbdbmList=" + $("#dzbdbmList").val() + "&isOnlyExpo=true");
	var formHtml = "<input  type='hidden' name='saveData' value='"
			+ encodeURIComponent(saveData)
			+ "'><input  type='hidden' name='submitData' value='"
			+ encodeURIComponent(submitData) + "'>";

	// 增加非单点登陆模式
	var url = window.location.href;
	if (url.indexOf("test=true") > -1) {
		formHtml += "<input  type='hidden' name='test' value='true'>";
	}

	$("body").append(form);// 将表单放置在web中
	form.append(formHtml);
	form.submit();// 表单提交
	form.remove();
	$("body").unmask();
}
/**
 * 查询附送资料份数
 */
/*
 * $(function(){
 * 
 * var swsxDm=$("#swsxDm").val(); var squuid=$("#ysqxxid").val(); var
 * swjgDm=$("#swjgDm").val(); var $fszlFrame =
 * $(window.parent.document).find("#fszlFrame");
 * $fszlFrame.attr("src","/zlpz-cjpt-web/attachment/getDzbdFlzlList.do?swsx_dm="+swsxDm+"&squuid="+squuid+"&swjgDm="+swjgDm)
 * 
 * $.ajax({ type : "POST", url :
 * "/zlpz-cjpt-web/attachment/queryFszlfs.do?swsx_dm="+swsxDm, success:function(data){
 * var json = eval('(' + data + ')'); var flzlsldiv='<div class="temp01"
 * style="">'+json.fs+'</div>'; var $btnScfszl =
 * $(window.parent.document).find("#btnScfszl");
 * $btnScfszl.append($(flzlsldiv)); }, error:function(){ $("body").unmask();
 * parent.layer.alert('查询附送资料份数失败', {icon: 5}); } }); var $winclose =
 * $(window.parent.document).find(".winclose"); $winclose.click(function(){ var
 * $winbox_bg=$(window.parent.document).find(".winbox_bg") $winbox_bg.remove()
 * $winclose.parents("#myModa1").animate({top:"-200px",opacity:"0"},300).fadeOut();
 *  })
 * 
 * });
 */
var index = 201
// 只提示1次是否使用复用资料
var FyzlFlag = false;
function scFszl() {
	// 当二次动态加载标识不一致时，更新附送资料
	if (typeof flzlDeliver == 'function') {
		var json = flzlDeliver();
		var tag = $("#secondLoadTag").val();
		if (json.params!=tag) {
			updateFszl();
		}
	}
	var $myModa1 = $(window.parent.document).find("#myModa1");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);
	// GEARS-6327 附列资料复用，调用zlpz/attachment.js的方法，
	if(typeof parent.frames[1].findFyzl === 'function'){
		parent.frames[1].findFyzl();
	}
}

function updateFszl() {
	var msg;
	if (typeof flzlDeliver == 'function') {
		var json = flzlDeliver();
		if (json.flag === "Y" && (json.params != undefined && json.params != "")) {
			msg = json.params;
		} else if (json.flag === "" && json.params === "") {
			msg = "";
		} else if (json.flag === "N") {
			layer.alert(json.msg);
			return;
		}
	} else {
		return;
	}
	var ysqxxid = $("#ysqxxid").val();
	var swsxDm = $("#swsxDm").val();
	var lcswsxDm = $("#lcswsxDm").val();
	var gdslxDm = $("#gdslxDm").val();
	var nsrsbh = $("#nsrsbh").val();
	var djxh = $("#djxh").val();
	var test = $("#test").val();
	var ywbm = $("#ywbm").val();
	$("#secondLoadTag").val(msg);
	var param = "ysqxxid=" + ysqxxid + "&swsxDm=" + swsxDm + "&lcswsxDm="
			+ lcswsxDm + "&gdslxDm=" + gdslxDm + "&nsrsbh=" + nsrsbh + "&djxh="
			+ djxh + "&secondLoadTag=" + msg + "&ywbm=" + ywbm + "&test="
			+ test;
	var zlpzWebContextPath = $("#zlpzWebContextPath").val();
	if (zlpzWebContextPath == null || typeof zlpzWebContextPath == 'undefined') {
		zlpzWebContextPath = "/zlpz-cjpt-web";
	}
	// 根据yhlx是否等于0判断是否为登录前业务
	var path = window.location.search;
	var queryFszlfsUrl = "";
	if (path.indexOf("yhlx=0") < 0) {
		$("#fszlFrame", window.parent.document).attr("src", zlpzWebContextPath+"/attachment/getDzbdFlzlList.do?"+param);
		queryFszlfsUrl = zlpzWebContextPath + "/attachment/queryFszlfs.do?" + param;
		// updateBbfs(param);
	} else {
		$("#fszlFrame", window.parent.document).attr("src", zlpzWebContextPath+"/attachmentnosso/getDzbdFlzlList.do?"+param+"&yhlx=0");
		queryFszlfsUrl = zlpzWebContextPath + "/attachmentnosso/queryFszlfs.do?" + param + "&yhlx=0";
	}
	// 更新附送资料列表右上角的红标
	$("#fszlFrame", window.parent.document).one("load",function(){
        //加载完成，需要执行的代码
		updateBbfs(queryFszlfsUrl);
    });
}

// 动态加载完附送资料后需更新必报份数并更新下一步按钮
function updateBbfs (queryFszlfsUrl) {
	$.ajax({
		type : "POST",
		url : queryFszlfsUrl,
		success : function(data) {
			// 保存必报份数
			parent.sybbfs1 = data.blfs;
			// 保存条件报送份数
			parent.sytjbbfs1 = data.tjblfs;
			var jybz = data.jybz;
			// 根据返回的资料份数（必传、非必传）,在附送资料按钮中显示对应的数目和颜色
			var fszlFrame = window.parent.frames["fszlFrame"].document || window.parent.frames[1].document;
			var btmake = $("#btnPrepareMake", window.top.document);
			var flzlsldiv,flzltjbssldiv;
			$("#sybbfs", fszlFrame).val(data.blfs);
			$("#sytjbbfs", fszlFrame).val(data.tjblfs);
			if (data.blfs > 0) {
				// 先判断是否存在红点
				if ($("#syblfs", window.top.document).length>0) {
					$("#syblfs", window.top.document).text(data.blfs);
					$("#syblfs", window.top.document).css("display","block");
					if ($("#syblfs", window.top.document).attr('class')!='temp01') {
						$("#syblfs", window.top.document).removeClass("temp02");
						$("#syblfs", window.top.document).addClass("temp01");
					}
				} else {
					flzlsldiv='<div id="syblfs" class="temp01" style="">'+data.blfs+'</div>';
	        		$("#btnScfszl", window.top.document).append($(flzlsldiv));
				}
			} else if (data.tjblfs > 0) {
				// 先判断是否存在红点
				if ($("#syblfs", window.top.document).length>0) {
					$("#syblfs", window.top.document).text(data.tjblfs);
					$("#syblfs", window.top.document).css("display","block");
					if ($("#syblfs", window.top.document).attr('class')!='temp02') {
						$("#syblfs", window.top.document).removeClass("temp01");
						$("#syblfs", window.top.document).addClass("temp02");
					}
				} else {
					flzltjbssldiv='<div id="syblfs" class="temp02" style="">'+data.tjblfs+'</div>';
					$("#btnScfszl", window.top.document).append($(flzltjbssldiv));
				}
			} else {
				$("#syblfs", window.top.document).html(data.tjblfs);
				$("#syblfs", window.top.document).css("display","none");
			}
		}
	});
}

var index = 201
function fileUpload() {
	var $myModa1 = $(window.parent.document).find("#myModa1");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

function scfzzl() {
	var $myModa2 = $(window.parent.document).find("#myModa2");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa2.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

function importXml() {
	var $myModa1 = $(window.parent.document).find("#myModa4");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);

}

/*
 * 下载模版按钮
 * */
function modelDownload() {
	//alert(1);
	try{
		var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
		var tempData = eval('('+tempParems+')');
		var sbywbm = tempData.ywbm;
		var downloadPath = "";
		if (sbywbm.indexOf("CWBB")==0){
			downloadPath = "../../cwbb/_default_/form/cwbbbsmb.zip";
		} else {
			downloadPath = "../"+sbywbm.toLocaleLowerCase()+"/form/"+sbywbm.toLocaleLowerCase()+".xls";
		}
        var elemIF = document.createElement("iframe");
        elemIF.src = downloadPath;
       // elemIF.src = "../../cwbb/_default_/form/qykjzd.xls";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    } 
	 //window.location.href="../cwbb/_default_/form/cwbbbsmb.zip";
     //window.open("../cwbb/_default_/form/cwbbmb.zip");
     //window.open("../cwbb/_default_/form/test.zip");
     //window.open("../cwbb/_default_/begin/download.html");
    
}

function downCwbbmb(bbbsq_dm) {
	//alert(bbbsq_dm);
	try{
		var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
		var tempData = eval('('+tempParems+')');
		var sbywbm = tempData.ywbm;
		var downloadPath = "";
		if (sbywbm.indexOf("CWBB")==0){
			var vname = "_YJB.zip";
			if("1"==bbbsq_dm || "3"==bbbsq_dm){
				 vname = "_YJB.zip";
			}else if ("4"==bbbsq_dm){
				 vname = "_NB.zip";
			}
			var vfilename = "";
			if("CWBB_QY_KJZZ_YBQY"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_SYYH"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_ZQGS"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_BXGS"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QY_KJZZ_DBQY"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_XQY_KJZZ"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_SYDW_KJZD"==sbywbm){
				vfilename = sbywbm+vname;
			}else if("CWBB_QHJT"==sbywbm){
				vfilename = sbywbm+"_NB.zip";
			}
			if(vfilename !=""){
				downloadPath = "../../cwbb/_default_/form/"+sbywbm+vname;
			}else {
				downloadPath = "../../cwbb/_default_/form/cwbbbsmb.zip";
			}
		}
        var elemIF = document.createElement("iframe");
        elemIF.src = downloadPath;
       // elemIF.src = "../../cwbb/_default_/form/qykjzd.xls";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    } 
}



/**下载从事涉税服务人员人员信息采集模板*/
function downloadCssfwryxxcjModel(){
	try{ 
        var elemIF = document.createElement("iframe");   
        elemIF.src = "../../sxsq/csssfwrysmxxcj/form/csssfwrysmxxcj-modle.xls";  
       // elemIF.src = "../../cwbb/_default_/form/qykjzd.xls"; 
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);   
    }catch(e){ 

    }
}

/**从事涉税服务人员信息采集批量导入按钮*/
function importCsssryxx(){
	var child = document.getElementById("frmSheet").contentWindow;
	try{
		if(typeof(child.importExcelBtn) === 'function'){
			child.importExcelBtn();
		}
	}catch(e){ 

    }
}


function importJson() {
	var jsonXml = "";
	var paramBz = arguments[0];
	var rtnData = arguments[1];
	
	var params = {};
	params.fpath = rtnData;
	var $myModa3 = $(window.parent.document).find("#myModa3");
	if (paramBz == "1" && !$.isEmptyObject(rtnData)){
		importJson("0",rtnData);
	} else {
		$myModa3.css("display", "none");
		jsonXml = rtnData?rtnData:"";
		try{
            layer.prompt({
				maxlength : 200000,
				formType : 2,
				value : jsonXml?jsonXml:'',
				title : '导入的json报文内容',
				btn: ['确定', '取消','预览'],
				btn3: function(value, index){
//					var $myModa3 = $(window.parent.document).find("#myModa3");
					index = index + 1;
					$myModa3.css({
						"z-index" : index + 1,
						"position" : "absolute",
						"left" : "35%",
						"top" : "50%",
						"display" : ""
					}).show().animate({
						top : "50%",
						opacity : "1"
					}, 300);
				}
			// area: ['800px', '350px'] //自定义文本域宽高
			}, function(value, index, elem) {
				jsonXml = value; // 得到value
                parent.layer.close(index);
				//formData = jQuery.parseJSON(jsonXml);
				var importData = jQuery.parseJSON(jsonXml);
				formData = deepcopy(formData, importData);	
				// $(".current_selected_BD").click();
				// $("#frmSheet")[0].contentWindow.location.reload();
				var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
				var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
				var body = $("#frmSheet")[0].contentWindow.document.body;
				viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
				flagExecuteInitial = false;
				formulaEngine.applyImportFormulas(true);
				viewEngine.formApply($viewAppElement);
				viewEngine.tipsForVerify(body);
			});
		}catch(e){
			parent.layer.alert("导入数据存在错误，请检查", {icon: 2});
            console.info(e);
		}
	}
	 
}

function exportJson() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	if (!tip) {
		/*parent.layer.alert("表格存在填写错误的数据，请检查", {
			icon : 2
		});*/
		$("body").unmask();
		return;
	}
	var tmp = JSON.stringify(formData);
	tmp = JSON.parse(tmp);
	//遍历公式置空数据。
	var formulas = formulaEngine.lstCalculateFormulas;
	for(var i=0;i<formulas.length;i++){
		if(formulaEngine.idxId2Formulas[formulas[i].id]){
			if(formulas[i].flagCompiled && !formulaEngine.idxId2Formulas[formulas[i].id].flagDisable){
				if(formulas[i].strAssResolved != undefined){
					var strAssResolved = formulas[i].strAssResolved.replace(/[$]/g,'tmp');
					if(formulas[i].strAssResolved.indexOf("#")>0){
						var dynamic = jsonPath(formData, formulas[i].strAssResolved);
						for (var k = 0; k < dynamic.length; k++) {
			            	var dynamic0 = dynamic[k];
			            	if(dynamic0 instanceof Array){
			            		for (var v = 0; v < dynamic0.length; v++) {
			            			strAssResolved = formulaEngine.twoDynamicReplace([k , v ],strAssResolved);
			    	            	eval(strAssResolved + "=''");
			    	            }
			            	}else{
			            		strAssResolved = formulaEngine.twoDynamicReplace([k],strAssResolved);
		    	            	eval(strAssResolved + "=''");
			            	}
				            
			            }
					}else{
						eval(strAssResolved+"=''");
					}
				}
			}
		}else{
			//do nothing but log.
			console.info("Error:formulas not exists in idxId2Formulas:"+formulas[i].id);
		}
	}
	$("body").unmask();
	var jsonXml = JSON.stringify(tmp);
	//值还原
	/*flagExecuteInitial = false;
    formulaEngine.applyImportFormulas(true);*/

    parent.layer.open({
		title : '导出的json报文',
		offset : '0px',
		shadeClose : true,
		shade : 0.4,
		area : [ '700px', '550px' ],
		content : jsonXml
	});
}

function importJsonNoCaculate() {
	 var jsonXml = "";
	 try{
    layer.prompt({
		maxlength : 200000,
		formType : 2,
		value : '',
		title : '导入的json报文内容'// ,
	// area: ['800px', '350px'] //自定义文本域宽高
	}, function(value, index, elem) {
		jsonXml = value; // 得到value
		layer.close(index);
		//formData = jQuery.parseJSON(jsonXml);
		var importData = jQuery.parseJSON(jsonXml);
		formData = deepcopy(formData, importData);
		// $(".current_selected_BD").click();
		// $("#frmSheet")[0].contentWindow.location.reload();
          var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
          var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
          var body = $("#frmSheet")[0].contentWindow.document.body;
          viewEngine.dynamicFormApply($viewAppElement, formData, formEngine);
          flagExecuteInitial = false;
          formulaEngine.applyImportFormulas(false);
          viewEngine.formApply($viewAppElement);
          viewEngine.tipsForVerify(body);
 	 });


	 }catch(e){
		 parent.layer.alert("导入数据存在错误，请检查", {icon: 2});
		 log.info(e);
	 }
}

function exportJsonNoCaculate() {
	var drowMap = {};
	$("body").mask("校验数据中，请稍候...");
	var tip = regEvent.verifyAll();
	if (!tip) {
		/*parent.layer.alert("表格存在填写错误的数据，请检查", {
			icon : 2
		});*/
		$("body").unmask();
		return;
	}
	
	$("body").unmask();
	var jsonXml = JSON.stringify(formData);

	layer.open({
		title : '导出的json报文',
		offset : '0px',
		shadeClose : true,
		shade : 0.4,
		area : [ '700px', '550px' ],
		content : jsonXml
	});
}


/**
 * 工具方法
 */
$.fn.serializeObject = function(){
	var o= {};
	var a = this.serializeArray();
	$.each(a, function(){
		if(o[this.name]){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}else{
			o[this.name] = this.value || '';
		}
	
	});
	return o;
};
//事中监控 C.Q 20170323
function btnFEType() {
	 getOtherData();
}
/**
 * 事中监控-获取其他数据
 */
function getOtherData(){
	var index = window.parent.layer.load(2,{shade: 0.3});
	$.ajax({
		type : "POST",
		url : pathRoot+"/formula/getOtherData.do",
		dataType : "json",
		contentType : "application/json",
		data : jsonParams,
		success : function(data) {
			window.parent.layer.close(index);
			var otherData = data;
			if(!otherData) {
				parent.layer.alert('获取数据失败.', {
					icon : 5
				});
				return;
			}
			if ("string" === typeof otherData) {
				otherData = jQuery.parseJSON(otherData);   
			}
			if("undefined" !== typeof otherData.returnFlag && "N" == otherData.returnFlag) {
			
				if(typeof(otherData.errInfo) != "undefined" && otherData.errInfo.msg !="" && otherData.errInfo.msg!=null){
					//流程阻断提示
					//var index = window.parent.layer.load(0,{shade: 0.3});
					window.parent.layer.alert(otherData.errInfo.msg);
	     	   	 	return;
				}
			}
			if ("undefined" !== typeof otherData) {
				if(formData) {
					formData.qcs.initData['otherData']=otherData;
				} else {
					var qcs = {};
					var initData = {};
					initData['otherData'] = otherData;
					qcs['initData'] = initData;
					formData['qcs'] = qcs;
				}
				//formData.push(otherData);
				formulaEngine.loadFormulas(formulaCalculates);
	        	formulaEngine.initialize("formData");
	             var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
	             var body = $("#frmSheet")[0].contentWindow.document.body;
	             viewEngine.tipsForVerify(body);
			}
		},
		error : function() {
			window.parent.layer.close(index);
			parent.layer.alert('获取数据失败.', {
				icon : 5
			});
		}
	});
}


/**
 * 车船税申报[下一步]按钮动作
 */
function prepareMakeCCS(isSecondCall) {
	// TODO 置标志位 调用父页面的方法按钮 失效，
	// 若校验不通过则修改标志 并重启按钮事件(增加try catch，异常则必须恢复标志)
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tips = "";
			var t = 1;
			var sbsjxxGridlb = formData.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
			var pmJson = JSON.parse('{"101140611":"净吨位小于或者等于200吨的机动船舶","101140612":"净吨位201吨至2000吨的机动船舶","101140613":"净吨位2001吨至10000吨的机动船舶","101140614":"净吨位10001吨及以上的机动船舶","101140621":"净吨位不超过200吨的拖船、非机动驳船","101140622":"净吨位超过200吨但不超过2000吨的拖船、非机动驳船","101140623":"净吨位超过2000吨但不超过10000吨的拖船、非机动驳船","101140624":"净吨位超过10000吨的拖船、非机动驳船","101140631":"艇身长度不超过10米的游艇","101140632":"艇身长度超过10米但不超过18米的游艇","101140633":"艇身长度超过18米但不超过30米的游艇","101140634":"艇身长度超过30米的游艇","101140635":"辅助动力帆艇","101140101":"1.0升（含）以下的乘用车","101140102":"1.0升以上至1.6升(含)的乘用车","101140103":"1.6升以上至2.0升(含)的乘用车","101140104":"2.0升以上至2.5升(含)的乘用车","101140105":"2.5升以上至3.0升(含)的乘用车","101140106":"3.0升以上至4.0升(含)的乘用车","101140107":"4.0升以上的乘用车","101140211":"核定载客人数20人以下客车","101140212":"核定载客人数20人（含）以上客车","101140220":"货车","101140300":"挂车","101140400":"摩托车","101140500":"其他车辆","101140501":"专用作业车","101140502":"轮式专用机械车"}');
			if(sbsjxxGridlb==null || sbsjxxGridlb.length<1){
				//需要汇总
				tips = tips + t + ".您没有汇总数据，不能申报!</br>";
				t++;
			}else if(sbsjxxGridlb.length==1){
				//如果车船识别代码为空，则需要汇总
				var sbsjxxGridlbVo = sbsjxxGridlb[0];
				var clsbdm = sbsjxxGridlbVo.clsbdm;
				if(clsbdm==null || clsbdm==""){
					tips = tips + t + ".您没有汇总数据，不能申报!</br>";
					t++;
				}else{
					//[减免税额1]为【数值】，[减免性质1]不能为空！
					if(sbsjxxGridlbVo.jmse>0 && (sbsjxxGridlbVo.ssjmxzDm==null || sbsjxxGridlbVo.ssjmxzDm=="")){
						tips = tips + t + ".[减免税额1]为【"+ROUND(sbsjxxGridlbVo.jmse,2)+"】，[减免性质1]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.jmse2>0 && (sbsjxxGridlbVo.ssjmxzDm2==null || sbsjxxGridlbVo.ssjmxzDm2=="")){
						tips = tips + t + ".[减免税额2]为【"+ROUND(sbsjxxGridlbVo.jmse2,2)+"】，[减免性质2]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2)>=ROUND(sbsjxxGridlbVo.bnynse,2)){
						tips = tips + t + ".[本年减免税额1]与[本年减免税额2]之和【"+(ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2))+"】应小于[本年应纳税额]【"+ROUND(sbsjxxGridlbVo.bnynse,2)+"】！</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.bqyjse,2)>=ROUND(sbsjxxGridlbVo.bqynse,2)){
						tips = tips + t + ".[本期已缴税额]【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】应小于[本期应纳税额]【"+ROUND(sbsjxxGridlbVo.bqynse,2)+"】！</br>";
						t++;
					}
					//车船税征收品目[XX]，填写的预缴值【金额】，大于实际已预缴值【金额】，请修正！06100110010100047
					var bqyjse = 0;
					if(sbsjxxGridlbVo.zspmDm!=null &&sbsjxxGridlbVo.zspmDm!="" && formData.qcs.response1615.ccssbywbw!=null && formData.qcs.response1615.ccssbywbw.ccssbb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb.length>0){
						var sbsjxxGridlb15 = formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
						for(j=0;j<sbsjxxGridlb15.length;j++){
							var sbsjxxGridlb15Vo = sbsjxxGridlb15[j];
							if(sbsjxxGridlbVo.zspmDm==sbsjxxGridlb15Vo.zspmDm){
								bqyjse = sbsjxxGridlb15Vo.bqyjse;
								break;
							}
						}
					}
					if(bqyjse==null || bqyjse==""){
						bqyjse = 0;
					}
					if(ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(bqyjse,2)){
						tips = tips + t + ".车船税征收品目["+pmJson[sbsjxxGridlbVo.zspmDm]+"]，填写的预缴值【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】，大于实际已预缴值【"+ROUND(bqyjse,2)+"】，请修正！</br>";
						t++;
					}
					
				}
			}else{
				for(i=0;i<sbsjxxGridlb.length;i++){
					var sbsjxxGridlbVo = sbsjxxGridlb[i];
					//[减免税额1]为【数值】，[减免性质1]不能为空！
					if(sbsjxxGridlbVo.jmse>0 && (sbsjxxGridlbVo.ssjmxzDm==null || sbsjxxGridlbVo.ssjmxzDm=="")){
						tips = tips + t + ".[减免税额1]为【"+ROUND(sbsjxxGridlbVo.jmse,2)+"】，[减免性质1]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.jmse2>0 && (sbsjxxGridlbVo.ssjmxzDm2==null || sbsjxxGridlbVo.ssjmxzDm2=="")){
						tips = tips + t + ".[减免税额2]为【"+ROUND(sbsjxxGridlbVo.jmse2,2)+"】，[减免性质2]不能为空</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2)>=ROUND(sbsjxxGridlbVo.bnynse,2)){
						tips = tips + t + ".[本年减免税额1]与[本年减免税额2]之和【"+(ROUND(sbsjxxGridlbVo.jmse+sbsjxxGridlbVo.jmse2,2))+"】应小于[本年应纳税额]【"+ROUND(sbsjxxGridlbVo.bnynse,2)+"】！</br>";
						t++;
					}
					if(sbsjxxGridlbVo.bnynse>0 && ROUND(sbsjxxGridlbVo.bqyjse,2)>=ROUND(sbsjxxGridlbVo.bqynse,2)){
						tips = tips + t + ".[本期已缴税额]【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】应小于[本期应纳税额]【"+ROUND(sbsjxxGridlbVo.bqynse,2)+"】！</br>";
						t++;
					}
					//车船税征收品目[XX]，填写的预缴值【金额】，大于实际已预缴值【金额】，请修正！06100110010100047
					var bqyjse = 0;
					if(sbsjxxGridlbVo.zspmDm!=null &&sbsjxxGridlbVo.zspmDm!="" && formData.qcs.response1615.ccssbywbw!=null && formData.qcs.response1615.ccssbywbw.ccssbb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb!=null && formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb.length>0){
						var sbsjxxGridlb15 = formData.qcs.response1615.ccssbywbw.ccssbb.sbsjxxGrid.sbsjxxGridlb;
						for(j=0;j<sbsjxxGridlb15.length;j++){
							var sbsjxxGridlb15Vo = sbsjxxGridlb15[j];
							if(sbsjxxGridlbVo.zspmDm==sbsjxxGridlb15Vo.zspmDm){
								bqyjse = sbsjxxGridlb15Vo.bqyjse;
								break;
							}
						}
					}
					if(bqyjse==null || bqyjse==""){
						bqyjse = 0;
					}
					if(ROUND(sbsjxxGridlbVo.bqyjse,2)>ROUND(bqyjse,2)){
						tips = tips + t + ".车船税征收品目["+pmJson[sbsjxxGridlbVo.zspmDm]+"]，填写的预缴值【"+ROUND(sbsjxxGridlbVo.bqyjse,2)+"】，大于实际已预缴值【"+ROUND(bqyjse,2)+"】，请修正！</br>";
						t++;
					}
				}
			}
			var lxr = formData.ccssbywbw.ccssbb.sbbhead.lxr;//联系人不能为空
			if(lxr==null || lxr==""){
				tips = tips + t + ".[联系人]不能为空！";
				t++;
			}
			if(tips!=""){
				parent.layer.alert(tips, {title: "提示", icon: 5});
				$("body").unmask();
				prepareMakeFlag = true;
				return ;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));

		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		//提交表单
		submitForm(isSecondCall);
	}

}


/**
 * 一般纳税人 选表设置链接
 */
function linkXbsz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsxbsz.aspx";
	}
	
		/*var url = location.protocol + "//" + location.host + window.contextPath
		+ "/biz/setting/" + ywbm + "?gdslxDm="
		+ $("#gdslxDm").val()+ "&sssqQ=" + $("#sssqQ").val() 
		+ "&sssqZ=" + $("#sssqZ").val();
		// 不集成session的url，需要加些其他参数
		if (oldurl.indexOf("test=true") > -1) {
			url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
					+ "&test=true";
		}
		if(window.location.search.indexOf("gzsb=Y")>-1){
			url +="&gzsb=Y";
		}
		if(window.location.search.indexOf("gotoSbb=Y")>-1){
			url +="&gotoSbb=Y";
		}
		if(window.location.search.indexOf("gzsb=zx")>-1){
			url +="&gzsb=zx";
		}*/
	
		var url = location.protocol + "//" + location.host + window.contextPath + "/biz/setting/" + ywbm;
		url += window.location.search;
	
		top.location.href = url;
	}

	function redirectXbsz(){
		var action = $("#myform").attr("action");
		action = action.replace("make","xbsz");
		$("#myform").attr("action",action);
		$("#toXbsz").val("true");
		$("#toForm").val("false");
		$("#myform").submit();
	}

/**
 * 一般纳税人 期初数链接
 */
function jumpQcssz() {
	var oldurl = window.location.href;
	var sbywbm = $("#ywbm").val().toUpperCase();
	var ywbm = "";
	if (sbywbm == "YBNSRZZS") {
		ywbm = "ybnsrzzsqcs";
	}
	if (sbywbm == "QYSDS_A") {
		ywbm = "qysdsjmaqcssz";
	}
	var url = location.protocol + "//" + location.host + window.contextPath
			+ "/biz/setting/" + ywbm + "?bzz=csgj&gdslxDm=" + $("#gdslxDm").val()
			+ "&sssqQ=" + $("#sssqQ").val() 
			+ "&sssqZ=" + $("#sssqZ").val();
	// 不集成session的url，需要加些其他参数
	if (oldurl.indexOf("test=true") > -1) {
		url += "&djxh=" + $("#djxh").val() + "&nsrsbh=" + $("#nsrsbh").val()
				+ "&test=true";
	}
	if(window.location.search.indexOf("gzsb=Y")>-1){
		url +="&gzsb=Y";
	}
	if(window.location.search.indexOf("gotoSbb=Y")>-1){
		url +="&gotoSbb=Y";
	}
	if(window.location.search.indexOf("gzsb=zx")>-1){
		url +="&gzsb=zx";
	}
	top.location.href = url;
}
	
//
function submitForm(isSecondCall){
	var signType = '';
	if(otherParams && otherParams.signType ){
	//if(typeof otherParams.signType !== 'undefined'){
		signType = otherParams.signType;
	}
	if(signType === 'wzt' || signType === 'ocx' || signType === 'fjocx' || signType === 'bw' || signType === 'yunnan'){//容器框签名
		//提交数据并且签名
		submitFormData(signType, isSecondCall);
	}else{//确认页签名
		// 提交表单
		$("#myform").submit();
		// TODO 调用父页面的函数，则清空按钮区域
		parent.cleanMeunBtn();
}
}

//提交填报页数据报错到qqbw中
function submitFormData(signType, isSecondCall){
	var flag = true;
	var d = {};
	var t = $('#myform').serializeArray();
	$.each(t, function() {
		d[this.name ] = this.value;
	});
	
	
	var ywbm = $("#ywbm").val();
	var nssoywbm = $("#nssoYwbm").val();
	
	var svaeUrl = "/save/saveYsqbw.do";
	//过滤业务类型,提供给登陆前业务暂存
	if(ywbm!=null&&nssoywbm!=null&&ywbm!=""&&nssoywbm!=""&&ywbm!=undefined&&nssoywbm!=undefined){
		if(nssoywbm.toUpperCase().indexOf(ywbm.toUpperCase()) > -1){
			svaeUrl = "/savenosso/saveYsqbw.do";
		}
	}
	$.ajax({
		type : "POST",
		async : true,
		url : window.contextPath + svaeUrl,
		data : d,
		dataType : "json",
		success : function(data) {
			var returnFlag = data.returnFlag;
			var viewOrDownload = data.viewOrDownload;
			if('view'!==viewOrDownload){
				viewOrDownload = 'download';
			}
		    if(returnFlag==='N'){
		    	var errMsg = data.errMsg;
		    	parent.layer.alert(errMsg, {title: "填表页报文保存异常", icon: 5});
		    	parent.layer.close(index);
				$("body").unmask();
				prepareMakeFlag = true;
			} else {
				//isSecondCall为1时表示直接进行申报，不需要进行弹框签名
				if("undefined" !== typeof isSecondCall && isSecondCall === 1){
					tempSave();//cx添加
					
					// 提交表单
					$("#myform").submit();
					// 调用父页面的函数，则清空按钮区域
					parent.cleanMeunBtn();
					return;
				}
				
				if (signType === 'bw') {
					bwSign();
				}else {
					var zjTiket = data.zjTiket;
					if (signType === 'wzt') {
						clientSign(zjTiket, viewOrDownload);
					} else if (signType === 'ocx') {
						pluginSign(zjTiket, viewOrDownload);
					} else if (signType === 'fjocx') {
						fjpluginSign(zjTiket, viewOrDownload);
					}else if (signType === 'yunnan') {
						ynclientSign(zjTiket, viewOrDownload);
					}
				}
			}
		},
		error : function(aa) {
			window.parent.layer.open({
        		type:1,
        		area:['840px','420px'],
        		content:aa.responseText
        	});
		}
	});
}

//TODO 提交申报(上一步已经保存了填报页数据，此时只需要申报提交即可)
function submitPdf(qzbz){
	var href = parent.window.location.href;

	if (href.indexOf(".") > -1) {
        href = href.substr(0, href.indexOf("."));
    }

    if (href.indexOf("?") > -1) {
        href = href.substr(0, href.indexOf("?"));
    }
    if (href.indexOf(";") > -1) {
        href = href.substr(0, href.indexOf(";"));
    }
    var url = href + "/make?_bizReq_path_=" + $("#_bizReq_path_").val()
	    + "&_query_string_=" + encodeURIComponent($("#_query_string_").val())
	    + "&ysqxxid=" + $("#ysqxxid").val()
		+ "&_re_contextpath_=" + $("#contextPath").val()
        + "&qzbz="+qzbz;
    $("#frmMain", window.parent.document).attr("src",url);
    window.parent.hideFrameHead();
}


//a 旧对象。b 新对象。把b对象copy到a对象上，返回。
function deepcopy(a,b) {
  var _clone = isArray(a)?[]:{};
  var i=0,
  _arg=arguments,_co='',len=_arg.length;
  if(!_arg[1]){
      _clone=this;
  };
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
};

function isEmpty(_o){
	if(_o == undefined){
		return true;
	}
	if(typeof _o === "string"){
		return _o == '';
	}
	if(typeof _o === "object"){
		return JSON.stringify(_o) == "{}" || _o.length == 0; 
	}
	if(_o.constructor === Array){
		return _0.length == 0;
	}
}

function isArray(o){
	return Object.prototype.toString.call(o)=='[object Array]';
}

// 个人所得税自行申报A 下一步 校验核算机关方法
function prepareMakeGrsdszxsbA(isSecondCall) {
	var frame = window;
	if(formData.grsdszxsbAb.head.zxsbqxDm.indexOf('0') == -1){
		prepareMake(isSecondCall);
		return ;
	}
	if(formData.grsdszxsbAb.head.slswjgDm == null || formData.grsdszxsbAb.head.slswjgDm == ''){
		parent.layer.alert("[受理税务机关]不能为空！", {title: "提示", icon: 5});
		return ;
	}
	formData.grsdszxsbAb.head.slswjgMc = formData.grsdszxsbAb.head.slswjgMc.split("|")[0].trim();
	var flag = false;    //核算机关代码校验是否通过标志
	
	//根据受理税务机关查询核算机关
	var gdslxDm = formData.qcs.initData.nsrjbxx.gdslxDm;
	var params = {};
	params.slswjgDm = formData.grsdszxsbAb.head.slswjgDm;
	params.gdslxDm = gdslxDm;
	var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
	$.ajax({
		type: "POST",
		url: mainUrl+"/nssb/grsdszxsbA/getHsjgxx.do",
		data:JSON.stringify(params),
		dataType : "json",
		contentType:"application/json",
		success : function(data) {
			if(data != null && data != ""){
				var hsjgDmGridlb = data.taxML.hsjgDmGrid.hsjgDmGridlb;
				if(hsjgDmGridlb.length>1){
					for(var i=0;i<hsjgDmGridlb.length;i++){
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i] = {};
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i].gljgDm = hsjgDmGridlb[i].gljgDm;
						formData.qcs.hsjgDmGrid.hsjgDmGridlb[i].hsjgDm = hsjgDmGridlb[i].hsjgDm;
					}
				}else{
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0] = {};
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0].gljgDm = hsjgDmGridlb.gljgDm;
					formData.qcs.hsjgDmGrid.hsjgDmGridlb[0].hsjgDm = hsjgDmGridlb.hsjgDm;
				}
				if(formData.qcs.hsjgDmGrid.hsjgDmGridlb.length == 0) {
					parent.layer.alert("您选择的受理税务机关所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
					return ;
				}
				
				var length = formData.qcs.grsdszxsbAbMx1.length;
				if(length > 0) {
					// 遍历主表识别号得到的核算机关代码，每个识别号可能得到多个核算机关
					for(var i=0;i<length;i++){
						if(formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx != undefined && formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx != null && formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx.length>0){
							for(var k = 0;k<formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx.length;k++){
								var hsjgDm = formData.qcs.grsdszxsbAbMx1[i].hsjgDmxx[k].hsjgDm;
								
								for(var j=0;j<formData.qcs.hsjgDmGrid.hsjgDmGridlb.length;j++){
									if(hsjgDm == formData.qcs.hsjgDmGrid.hsjgDmGridlb[j].hsjgDm){
										flag = true;
										break;
									}
								}
							}
						}
					}
					if(flag){
						prepareMake(isSecondCall);
					} else{// 判断是否来源山东——您的主管税务机关和您收入所在企业的主管税务机关所在区域不一致，请联系税管员处理！
						parent.layer.alert("您选择的受理税务机关和您收入所在企业的主管税务机关所在区域不一致，请联系税管员处理！", {title: "提示", icon: 5});
						return ;
					}
				} else{
					parent.layer.alert("您填写的任职受雇单位所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
					return ;
				}
			}else{
				parent.layer.alert("您选择的受理税务机关所属核算机关信息为空，请联系税管员处理！", {title: "提示", icon: 5});
				return;
			}
		},
		error : function(data) {
			parent.parent.layer.closeAll('loading');
			layer.alert('查询不到受理税务机关所属核算机关信息，请稍后再试.', {icon: 5});
		}
	});
}


/**
 * 生产经营个人所得税C申报[下一步]按钮动作
 */
function prepareMakeSCJYC(isSecondCall) {
	var frame = window;
	$("body").mask("正在处理，请稍候...");
	var flag = false;    //核算机关代码校验是否通过标志
	
	var year = (formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbHead.skssqq).substring(0,4);
	
	
	var dfpjfrmxLb = formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbBody.btzdwlb.dfpjfrmxLb;
	var sfhjdLb = [];
	var tsy = formData.qcs.initData.tsy;
	var bz = formData.qcs.initData.bz;
	if(bz != undefined){
		if(bz != 'N'){
			parent.layer.alert(tsy);
			$("body").unmask();
			prepareMakeFlag = true;
			return;
		}
	}else{
		if(dfpjfrmxLb.length==0){
			parent.layer.alert("系统未查询到您有个人所得税生产经营所得纳税申报表（A表）或个人所得税生产经营所得纳税申报表（B表）的申报记录，无法申报当前报表！");
			$("body").unmask();
			prepareMakeFlag = true;
			return ;
		}else{
			for(var i =0;i<dfpjfrmxLb.length;i++){
				sfhjdLb.push(dfpjfrmxLb[i].sfhjd)
			}
			if(sfhjdLb.indexOf('1')==-1){
				parent.layer.alert("请选择汇缴地!");
				$("body").unmask();
				prepareMakeFlag = true;
				return ;
			}else{
				if(formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbBody.tzzxx.sdxmDm=='0300'){
					if(formData.qcs.initData.tzdwGirdlb.tzdwGird.length > 0){
						var tzdwGird = formData.qcs.initData.tzdwGirdlb.tzdwGird;
						var slswjg = '';
						for(var i=0;i<tzdwGird.length;i++){
							if(tzdwGird[i].sdxmdm=='0300'){
								slswjg = slswjg + tzdwGird[i].slswjg + ',';
							}
						}
						slswjg = slswjg.substring(0,slswjg.length-1);
						parent.layer.alert("您"+year+"年度所得项目为“企事业承包、承租所得”的《生产、经营所得个人所得纳税申报表（C表）》已申报，受理税务机关为["+slswjg+"]，不能重复申报！");
						$("body").unmask();
						prepareMakeFlag = true;
						return ;
					}
				}else{
					var tzdwGird = formData.qcs.initData.tzdwGirdlb.tzdwGird;
					var pos = sfhjdLb.indexOf('1');
					var nsrsbh = formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbBody.btzdwlb.dfpjfrmxLb[pos].btzdwnsrsbh;
					for(var i =0;i<tzdwGird.length;i++){
						if(tzdwGird[i].tzqydjxh==formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbBody.btzdwlb.dfpjfrmxLb[pos].tzdwDjxh){
							if(tzdwGird[i].btzdwlx=='1'&&tzdwGird[i].sdxmdm=='0200'&&tzdwGird[i].sfhjd=='Y'){
								parent.layer.alert("您"+year+"年度所得项目为“个体工商户生产经营所得”、所选汇缴地被投资单位纳税人识别号为"+nsrsbh+"《生产、经营所得个人所得纳税申报表（C表）》已申报，请选择其他汇缴地的被投资单位进行申报！");
								$("body").unmask();
								prepareMakeFlag = true;
								return ;
							}
						}
					}
				}
				if(formData.ywbw.scjysdtzzgrsdshzsbb.scjysdtzzgrsdshzsbbBody.tzzxx.btzdwlx == 0){
					if(formData.qcs.initData.tzdwGirdlb.tzdwGird.length > 0){
						var tzdwGird = formData.qcs.initData.tzdwGirdlb.tzdwGird;
						var slswjg = '';
						for(var i=0;i<tzdwGird.length;i++){
							if(tzdwGird[i].btzdwlx=='0'&&tzdwGird[i].sdxmdm=='0200'){
								slswjg = slswjg + tzdwGird[i].slswjg + ',';
							}
						}
						slswjg = slswjg.substring(0,slswjg.length-1);
						parent.layer.alert("您"+year+"年度所得项目为“个体工商户生产经营所得”的《生产、经营所得个人所得纳税申报表（C表）》已申报，受理税务机关为["+slswjg+"],不能重复申报！");
						$("body").unmask();
						prepareMakeFlag = true;
						return ;
					}
				}
			 }
			}
		}
	prepareMake(isSecondCall);
}


/**个人所得税年12万以上申报下一步*/
function grsdsN12WPrepareMake(isSecondCall){
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
	
			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));
	
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		prepareMakeFlag = true;
		$("body").unmask("");
		parent.layer.confirm(
				'我声明，此纳税申报表是根据《中华人民共和国个人所得税法》及有关法律、法规的规定填报的，我保证它是真实的、可靠的、完整的。',
				{
					icon : 3,
					title : '信息',
					btn : ['确定']
				},function(index) {
					parent.layer.close(index);
					$("body").mask("校验数据中，请稍候...");
					submitForm(isSecondCall);// 提交表单
				});
	}
}

/**水资源税税源采集保存*/
function szyssycjSave(){
	if (prepareMakeFlag) {
		prepareMakeFlag = false;
		// 校验所有数据
		try {
			//点击下一步，进行子窗口的特色检验
			var child = document.getElementById("frmSheet").contentWindow;
			try{
				if(typeof(child.nextstepCheck) === 'function'){
					if(!child.nextstepCheck()){ 
						prepareMakeFlag = true;
						return;
					}
				}
			}catch(e){}
			$("body").mask("校验数据中，请稍候...");
			var tip = true;
			var regEvent = new RegEvent();
			tip = regEvent.verifyAllComfirm(prepareMake);
			if (!tip) {
				// parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
				$("body").unmask();
				prepareMakeFlag = true;
				return;
			}
	
			try{
				//当设置为需要调用第三方接口校验是才执行此段代码
				if("undefined" !== typeof otherParams &&
						otherParams["otherValidate"]=="Y"){
					//增加其他接口的校验
					if(!otherValidate()){
						$("body").unmask();
						return;
					}
				}
			} catch (e) {
				console.log("ERROR[" + e + "]");
				prepareMakeFlag = true;
			}
			if(typeof(parent.makeTypeDefualt) != "undefined" && parent.makeTypeDefualt == 'HTML') {
				$("body").mask("正在提交，请稍候...");
			} else {
				$("body").mask("正在处理，请稍候...");
			}
			
			var saveData = JSON.stringify(formData);
			formulaEngine.Calculate2SubmitFormulas();// 提交前处理json
			var submitData = JSON.stringify(formData);
			if (saveData == submitData) {
				submitData = "";// 当saveData(zcbw)报文和submitData(dclbw)报文都有时只保存saveData报文
			}
			$("#saveData1").val(encodeURIComponent(saveData));
			$("#submitData1").val(encodeURIComponent(submitData));
	
		} catch (ex) {
			console.log("ERROR[" + ex + "]");
			prepareMakeFlag = true;
			return;
		}
		prepareMakeFlag = true;
		$("body").unmask("");
		$(top.document).find("body").mask("正在保存数据，请稍候...");
		var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
		var rtnJson = {};
		var params = {};
		params.djxh = $("#djxh").val();
		params.nsrsbh = formData.qcs.initData.nsrjbxx.nsrsbh;
		params.gdslxDm = $("#gdslxDm").val();
		var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm;
		params.swjgDm = swjgDm;
		params.formData = formData;
		//Excel文件解析
		$.ajax({
			type: "POST",
	 		url: mainUrl+"/nssb/szys/szyssycjSave.do",
	 		dataType:"json",      
	        contentType:"application/json",
	        data:JSON.stringify(params),
	        success:function(data){
	 			if (data!=undefined&&data!=null&&data!='') {
	 				//保存成功后需要刷新页面，将新增加或者修改刷新到qcs的税源信息中
	 				var newSzyssybxxGridlb = {};
	 				var DJSzyssyxxVO = formData.DJSzyssyxxVO;
	 				var lbIndex = 0;//通过数组下标修改或者新增加期初数的税源信息,新增时下标刚好是数组的长度
	 				if(formData.qcs.szyssybxxGrid.szyssybxxGridlb!=null &&  formData.qcs.szyssybxxGrid.szyssybxxGridlb!=undefined){
	 					lbIndex = formData.qcs.szyssybxxGrid.szyssybxxGridlb.length;
	 				}else{
	 					var szyssybxxGridlb = new Array();
	 					formData.qcs.szyssybxxGrid = {};
	 					formData.qcs.szyssybxxGrid.szyssybxxGridlb = szyssybxxGridlb;
	 				}
	 				var isAdd = "Y";
	 				if(DJSzyssyxxVO.szysybh==null || DJSzyssyxxVO.szysybh=='' || data!=DJSzyssyxxVO.szysybh){
	 					//新增
	 					formData.DJSzyssyxxVO.szysybh = data;
	 					formData.DJSzyssyxxVO.bgrq = formData.qcs.initData.rqxx.tbrq;
	 					parent.layer.alert("保存成功，税源编号为："+data);
	 				}else{
	 					isAdd = "N";
	 					parent.layer.alert("保存成功，税源信息已变更");
	 					//修改
	 					for(i=0;i<formData.qcs.szyssybxxGrid.szyssybxxGridlb.length;i++){
	 						var szyssybxxGrid = formData.qcs.szyssybxxGrid.szyssybxxGridlb[i];
	 						if(szyssybxxGrid.szysybh == data){
	 							//等于返回结果的税源编号，则是修改了这个税源信息
	 							lbIndex = i;
	 							break ;
	 						}
	 					}
	 				}
	 				newSzyssybxxGridlb.zgswjDm = DJSzyssyxxVO.zgswj_dm;
					newSzyssybxxGridlb.nqysjhDbs = DJSzyssyxxVO.nqysjhdbs;
					newSzyssybxxGridlb.tsyslbjhDm = DJSzyssyxxVO.tsyslbjh_dm;
					newSzyssybxxGridlb.qslhzjgxzjbDm = DJSzyssyxxVO.qslhzjgxzjb_dm;
					newSzyssybxxGridlb.jdxzDm = DJSzyssyxxVO.jdxz_dm;
					newSzyssybxxGridlb.qsxkspjg = DJSzyssyxxVO.qsxkspjg;
					newSzyssybxxGridlb.djxh = DJSzyssyxxVO.djxh;
					newSzyssybxxGridlb.qsyxqz = DJSzyssyxxVO.qsyxqz;
					newSzyssybxxGridlb.szysybh = data;
					newSzyssybxxGridlb.flzlMc = DJSzyssyxxVO.flzlmc;
					newSzyssybxxGridlb.qsyxqq = DJSzyssyxxVO.qsyxqq;
					newSzyssybxxGridlb.lrrq = DJSzyssyxxVO.lrrq;
					newSzyssybxxGridlb.sysedcDm = DJSzyssyxxVO.sysedc_dm;
					newSzyssybxxGridlb.gsgwfgBz = DJSzyssyxxVO.gsgwfgbz;
					newSzyssybxxGridlb.bgrq = formData.qcs.initData.rqxx.tbrq;
					newSzyssybxxGridlb.dxsccgsqDm = DJSzyssyxxVO.dxsccgsq_dm;
					newSzyssybxxGridlb.sjgsdq = DJSzyssyxxVO.sjgsdq;
					newSzyssybxxGridlb.qslhzjg = DJSzyssyxxVO.qslhzjg;
					newSzyssybxxGridlb.zgswskfjDm = DJSzyssyxxVO.zgswskfj_dm;
					newSzyssybxxGridlb.xzqhszDm = DJSzyssyxxVO.xzqhsz_dm;
					newSzyssybxxGridlb.nqysjhDxs = DJSzyssyxxVO.nqysjhdxs;
					newSzyssybxxGridlb.sylxjhDm = DJSzyssyxxVO.sylxjh_dm;
					newSzyssybxxGridlb.uuid = DJSzyssyxxVO.uuid;
					newSzyssybxxGridlb.qskdz = DJSzyssyxxVO.qskdz;
					newSzyssybxxGridlb.qyshylbDm = DJSzyssyxxVO.qyshylb_dm;
					newSzyssybxxGridlb.qsxkzh = DJSzyssyxxVO.qsxkzh;
					newSzyssybxxGridlb.qsxkzBz = DJSzyssyxxVO.qsxkzbz;
	 				formData.qcs.szyssybxxGrid.szyssybxxGridlb[lbIndex] = newSzyssybxxGridlb;
	 				$(top.document).find("body").unmask();
	 				var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
					var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
					var body = $("#frmSheet")[0].contentWindow.document.body;
					// 3、刷新校验结果和控制结果
					formCT["szysyxxCT"] = formData.qcs.szyssybxxGrid.szyssybxxGridlb;
					viewEngine.formApply($viewAppElement);
					viewEngine.tipsForVerify(body);
					var sel = $("#frmSheet").contents().find("#szysybh")[0];
					for(i=0;i<sel.options.length;i++){
					   var s = sel.options[i];
					   if(DJSzyssyxxVO.szysybh===s.label.trim()){
					     s.selected=true;
					   }
					}
	 			}else{
	 				parent.layer.alert('保存失败，请联系管理员排查原因！', {title:"提示",icon: 5});
		 			$(top.document).find("body").unmask();
	 			}
	 		},
	 		error:function(data){
	 			parent.layer.alert('发生服务异常！可能原因：系统超时，请您重新登录！若已重新登录无法正常使用，请联系管理员。', {title:"提示",icon: 5});
	 			$(top.document).find("body").unmask();
	 		}
		
		});
	}
}




/**
 * 土地增值税二下一步按钮
 * URL不传属期，填表页属期在选择项目编号之后变动
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeTdzzs2(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.dzzsqssbywbw.tdzzsqssbb.tdzzsqssbzb.nsrxxForm.skssqq;
	var skssqz = formData.dzzsqssbywbw.tdzzsqssbb.tdzzsqssbzb.nsrxxForm.skssqz;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
}


/**
 * 土地增值税5下一步按钮
 * URL不传属期，填表页属期在选择项目编号之后变动
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeTdzzs5(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.tdzzsqshdzsywbw.tdzzsqshdzs.tdzzsqshdzzbd.nsrxxForm.skssqq;
	var skssqz = formData.tdzzsqshdzsywbw.tdzzsqshdzs.tdzzsqshdzzbd.nsrxxForm.skssqz;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
}





/**
 * 代收代缴车船税申报
 * 不用URL的属期，使用导入模板中的属期
 * 在申报表下一步时将属期加入参数
 * @param isSecondCall
 */
function prepareMakeDsdjccs(isSecondCall) {
	var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
	var tempData = eval('('+tempParems+')');
	var skssqq = formData.qcs.initData.dkdjdsdjInitData.mbSssqQ;
	var skssqz = formData.qcs.initData.dkdjdsdjInitData.mbSssqZ;
	tempData.sssqQ = skssqq;
	tempData.sssqZ = skssqz;
	tempParems = JSON.stringify(tempData);
	tempParems = tempParems.substring(1,tempParems.length-1);
	$("#myform").find("input[id='_query_string_']").val(tempParems);
	$("#myform").find("input[id='sssqQ']").val(skssqq);
	$("#myform").find("input[id='sssqZ']").val(skssqz);
	prepareMake(isSecondCall);
}

/**
 * 小规模发票汇总
 */
function showXgmFphz() {
	if(typeof(xgmFphzCallback) === 'function'){
		xgmFphzCallback();
	}
}
/**
 * 小规模一表集成切换电局版本
 */
function gotoXgmzzs() {
	var msg = '您目前使用的是发票导入申报表模式填报，【切换电局版本】为不导入发票数据手动填写申报表模式，请确认是否继续？';
	parent.layer.confirm(msg,{
		icon: 3,
		title: '提示',
		btn: [ '确定', '取消' ],
		btn1 :function(index) {
			var url = parent.window.location.href;
			if (url.indexOf('&ybsb=Y')) {
				url = url.replace('&ybsb=Y', '');
			}
			
			if (url.indexOf('ybsb=Y&')) {
				url = url.replace('ybsb=Y&', '');
			}
			
			parent.window.location.href = url;
		}
	});
}

function redirectFphzPage(){
	$("body").mask("处理中，请稍候...");
	parent.flagDataLoaded = false;
	var action = $("#myform").attr("action");
	action = action.replace("make","wbsj");
	$("#myform").attr("action",action);
	$("#_query_string_").val("");
	$("#toWbsj").val("true");
	$("#toXbsz").val("false");
	$("#toForm").val("false");
    $("#myform").submit();
	// 调用父页面的函数，清空按钮区域
	parent.cleanMeunBtn();
}

/**
 * 财务报表申报表页面跳转到财务报表转换页面
 * */
function cwbbCbzh(){
	var mainUrl = window.location.protocol+"//"+window.location.host;
	var DZSWJ_TGC = "";
	try{
		DZSWJ_TGC = parent.window.frames["fzzlFrame"].contentWindow.DZSWJ_TGC;
	}catch(e){
		DZSWJ_TGC = parent.window.frames["fzzlFrame"].DZSWJ_TGC;
	}
	var cbzhUrl = mainUrl+"/v1/sso.html"+window.location.search+"&source=A99&DZSWJ_TGC="+DZSWJ_TGC;
	if(cbzhUrl.indexOf("&yhid=")>-1){
		//将yhid替换成null
		cbzhUrl = changeUrlArg(cbzhUrl, "yhid", "null");
	}
	if(cbzhUrl.indexOf("&yhm=")>-1){
		//将yhm替换成null
		cbzhUrl = changeUrlArg(cbzhUrl, "yhm", "null");
	}
	//小类代码
	var zlbsxlDm = formData.SB100VO.SB100BdxxVO.zlbsxlDm;
	if(zlbsxlDm!=undefined && zlbsxlDm!=null && zlbsxlDm!=""){
		if(cbzhUrl.indexOf("zlbsxlDm=")>-1){
			cbzhUrl = changeUrlArg(cbzhUrl, "zlbsxlDm", zlbsxlDm);
		}else{
			cbzhUrl = cbzhUrl + "&zlbsxlDm=" + zlbsxlDm;
		}
	}
	//企业会计制度代码
	var kjzdzzDm = formData.qcs.kjzdzzDm;
	if(kjzdzzDm!=undefined && kjzdzzDm!=null && kjzdzzDm!=""){
		if(cbzhUrl.indexOf("kjzdzzDm=")>-1){
			cbzhUrl = changeUrlArg(cbzhUrl, "kjzdzzDm", kjzdzzDm);
		}else{
			cbzhUrl = cbzhUrl + "&kjzdzzDm=" + kjzdzzDm;
		}
	}
	parent.window.open(cbzhUrl,"_self");
}

function changeUrlArg(url, arg, val) {
	var pattern = arg + '=([^&]*)';
	var replaceText = arg + '=' + val;
	return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
}