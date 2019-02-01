/**
 * 
 */

//是否已经加载过我的提醒，通知
var hasLoadWdtx=false;
var hasLoadWdtz=false;
var hasLoadDbsx=false;
var showGdsbz="";//是否隐藏国地税标志,若非为Y或N则保持原样
var context_path = "";

$(document).ready(function(){

	
	var requesturl = "/xxmh/viewsControlController/getShowGdsbz.do";
	$.ajax({
		type : "post",
		url : requesturl,
		data :{},
		datatype:"text",
		success : function(data){
			if(data == "N" || data == "Y"){
				showGdsbz = data;
			}
		}
	});
});


//查询待办事项方法
function queryDbxxList(){
	if(hasLoadDbsx==true) return;
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 6;
	var url=contPath+"/myCenterController/getDbsx.do";
	var params={pageIndex: 1, pageSize: 4};
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
        	var gsWfxx="";
    		if(res.flag=="ok"){
    			var items=res.items;
    			var contextPath = res.contextPath;
    			context_path = contextPath;
    			var length=items.length;
    			var wdCount=items.wdCount;
    			var isExitWfxx=items.isExitWfxx;
    			
    			$("#dbxxDataList").find("tr[name=trData]").remove();
    			if(length > 0){
    				var trHtml= getDbxxTrHtml(contextPath,items);
    				$("#dbxxDataList").append(trHtml);
    				/*if(showGdsbz=="N"){//配置表中配置的是否显示国地税标志为N的话，则隐藏国地税标志
    					$(".ctrl2").hide();
    				}else if(showGdsbz=="Y"){
    					$(".ctrl2").show();
    				}*/
    				
    			}
    			

    			if(length<=0){
    				var nullHTML="<tr name='trData'><td colspan='4' style='text-align:center;height:240px;border-top: 1px solid #dddddd;'>暂无待办</td></tr>";
    				$("#dbxxDataList").append(nullHTML);
    			}else if(length<showCount){
    				var nullHTML="";
    				for(var i=0;i<(showCount-length);i++){
    					nullHTML+="<tr name='trData'><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
    				}
    				$("#dbxxDataList").append(nullHTML);
    			}
				if(wdCount>showCount){
					$("#dbxxTotalCount").text(showCount);
					$("#dbxxTotalCount").show();
				}else{
					if(wdCount > 0){
						$("#dbxxTotalCount").text(wdCount);
						$("#dbxxTotalCount").show();
					}
				}
    			
//    			$("#dbxxTotalCount").html(res.recordCount);
    		}else{
    			//alert("加载数据失败！");
    		}
    		//querySstxList();//涉税提醒加载
        },
        error: function(data){
			/*var nullHTML="";
			var	showCount=4;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"</tr>";
			}
			$("#dbxxDataList").append(nullHTML);*/
        }
    });
}

//查询提醒方法
function querySstxList(){
	
	if(hasLoadWdtx==true) return;
	hasLoadWdtx=true;
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 6;
	var url=contPath+"/myCenterController/getSstx.do";
	var params={pageIndex: 1, pageSize: 5, "ydzt" : "N"};//默认获取未读的
	
	$.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        success: function(data){
        	var res = data;
        	var html="";
    		if(res.flag=="ok"){
    			var items=res.items;
    			var length=items.length;
    			var wdsum=res.wdsum;
    			$("#sstxDataList").find("tr[name=trData]").remove();
    			for(var i=0;i<length&&i<showCount;i++){
    				var trHtml= getSstxTrHtml((i+1),items[i]);
    				$("#sstxDataList").append(trHtml);
    				
    			}
    			if(length<=0){
    				var nullHTML="<tr name='trData'><td colspan='2' style='text-align:center;height:240px;border-top: 1px solid #dddddd;'>暂无提醒</td></tr>";
    				$("#sstxDataList").append(nullHTML);
    			}else if(length<showCount){
    				var nullHTML="";
    				for(var i=0;i<(showCount-length);i++){
    					nullHTML+="<tr name='trData'><td>&nbsp;</td><td>&nbsp;</td></tr>";
    				}
    				$("#sstxDataList").append(nullHTML);
    			}
				if(wdsum>showCount){
					$("#sstxTotalCount").text(showCount);
					$("#sstxTotalCount").show();
				}else{
					if(wdsum > 0){
						$("#sstxTotalCount").text(wdsum);
						$("#sstxTotalCount").show();
					}
				}
    		}else{
    			//alert("加载数据失败！");
    		}
    		//querySsTzList();//通知公告加载
        },
        error: function(data){
			/*var nullHTML="";
			var	showCount=6;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"<td>&nbsp;</td>"
			          +"</tr>";
			}
			$("#sstxDataList").append(nullHTML);*/
        }
    });
}

