/**
 * Created by Administrator on 2016-05-20.
 */
function RegEvent() {
    if(typeof RegEvent.prototype._inited === "undefined") {
        var regEvent = this;
        RegEvent.prototype.initialize = function() {
        
        };
        /**
         * 校验所有，阻断方式和询问框方式；询问框方式时传入回调函数，继续下一步回调
         */
        RegEvent.prototype.verifyAllComfirm = function(func) {
            var _variable = true;
            var index = 0;
            var _arr = [];
            var _infoVariable = true; // 提示类校验是否通过标识 true=通过 false=不通过
            var infoIndex = 0;
            var _infoArr = [];
            var _tips = "";
            var _info_tips = ""; // 提示类信息 C.Q 20170331
            var jyjgBz = "Y";
            var info2tip = $("#info2tip").val();
            var idxVariable2NoPassLocal = {};
            //暂存tips，为了去除重复
            var tempTips = [];
            if(fxsmInitData.idxVariable2NoPass !== undefined
				&& !$.isEmptyObject(fxsmInitData.idxVariable2NoPass)) {
            	// 合并集合，深度拷贝 
            	idxVariable2NoPassLocal = $.extend(true,{},fxsmInitData.idxVariable2NoPass,formulaEngine.idxVariable2NoPass);
            } else {
            	idxVariable2NoPassLocal = formulaEngine.idxVariable2NoPass;
            }
            $.each(idxVariable2NoPassLocal, function(jpath, idxVariable2NoPass) {
            	var _subscript = null;
                if(jpath.indexOf('[')>-1 && jpath.indexOf(']')>jpath.indexOf('[')){
                	_subscript = jpath.substring(jpath.indexOf('[')+1,jpath.indexOf(']'));
                }
                // 若校验不通过的公式中既有error又有info，则先提示error，info暂不提示。
                $.each(idxVariable2NoPass, function(id,FormulaObject) {
                    if(id === "idx"){
                        _subscript = FormulaObject;
                        return;
                    }
                	// 若info2tip设置为0，即info级别不提示，则跳过 A by C.Q 20170213
                	if((!info2tip || info2tip === '0') && FormulaObject.tipType === 'info') {
                		return true; // 下一循环相当于continue
                	} else if (info2tip === '1' && FormulaObject.tipType === 'info') {
                		if(!_variable) {
                			return true; // 下一循环相当于continue
                		}
                		if($.inArray(id, _infoArr) === -1) {
                            if(infoIndex < 3) {
                            	_info_tips += formulaEngine.textSubstitution(FormulaObject.tips,_subscript)+"<br/>";
                            	_infoArr.push(id);
                            	infoIndex++;
                            }
                        }
                		_infoVariable = false;
                		return true;// 下一循环相当于continue
                	}
                    //TODO 后续对校验不通过附表做提示，单元格的在切换附表时会自行检查
                    if($.inArray(id, _arr) === -1) {
                        if(index < 3) {
                        	var isSame = false;
                        	//把提示信息存到tempTips
                        	for(var i = 0; i < tempTips.length; i++){
                        		if(tempTips[i] === FormulaObject.tips){
                        			isSame = true;
                        			break;
                        		}
                        	}
                        	if(!isSame){
                        		tempTips.push(FormulaObject.tips);
	                        	_tips += formulaEngine.textSubstitution(FormulaObject.tips,_subscript)+"<br/>";
	                            _arr.push(id);
	                            index++;
                        	}
                        }
                    }
                    _variable = false;
                });
                
            });
            if(!_variable) {
            	window.parent.layer.alert(_tips, {title: "表格存在填写错误的数据，请检查", icon: 5});
            	jyjgBz = "N";
            }
         // 校验不通过时，修改ysqxxvo.jyjgBz
        	$.ajax({
        		type : "POST",
        		url : location.protocol + "//" + location.host + window.contextPath+"/jyxx/updateJyxx.do?gdslxDm=" + $("#gdslxDm").val()
        				+ "&ysqxxid=" + $("#ysqxxid").val() 
        				+ "&jyjgBz=" + jyjgBz ,
        		dataType : "json",
        		contentType : "text/json",
        		async: false,
        		data : encodeURIComponent(_tips),
        		success : function(data) {
        		},
        		error : function() {
        		}
        	});
            // 强制类校验通过，提示类校验不通过时非阻断提示 C.Q 20170331
            if(_variable && !_infoVariable) {
            	//询问框
                window.parent.layer.confirm(_info_tips, {
                	title: "提示", 
                	icon: 0,
                	btn: ['返回修改','忽略进入下一步'] //按钮
                    , btn1:function(){
                    	//返回修改
                    	layer.close(index);// 关闭
                    }
                    , btn2: function () {
                    	//忽略进入下一步
                    	layer.close(index);
                    	func(true) ; // 重新执行
                    }
                    });
                return false;
            }
            
            return _variable;
        };
        /**
         * 校验所有
         */
        RegEvent.prototype.verifyAll = function() {
            var _variable = true;
            var index = 0;
            var _arr = [];
            var _tips = "";
            var jyjgBz = "Y";
            var idxVariable2NoPassLocal = {};
            //暂存tips，为了去除重复
            var tempTips = [];
            if(fxsmInitData.idxVariable2NoPass !== undefined && !$.isEmptyObject(fxsmInitData.idxVariable2NoPass)) {
            	// 合并集合，深度拷贝 
            	idxVariable2NoPassLocal = $.extend(true,{},fxsmInitData.idxVariable2NoPass,formulaEngine.idxVariable2NoPass);
            } else {
            	idxVariable2NoPassLocal = formulaEngine.idxVariable2NoPass;
            }
            $.each(idxVariable2NoPassLocal, function(jpath, idxVariable2NoPass) {
            	var _subscript = null;
                if(jpath.indexOf('[')>-1 && jpath.indexOf(']')>jpath.indexOf('[')){
                	_subscript = jpath.substring(jpath.indexOf('[')+1,jpath.indexOf(']'));
                }
                $.each(idxVariable2NoPass, function(id,FormulaObject) {
                    if(id === "idx"){
                        _subscript = FormulaObject;
                        return;
                    }
                	// 风险提示中非error级别不能提示，其他类型无论info还是error级别都阻断显示，A by C.Q 20170213
                	if(FormulaObject.isFxsm && FormulaObject.tipType !== 'error') {
                		return true;
                	}
                    //TODO 后续对校验不通过附表做提示，单元格的在切换附表时会自行检查
                    if($.inArray(id, _arr) === -1) {
                        if(index < 3) {
                        	var isSame = false;
                        	//把提示信息存到tempTips
                        	for(var i = 0; i < tempTips.length; i++){
                        		if(tempTips[i] === FormulaObject.tips){
                        			isSame = true;
                        			break;
                        		}
                        	}
                        	if(!isSame){
                        		tempTips.push(FormulaObject.tips);
                        		_tips += formulaEngine.textSubstitution(FormulaObject.tips,_subscript)+"<br/>";
                        		_arr.push(id);
                        		index++;
                        	}
                        }
                    }
                    _variable = false;
                });
                
            });
            if(!_variable) {
                parent.layer.alert(_tips, {title: "表格存在填写错误的数据，请检查", icon: 5});
            	jyjgBz = "N";
            }
            
          	//校验不通过时，修改ysqxxvo.jyjgBz
        	$.ajax({
        		type : "POST",
        		url : location.protocol + "//" + location.host + window.contextPath+"/jyxx/updateJyxx.do?gdslxDm=" + $("#gdslxDm").val()
        				+ "&ysqxxid=" + $("#ysqxxid").val() 
        				+ "&jyjgBz=" + jyjgBz ,
        		dataType : "json",
        		contentType : "text/json",
        		async: false,
        		data : encodeURIComponent(_tips),
        		success : function(data) {
        		},
        		error : function() {
        		}
        	});
            return _variable;
        };
        
        /**
         * 校验所有,不弹出提示
         */
        RegEvent.prototype.verifyAllNoAlert = function() {
            var _variable = true;
            var index = 0;
            var _arr = [];
            var _tips = "";
            var jyjgBz = "Y";
            var info2tip = $("#info2tip").val();
            var idxVariable2NoPassLocal = {};
            //暂存tips，为了去除重复
            var tempTips = [];
            if(fxsmInitData.idxVariable2NoPass != undefined && !$.isEmptyObject(fxsmInitData.idxVariable2NoPass)) {
            	// 合并集合，深度拷贝 
            	idxVariable2NoPassLocal = $.extend(true,{},fxsmInitData.idxVariable2NoPass,formulaEngine.idxVariable2NoPass);
            } else {
            	idxVariable2NoPassLocal = formulaEngine.idxVariable2NoPass;
            }
            $.each(formulaEngine.idxVariable2NoPass, function(jpath, idxVariable2NoPass) {
            	var _subscript = null;
                if(jpath.indexOf('[')>-1 && jpath.indexOf(']')>jpath.indexOf('[')){
                	_subscript = jpath.substring(jpath.indexOf('[')+1,jpath.indexOf(']'));
                }
                $.each(idxVariable2NoPass, function(id,FormulaObject) {
                    if(id === "idx"){
                        _subscript = FormulaObject;
                        return;
                    }
                	// 风险提示中非error级别不能提示，其他类型无论info还是error级别都阻断显示，A by C.Q 20170213
                	if((!info2tip || info2tip === '0')  && FormulaObject.tipType !== 'error') {
                		return true;
                	}
                    //TODO 后续对校验不通过附表做提示，单元格的在切换附表时会自行检查
                    if($.inArray(id, _arr) === -1) {
                        if(index < 3) {
                        	var isSame = false;
                        	//把提示信息存到tempTips
                        	for(var i = 0; i < tempTips.length; i++){
                        		if(tempTips[i] === FormulaObject.tips){
                        			isSame = true;
                        			break;
                        		}
                        	}
                        	if(!isSame){
	                        	tempTips.push(FormulaObject.tips);
	                        	_tips += formulaEngine.textSubstitution(FormulaObject.tips,_subscript)+"<br/>";
	                        	_arr.push(id);
	                        	index++;
                        	}
                        }
                    }
                    _variable = false;
                });
                
            });
            if(!_variable) {
            	//校验不通过是，修改ysqxxvo.jyjgBz
            	jyjgBz = "N";
            }
            $.ajax({
        		type : "POST",
        		url : location.protocol + "//" + location.host + window.contextPath+"/jyxx/updateJyxx.do?gdslxDm=" + $("#gdslxDm").val()
        				+ "&ysqxxid=" + $("#ysqxxid").val() 
        				+ "&jyjgBz=" + jyjgBz,
        		dataType : "json",
        		contentType : "text/json",
        		data : encodeURIComponent(_tips),
        		async: false,
        		success : function(data) {
        		},
        		error : function() {
        		}
        	});
            return _tips;
        };
        
        /**
         * 校验单个附表
         */
        RegEvent.prototype.verifySingleForm = function(formPath) {
            var _variable = true;
            var index = 0;
            var _arr = [];
            var _tips = "";
            var jyjgBz = "Y";
            //暂存tips，为了去除重复
            var tempTips = [];
            var idxVariable2NoPassLocal = formulaEngine.idxVariable2NoPass;
            $.each(idxVariable2NoPassLocal, function(jpath, idxVariable2NoPass) {
            	var _subscript = [];
            	if(formPath === undefined||formPath==null||formPath===""||jpath.indexOf(formPath)!==0){
            		return true;
            	}
                while(jpath.indexOf('[')>-1 && jpath.indexOf(']')>jpath.indexOf('[')){
                	_subscript.push(jpath.substring(jpath.indexOf('[')+1,jpath.indexOf(']')));
                	jpath=jpath.substring(jpath.indexOf(']')+1);                	               
                }
                $.each(idxVariable2NoPass, function(id,FormulaObject) {
                    if(id === "idx"){
                        _subscript = FormulaObject;
                        return;
                    }
                	// 风险提示中非error级别不能提示，其他类型无论info还是error级别都阻断显示，A by C.Q 20170213
                	if(FormulaObject.isFxsm && FormulaObject.tipType !== 'error') {
                		return true;
                	}
                    //TODO 后续对校验不通过附表做提示，单元格的在切换附表时会自行检查
                    if($.inArray(id, _arr) === -1) {
                        if(index < 3) {
                        	var isSame = false;
                        	//把提示信息存到tempTips
                        	for(var i = 0; i < tempTips.length; i++){
                        		if(tempTips[i] === FormulaObject.tips){
                        			isSame = true;
                        			break;
                        		}
                        	}
                        	if(!isSame){
                        		tempTips.push(FormulaObject.tips);
                        		_tips += formulaEngine.textSubstitution(FormulaObject.tips,_subscript)+"<br/>";
                        		_arr.push(id);
                        		index++;
                        	}
                        }
                    }
                    _variable = false;
                });
                
            });
            if(!_variable) {
                parent.layer.alert(_tips, {title: "表格存在填写错误的数据，请检查", icon: 5});
            	jyjgBz = "N";
            }
            
          	//校验不通过时，修改ysqxxvo.jyjgBz
        	$.ajax({
        		type : "POST",
        		url : location.protocol + "//" + location.host + window.contextPath+"/jyxx/updateJyxx.do?gdslxDm=" + $("#gdslxDm").val()
        				+ "&ysqxxid=" + $("#ysqxxid").val() 
        				+ "&jyjgBz=" + jyjgBz ,
        		dataType : "json",
        		contentType : "text/json",
        		async: false,
        		data : encodeURIComponent(_tips),
        		success : function(data) {
        		},
        		error : function() {
        		}
        	});
            return _variable;
        };
        
        /**
         * 申报后刷新父窗口
         */
        RegEvent.prototype.refreshOpener = function() {
            if (window.opener !== undefined && typeof(eval(window.opener.cx)) === "function") {
                window.opener.cx();
            }
        }
        
    }
}
var regEvent;
$(function() {
    regEvent = new RegEvent();
    regEvent.initialize();
});