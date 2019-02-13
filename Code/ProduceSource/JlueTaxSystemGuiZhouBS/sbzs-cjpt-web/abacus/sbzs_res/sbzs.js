/**
* 重写暂存按钮
*/
function tempSave() {
    $(top.document).find("body").mask("正在保存数据，请稍候...");
    //暂存时增加校验的逻辑
    try{
        var child = document.getElementById("frmSheet").contentWindow;
        if(typeof(child.isTempSave) === 'function'){
            if(!child.isTempSave()){
                $(top.document).find("body").unmask();
                return;
            }
        }
    }catch(e){

    }
    if(checkDIffDjxh()){//djxh不一致，不进行保存
        return;
    }

    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

    var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['djxh'] = $("#djxh").val();
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
				var url1=$("frmMain").context.URL.toString();
				parent.layer.alert("所有申报表数据暂存成功！", {
					icon : 1
				});
				
            } else {
            	var returnType = data.returnType;
		    	if(returnType&&returnType==='refresh'){
		    		var errMsg = data.errMsg;
		    		parent.layer.confirm(errMsg,{
	            		icon : 1,
	            		title:'提示',
	            		btn2noclose:1,
	            		btn : ["是","否"]
	            	},function(index){
	            		$(top.document).find("body").unmask();
	            		parent.layer.close(index);
	            		window.location.reload();
	            	});
		    		return;
		    	}else {
	                parent.layer.alert('尊敬的纳税人：暂存失败，请稍后再试！', {
	                    icon : 5
	                });
		    	}
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


/**
 * 重写保存按钮
 */
function save() {
    $(top.document).find("body").mask("正在保存数据，请稍候...");
    //暂存时增加校验的逻辑
    try{
        var child = document.getElementById("frmSheet").contentWindow;
        if(typeof(child.isTempSave) === 'function'){
            if(!child.isTempSave()){
                $(top.document).find("body").unmask();
                return;
            }
        }
    }catch(e){

    }
    if(checkDIffDjxh()){//djxh不一致，不进行保存
        return;
    }

    var regEvent = new RegEvent();
    var tips = regEvent.verifyAllNoAlert();

    if('' != tips){
        parent.layer.alert(tips, {title: "保存失败！(表格校验没通过，请检查)", icon: 5});
        $(top.document).find("body").unmask();
        return;
    }

    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

    var d = {};
    d['_query_string_'] = $("#_query_string_").val();
    d['gdslxDm'] = $("#gdslxDm").val();
    d['ysqxxid'] = $("#ysqxxid").val();
    d['nsrsbh'] = $("#nsrsbh").val();
    d['djxh'] = $("#djxh").val();
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
                parent.layer.alert("所有申报表数据保存成功！", {
                    icon: 1
                });
            } else {
                parent.layer.alert('尊敬的纳税人：保存失败，请稍后再试！', {
                    icon : 5
                });
            }
            $(top.document).find("body").unmask();
        },
        error : function() {
            $(top.document).find("body").unmask();
            parent.layer.alert('尊敬的纳税人：保存失败，请稍后再试！', {
                icon : 5
            });
        }
    });
}