//查询通知方法
function querySsTzList(){
	
	if(hasLoadWdtz==true) return;
	hasLoadWdtz=true;
	
	var pageSize = 10;
	var pageIndex = 1;
	var showCount = 5;
	var url=contPath+"/myCenterController/getSstz.do";
	var params={pageIndex: 1, pageSize: 5, "ydzt" : "N"};//默认获取未读数据
	
	$.ajax({
		type: "post",
		url: url,
		data: params,
		dataType: "json",
		success: function(data){
			var res = data;
			var html="";
			if(res.flag=="ok"){
				var items=res.items;
				var length=items.length;
				var wdCount=res.wdsum;
				$("#tzggDataList").find("li[name=trData]").remove();
				for(var i=0;i<length&&i<showCount;i++){
					var trHtml= getTzggTrHtml((i+1),items[i]);
					$("#tzggDataList").append(trHtml);
					
					if(showGdsbz=="N"){//配置表中配置的是否显示国地税标志为N的话，则隐藏国地税标志
						$(".ctrl2").hide();
    				}else if(showGdsbz=="Y"){
    					$(".ctrl2").show();
    				}
					
				}
				if(length<=0){
    				var nullHTML="<li name='trData' style='text-align:center;height:202px;line-height:202px;border-top: 1px solid #dddddd;'>暂无通知</li>";
    				$("#tzggDataList").append(nullHTML);
    			}else if(length<showCount){
					var nullHTML="";
					for(var i=0;i<(showCount-length);i++){
						nullHTML+="<li name='trData'></li>";
					}
					$("#tzggDataList").append(nullHTML);
				}
				
				
				if(wdCount>showCount){
					$("#tzggTotalCount").text(showCount);
					$("#tzggTotalCount").show();
				}else{
					if(wdCount > 0){
						$("#tzggTotalCount").text(wdCount);
						$("#tzggTotalCount").show();
					}
				}
				
//				$("#tzggTotalCount").html(res.recordCount);
			}else{
				//alert("加载数据失败！");
			}
		},
		error: function(data){
			/*var nullHTML="";
			var	showCount=6;
			for(var i=0;i<showCount;i++){
				nullHTML+="<tr name='trData'>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"<td>&nbsp;</td>"
					+"</tr>";
			}
			$("#tzggDataList").append(nullHTML);*/
		}
	});
}

//待办事项行html
function getDbxxTrHtml(contextPath,items){
	var html = "";
	for(var i=0;i<items.length; i++){
		var item = items[i];
		var cor="fontcolor01";//国地税颜色
		var gdsmc="";
		var url;
		/*if("G"==item.ly){
			gdsmc="<span class=\"fontcolor01\">[国税]</span>";
		}else if("D"==item.ly){
			gdsmc="<span class=\"fontcolor02\">[地税]</span>";
		}else if("GD"==item.ly){
			gdsmc="<span class=\"fontcolor03\">[国地]</span>";
		}*/
		
		//拼接url
		url =	contextPath  + item.url;
		var paramers = item.paramers;
		var ysqxxid = "";
		if(paramers != null){
			url=url+ "?";
			for(var j in paramers){
				if(j=="ysqxxid"){
					ysqxxid =  paramers[j];
				}
				if(paramers[j]!=null){
						url=url+ "&"+ j +"=" + paramers[j] ;
				}
				
				}
		}
		
		if(item.id!=null){
			url =url + "&mesSendId=" + item.id ;
		}
		
		var czlink="";
		/*czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\""+url+"\">办理</a></div>";*/
		
		czlink="<div class=\"sbtnbox1\"><a href=\"#\" class=\"sbtn sbtn01\"  ly=\""+item.ly+ "\" id= \""+item.id+"\" url =\" " + url+  "\"ysqxxid=\""+ysqxxid+"\" isRead=\""+item.isRead+"\" isCompleted=\""+item.isCompleted+"\" onclick=\"updateDbsxZt(this)\">办理</a></div>";
		
		
		
		if("true"==item.isExitWfxx){
			czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\"/web-fzfg/fzfg/wsInit.do?sbywbm=JYXZCF&swsxDm=SXA122030001&dzbzdszlDm=BDA1220074\">办理</a></div>";
		}
		
		if("true"==item.isyhzxdb){
			gdsmc="<span class=\"fontcolor03\">[联合业务]</span>";
			if("/yhgl/service/um/enterprise/bsqxList" == item.url){
				czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" href=\"#none\" onclick=\"window.parent.goPage('/yhgl/service/um/enterprise/bsqxList?cdId=932&gnDm=gndm-932','yhgl','yhsqgl','','');\">办理</a></div>";
			}else{
				czlink="<div class=\"sbtnbox1\"><a class=\"sbtn sbtn01\" target=\"_blank\" href=\""+item.url+"\">办理</a></div>";
			}
		}
		
		
		var sxsm="<div class=\"sbtnbox1\"><a href=\"javascript:void(0)\" class=\"sbtn sbtn01\"  content=\""+item.content+ "\" onclick=\"checkdb(this)\">查看</a></div>";
		
		
		var showtitle=subString(item.txbt,33);
		var winwidth=$(window.parent).width();	
		if(winwidth<1240){//1024下
			showtitle=subString(item.txbt,23);
		}
		
		html +="<tr name='trData'>";
		/*if(showGdsbz=="Y"){
			html+="<td class=\"ctrl2\">"+gdsmc+"</td>";
		}else if(showGdsbz=="N"){
			//不显示
		}else{
			html+="<td class=\"ctrl2\">"+gdsmc+"</td>";
		}*/
	          
	      html+="<td style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" title='"+item.txbt+"'>"+showtitle+"</td>"
	          +"<td >"+item.dbsj+"</td>"
	          +"<td >"+sxsm+"</td>"
	          +"<td >"+czlink+"</td>"
	          +"</tr>";
		
	}
	
	
	return html;
}
//涉税提醒行html
function getSstxTrHtml(num,item){
	var cor="fontcolor01";//国地税颜色
	
	var liclass="";
	if(item.sxzt=="N"){
		liclass="bold";
	}
	
	//替换标题和提醒时间
	item.txnr = item.txnr.replace(/@@1/, item.bt);
	item.txnr = item.txnr.replace(/@@2/, item.txsj);
	
	//缴款状态不明提醒
	if("缴款状态不明提醒"==item.bt){
		item.txnr = jkztbmtx(item);
	}
	
	var html="<tr class=\""+liclass+"\" name='trData' id=\"sstx_li_"+(num)+"\">";
	/*if(showGdsbz=="Y"){
		html+=gdsmc;
	}else if(showGdsbz=="N"){
		//不显示
	}else{
		html+=gdsmc;
	}*/
		html+="<td><a title='"+item.bt+"' href=\"javascript:return false;showTzggDetail('"+num+"','"+item.id+"','"+item.bt+"','sstx');updateSSxxzt('"+item.id+"','"+item.ly+"','SSTX','"+item.sxzt+"');\">"
			+subString(item.bt,60)+"</a></td><td>"+item.txsj+"</td></tr>";
	
	html += 	"<tr style=\"display:none\"><td><div class=\"\" style=\"display:none\" id=\"sstx_"+(num)+"\">"
	 +			"<div class=\"news_nav\" style=\"padding:20px\">"
	 +  			"<div class=\"news_cont\" style=\"border-top: 0px dashed #ddd;padding-top: 0px;\">"+item.txnr+"</div>"
	 +  		"</div>"
	 + 		"</div></td></tr>";
	return html;
}
//通知公告行html
function getTzggTrHtml(num,item){
	var cor="";
	var ly="";
	if("G"==item.ly){
		cor="cor ctrl2";
		ly="国税";
	}else if("D"==item.ly){
		cor="ctrl2";
		ly="地税";
	}else if("GD"==item.ly){
		cor="cor1 ctrl2";
		ly="国地";
	}
	var liclass="";
	if("N"==item.isyd){
		liclass="bold";
		//sstzWdCount++;
	}
	
	//替换标通知题和通知日期
	item.tznr = item.tznr.replace(/@@1/, item.tzbt);
	item.tznr = item.tznr.replace(/@@2/, item.tzsj);
	
	var html="<li class=\""+liclass+"\" name='trData' id=\"tzgg_li_"+(num)+"\">";
	if(showGdsbz=="Y"){
		html+="<span class='"+cor+"'>["+ly+"]</span>";
	}else if(showGdsbz=="N"){
		//不显示
	}else{
		html+="<span class='"+cor+"'>["+ly+"]</span>";
	}
	
	
	html+="<a href=\"javascript:showTzggDetail('"+num+"','"+item.tzid+"','"+item.tzbt+"','tzgg');" 
			+"updateSSxxzt('"+item.tzid+"','"+item.ly+"','SSTZ','"+item.tzzt+"');\" title='"+item.tzbt+"'>"
			+subString(item.tzbt,60)+"</a><p>"+item.tzsj+"</p></li>";
	html += 	"<div class=\"\" style=\"display:none\" id=\"tzgg_"+(num)+"\">"
		 +			"<div class=\"news_nav\" style=\"padding:20px\">"
		 +  			"<div class=\"news_cont\" style=\"border-top: 0px dashed #ddd;padding-top: 0px;\">"+item.tznr+"</div>"
		 +  		"</div>"
		 + 		"</div>";
	return html;
}

//截取字符串
function subString(str,len){
	if(str.length>len){
		return str.substring(0,len);
	}
	return str;
}

function checkdb(obj){
	layer.alert($(obj).attr("content"), {title : "事项说明",offset: '50px',area: '600px'});
	
}

function updateDbsxZt(obj){
	var requesturl =context_path + "/xxmh/myCenterController/updateDbsxZt.do";
	$.ajax({
		type : "post",
		data : {"ysqxxid":$(obj).attr("ysqxxid"),"ly":$(obj).attr("ly"),"isRead":$(obj).attr("isRead"),"isCompleted":$(obj).attr("isCompleted")},
		url : requesturl,
		dataType : "json",
		success : function(data){
			
			if("Y" == data.isSuccess){		//更新待办事项状态成功，页面跳转
				window.open($(obj).attr("url"));
			}else{
				if(data.isRead1!=null&&data.isCompleted1!=null){
					var clzt = "";
					if(data.isRead1=="N"&&data.isCompleted1=="N"){
						clzt="未处理";
					}else if(data.isRead1=="Y"&&data.isCompleted1=="N"){
						clzt="处理中";
					}else if(data.isRead1=="Y"&&data.isCompleted1=="Y"){
						clzt="已处理";
					}
					
				if($(obj).attr("isRead")==data.isRead1&&$(obj).attr("isCompleted")==data.isCompleted1){
					layer.alert("更新待办事项状态失败", {title:"提示",icon: 5,offset:150});
				}else{
					layer.alert("该待办事项状态已发生改变，请刷新页面，当前状态为："+clzt, {title:"提示",icon: 5,offset:150});
				}
				
				}else{
					layer.alert("更新待办事项状态失败", {title:"提示",icon: 5,offset:150});
				}
				}
		},
		error: function(data){
			layer.alert("调用updateDbsxZt.do失败", {title:"提示",icon: 5,offset:150});
		}
	});
	}

//缴款状态不明提醒内容封装
function jkztbmtx(item){
	var unlockJkxx = item.txnr;
	var mxxxs = JSON.parse(unlockJkxx);

	//缴款状态不明的提醒内容拼装
	var jkxxMbStart = 	'<div id="div_unlockxx">' +
					'	<table width="100%" border="0" cellpadding="0" cellspacing="0" class="top_title">' +
					'	  <tr>' +
			  		'			<td><div class="big_title">扣款状态不明处理结果</div></td>' +
					'	  </tr>' +
					'	</table>' +
				   	'	<div class="user_box01" style="overflow-x:auto;">' +
					'		<div class="searchbox">' +
					'			<div class="searchTable">' +
					'				<table width="100%" border="0" cellspacing="0" cellpadding="0" id="unlockxxGrid">' +
					'					<tbody>' +
					'						<tr>';
		if(showGdsbz=="Y"){
			jkxxMbStart+='							<th width="60">国地标志</th>';
		}else if(showGdsbz=="N"){
			//不显示
		}else{
			jkxxMbStart+='							<th width="60">国地标志</th>';
		}
		jkxxMbStart+='							<th>税款缴纳方式</th>' +
					 '							<th>电子税票号码</th>' +
					 '							<th>扣款返回码</th>' +
					 '							<th>扣款返回信息</th>' +							
					 '						</tr>' +
					 '					</tbody>' ;
	var trs = "";
	var lyFlag = item.ly;
	for(var j in mxxxs){
		var mxxx=mxxxs[j];
		var dzsphm = mxxx["dzsphm"];
		var kkfhDm = mxxx["kkfhDm"];
		var kkfhmc = mxxx["kkfhmc"];
		var unLockType = mxxx["unLockType"];
		trs+="<tr>";
		if(showGdsbz=="Y"){
			if("D" == lyFlag){
				trs+="<td align=\"center\"><span class=\"fontcolor02\">地税</span><span class=\"fontcolor02\"></span></td>";
			}else{
				trs+="<td align=\"center\"><span class=\"fontcolor01\"></span><span class=\"fontcolor01\">国税</span></td>";
			}
		}else if(showGdsbz=="N"){
			
		}else{
			if("D" == lyFlag){
				trs+="<td align=\"center\"><span class=\"fontcolor02\">地税</span><span class=\"fontcolor02\"></span></td>";
			}else{
				trs+="<td align=\"center\"><span class=\"fontcolor01\"></span><span class=\"fontcolor01\">国税</span></td>";
			}
		}
		
		trs+="<td align=\"center\"><span name='unLockType' >"+unLockType+"</span></td>";
		trs+="<td align=\"center\"><span name='dzsphm'>"+dzsphm+"</span></td>";
		trs+="<td align=\"center\"><span name='kkfhDm'>"+kkfhDm+"</span></td>";
		trs+="<td align=\"center\"><span name='kkfhmc' >"+kkfhmc+"</span></td>";
		trs+="</tr>"
	}
	
	var jkxxMbEnd = '				</table>' +
				'			</div>   ' +
				'		</div>' +
				'	</div>' +
				'</div>' ;
		
	return jkxxMbStart + trs + jkxxMbEnd;
}


//展示通知通过详细内容
function showTzggDetail(num,tzid,tzbt,type){
	if($("#"+type+"_li_"+num).hasClass("bold")){
		$("#"+type+"_li_"+num).removeClass("bold");
		var wds = $("#"+type+"TotalCount").text();
		if(wds>0)wds=wds-1;
		$("#"+type+"TotalCount").text(wds);
		if(wds==0){
			$("#"+type+"TotalCount").hide();
		}
	}
//		window.parent.showBszmDetail(tzbt,$("#"+type+"_"+num).html().replace(/\n/g, "<br />"));
	//解决IE8显示样式问题
	window.parent.showBszmDetail(tzbt,$("#"+type+"_"+num).html());
}

function showBszmDetail(bt,content){
	//iframe层-父子操作
  index_mx=layer.open({
		type: 1,
		closeBtn: 1, //不显示关闭按钮
		area: ['800px', '450px'],
	  	title:"详细内容",
	  	content: content
	});
}

//更新涉税信息状态，提醒，通知
function updateSSxxzt(xxid,ly,xxlx,xxzt){
	if("Y"==xxzt)return;
	var requesturl = "/xxmh/myCenterController/updateSsxxZt.do";
	$.post(requesturl,{ 
		xxid:xxid,
		ly:ly,
		xxlx:xxlx
	},function(data){
		//var result = eval("("+data+")");
	});
}