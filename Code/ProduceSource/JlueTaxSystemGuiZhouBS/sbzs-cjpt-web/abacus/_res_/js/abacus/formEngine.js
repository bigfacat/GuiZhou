/**
 * Created by Administrator on 2016-05-07.
 */
// 定义全局变量
var formData;
var otherParams;  //用于存储其他参数的数组
var formCT = {}; //Code-tables
var flagDataLoaded = false;
var flagExecuteInitial = true;//execute initialize formula flag
var formulaEngine;
var formulaEngineJb; //减少附表前对应的初始化报文
var formulaCalculates;
var formEngine;
var fxsmInitData;
var tbsmUrl;
// 低版本IE兼容性处理：控制台日志记录器。
if (!window.console) {
    console = { log : function(){} };
}
var formulaExecType = ''; //1=实时监控，初始化报文中返回otherData；0=事中监控，初始化报文中不返回otherData；2或其他=非实时非事中监控，初始化报文中不返回otherData
var info2tip;//提交表单时提醒类是否需要提示：1=提示；0=不提示
var showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'}; // 默认公式提示显示右上角，风险扫描提示显示至填表说明栏
var serverTime;   //获取时间

//业务中台自动化测试标志
var flagYwztAutoTest = false;

/**
 * 表单引擎，负责管理整个表单框架的表单列表管理、数据访问管理、规则库管理等。
 */
function FormEngine(){

	var _start_ = new Date().getTime();
	FormEngine.prototype._start_ = _start_;
	console.log("INFO:"+_start_ + " 进入链接时间");
    /**
     * Constant. 常量定义.
     */
	FormEngine.prototype.URL_GET_SHEET_LIST = "xSheets";
    FormEngine.prototype.URL_GET_RULE_BASE = "xFormula";
    FormEngine.prototype.URL_GET_FORM_DATA = "xInitData";
    /**
     * All CSS for sheet. 表单所需要的样式表.
     * select2样式需放table前面，解决csgj选择框选择后文字过长显示问题CSGJ-1093 CSGJ-1071
     */
    FormEngine.prototype.viewCss = [ 
        "/abacus/resources4/tax-module/selectPage/selectpage.css",
	    "/abacus/resources4/tax-module/select2/select2.css",
	    "/abacus/_res_/css/message/message_solid.css",
	    "/abacus/resources4/tax-module/taxReturns/table.css",
        "/abacus/resources4/layui/css/layui.css",
	    "/resources/css/zTreeStyle/zTreeStyle.css"];
    
    /**
     * All JS for signBtn. 签名按钮所需的js文件.
     */
    FormEngine.prototype.wztsignJs = [ 
        "/abacus/resources/js/sign/wangzhengtong/cert.js",     
        "/abacus/resources/js/sign/wangzhengtong/commVar.js",   
        "/abacus/resources/js/sign/wangzhengtong/NetcaPKI.js",
        "/abacus/_res_/js/abacus/wztsign.js"];
    
    FormEngine.prototype.ocxsignJs = [ 
        "/resources/js/jquery.base64.js",
        "/abacus/_res_/js/abacus/zjsign.js"];
    
    FormEngine.prototype.fjocxsignJs = [ 
		"/abacus/_res_/js/abacus/fjzjsign.js"];
    
    FormEngine.prototype.bwsignJs = [ 
		"/abacus/_res_/js/abacus/bwsign.js",
		"/abacus/resources/js/sign/bw/bwsignapi.js"];//ca驱动供应商提供的js签章api
    
    FormEngine.prototype.yunnansignJs = [
        "/resources/js/jquery.base64.js",
         "/abacus/_res_/js/abacus/ynsign.js",
         "/resources/js/sign/yunnan/YNCAWebClient.js"];
    
    this.lstSheets = [];

    // Declare function
    if (typeof FormEngine._inited === "undefined") {

        /**
         * PUBLIC: FormEngine initialization, should be called after create. PUBLIC: 表单引擎初始化，应在对象创建后即进行调用.
         * PUBLIC: FormEngine initialization, should be called after create.
		 * PUBLIC: 表单引擎初始化，应在对象创建后即进行调用.
         */
        FormEngine.prototype.initialize = function() {
        	var _this = this;
            if(true === flagFormDebuging) {
                dhtmlx.message("表单引擎启动...", "info", 2000);
            }
            window.parent.layer.load(2,{shade: 0.3});
            // 1、装载左侧表单数据列表。
            _this.loadSheetList(this.URL_GET_SHEET_LIST, jsonParams);

            // 2、加载初始化数据和公式，并启动执行公式引擎
            // getJSON 参数相同时不会请求后台数据，增加随机参数
            jsonParams['_random'] = Math.random();
            jsonParams['_bizReq_path_'] = $("#_bizReq_path_").val();
            var async = _this.Load4YwztBz();
            if(!async){
            	jsonParams['dzbdbmList'] = $("#dzbdbmList").val();
            }
            jsonParams['_guideParam'] = $("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录
            _this.loadInitDataAndFormulas(jsonParams);

            // 3、注册IFrame事件，监听并动态注入JS脚本文件。
            _this.listenFrameSheet();
		};

        /**
         * 加载初始化数据和公式，并启动执行公式引擎。（异步加载，加载initData和formulas没有依赖关系）
         */
        FormEngine.prototype.loadInitDataAndFormulas = function(jsonParams){
            var _this = this;
            var isQysds_a_17nd = $("#ywbm").val()==='qysds_a_17nd' && navigator.appName === "Microsoft Internet Explorer"
                && (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE8.0"
                    ||  navigator.appVersion .split(";")[1].replace(/[ ]/g,"")==="MSIE7.0");
            var getRulesMethod = {};
            // 解决使用getJSON获取公式时IE8报"脚本运行停止"，改用ajax的text方式获取 A by C.Q 20180327
            if(isQysds_a_17nd){
                $.ajax({
                    type : "GET",
                    async: false,
                    url : this.URL_GET_RULE_BASE,
                    data: jsonParams,
                    dataType : "text",
                    success: function(data) {
                        //formulaCalculates = data;
                        formulaCalculates = eval('(' + data + ')');
                    }
                });

            } else {
                getRulesMethod = $.getJSON(this.URL_GET_RULE_BASE, jsonParams);
            }

            var _start_ = new Date().getTime();
            $.when($.getJSON(this.URL_GET_FORM_DATA, jsonParams),
                getRulesMethod).then(function(datas, rules) {
                formData = datas[0];
                var _end_ = new Date().getTime();
                console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms xFormula、xInitData");
                // 获取时间
                serverTime = formData.serverTime;
                // 2018-07-03 将formData=formData.body会使ysqxxid丢失，保存到此变量
                var formData_ysqxxid = null;
                if (formData&&formData.otherParams) {
                    otherParams = formData.otherParams;
                    if ("string" === typeof otherParams) {
                        otherParams = jQuery.parseJSON(otherParams);
                    }
                    //判断signType的值，判断是否加载签章的js到主页面
                    var signType = '';
                    if(typeof otherParams !== 'undefined' && otherParams !=="" && otherParams !=null){
                        if(typeof otherParams.signType !== 'undefined'){
                            signType = otherParams.signType;
                        }
                        if(signType === 'wzt'){//容器框签名
                            for (var i = 0; i < formEngine.wztsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.wztsignJs[i]);
                            }
                        }else if(signType === 'ocx'){//ocx插件签名
                            for (var i = 0; i < formEngine.ocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.ocxsignJs[i]);
                            }
                        }else if(signType === 'fjocx'){
                            for (var i = 0; i < formEngine.fjocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.fjocxsignJs[i]);
                            }
                        }else if(signType === 'bw'){
                            for (var i = 0; i < formEngine.bwsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.bwsignJs[i]);
                            }
                        }else if(signType === 'yunnan'){
                            for (var i = 0; i < formEngine.yunnansignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.yunnansignJs[i]);
                            }
                        }
                    }
                }

                if("undefined" !== typeof formData.returnFlag && "N" === formData.returnFlag) {

                    //附税免申报弹窗提示
                    if(formData.warnInfo.code==="msb"){
                        if ("undefined" !== typeof formData.body&&"undefined" !== typeof formData.flagExecuteInitial&&formData.flagExecuteInitial===true) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                            //设置依申请信息ID
                            $("#ysqxxid").val(formData.ysqxxid);
                            $("#showTipsType").val(formData.showTipsType);  // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                            try {
                                if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                    showTipsType = eval('('+formData.showTipsType+')');
                                }
                            } catch(e){
                                showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                            }
                            formulaExecType = formData.formulaExecType;
                            $("#formulaExecType").val(formulaExecType);
                            info2tip = formData.info2tip;
                            $("#info2tip").val(info2tip);
                            formData_ysqxxid = formData.ysqxxid;
                            formData = formData.body;
                            if ("string" === typeof formData) {
                                formData = jQuery.parseJSON(formData);
                            }
                            if (!isQysds_a_17nd) {
                                formulaCalculates = rules[0];
                            }
                            _ms_ = new Date().getTime() - _start_;
                            if(true === flagFormDebuging) {
                                dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                            }
                            //拿到ysqxxid，此时才能与附列资料集成
                            (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                            (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                            window.parent.layer.closeAll('loading');
                            layer.confirm(datas[0].warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                        }else{
                            window.parent.layer.closeAll('loading');
                            layer.confirm(datas[0].warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    }else{
                        if(typeof(formData.warnInfo) !== "undefined" && formData.warnInfo.msg !=="" && formData.warnInfo.msg!=null){
                            //流程阻断提示
                            var index = window.parent.layer.load(2,{shade: 0.3});
                            window.parent.layer.alert(formData.warnInfo.msg, {icon: 0, title:'提示'}, function(index) {
                                _this.closeWindow();
                            });
                            return;
                        }
                    }
                }else {
                    if(typeof(formData.warnInfo) !== "undefined" &&
                        typeof(formData.warnInfo.msg) !== "undefined" && formData.warnInfo.msg !==""
                        && formData.warnInfo.msg!=null){
                        //提醒类提示
                        var index = window.parent.layer.load(2,{shade: 0.3});
                        window.parent.layer.alert(formData.warnInfo.msg);
                        window.parent.layer.close(index);
                    }
                    if ("undefined" !== typeof formData.body) {
                        if("undefined" !== typeof formData.flagExecuteInitial) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                        }

                        //设置依申请信息ID
                        $("#ysqxxid").val(formData.ysqxxid);
                        formEngine.replaceYsqxxid(formData.ysqxxid); // 若queryString中ysqxxid与此不同，则替换成此
                        $("#showTipsType").val(formData.showTipsType); // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                        try {
                            if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                showTipsType = eval('('+formData.showTipsType+')');
                            }
                        } catch(e){
                            showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                        }
                        formulaExecType = formData.formulaExecType;
                        $("#formulaExecType").val(formulaExecType);
                        info2tip = formData.info2tip;
                        $("#info2tip").val(info2tip);
                        formData_ysqxxid = formData.ysqxxid;
                        formData = formData.body;
                        //拿到ysqxxid，此时才能与附列资料集成
                    }
                    if ("string" === typeof formData) {
                        formData = jQuery.parseJSON(formData);
                    }
                    (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                    (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                }
                if (!isQysds_a_17nd) {
                    formulaCalculates = rules[0];
                }
                _ms_ = new Date().getTime() - _start_;
                if(true === flagFormDebuging) {
                    dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                }
            },function(aa){
                if( typeof commonError500Callback === "function"){
                    if(commonError500Callback(window.parent.layer,aa)){
                        return;
                    }
                }
                var closeFlag = false;
                if (aa.responseText.indexOf("closeFlag") !== -1) {
                    closeFlag = true;
                }
                window.parent.layer.open({
                    type:1,
                    area:['840px','420px'],
                    content:aa.responseText,
                    cancel: function(){
                        if (closeFlag) {
                            if (navigator.userAgent.indexOf("Firefox") > 0) {
                                // Firefox浏览器
                                window.parent.location.href = 'about:blank';
                                window.parent.close();
                            } else if (navigator.userAgent.indexOf("Chrome") > 0) {
                                // 谷歌浏览器
                                window.parent.location.href = 'about:blank';
                                window.parent.close();
                            } else {
                                // IE浏览器、360浏览器
                                window.parent.open('', '_top');
                                window.top.close();
                            }
                        }
                    }
                });
                return;
            }).then(function(){
                var _start_formula_ = new Date().getTime();
                // Init formula engine.
                formulaEngine = new FormulaEngine();

                //初始定制公式暂无公式
                if(formulaCalculates){
                    if(formulaCalculates.length > 0){
                        //对公式引擎执行的异常进行捕获
                        try {
                            formulaEngine.loadFormulas(formulaCalculates);
                            formulaEngine.initialize("formData");

                            if(otherParams && otherParams.jsfb ){
                                formulaEngineJb = new FormulaEngine();
                                formulaEngineJb.loadFormulas(formulaCalculates);
                                otherParams.formDataJb = jQuery.parseJSON(otherParams.formDataJb);
                                formulaEngineJb.initialize4Jb("otherParams.formDataJb");
                            }
                        } catch (e) {
                            // 公式执行报错的flag，提供给静默申报使用
                            flagExcuted = false;
                            flagExcutedError = "" + e;
                            throw "" + flagExcutedError;
                        }
                    }

                    var _ms_ = new Date().getTime() - _start_formula_;
                    if(true === flagFormDebuging) {
                        dhtmlx.message("公式引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                    }
                }

                try{
                    if('true' === $("#fxsm").val()) {
                        fxsmInitData.loadThirdIV2NoPass(); // 加载风险扫描提示  A by C.Q 20170213
                    }
                }catch(e){
                    console.log(e);
                }
            }).done(function(){
                flagDataLoaded = true;
                var _ms_ = new Date().getTime() - _start_;
                if(true === flagFormDebuging) {
                    dhtmlx.message("表单引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                }
                window.parent.layer.closeAll("loading");
            });
        };

        /**
         * 加载初始化数据和公式，并启动执行公式引擎。（同步加载，加载initData和formulas没有依赖关系）
         */
        FormEngine.prototype.loadInitDataAndFormulasSync = function(jsonParams){
            var _this = this;

            var _start_ = new Date().getTime();
            console.log("INFO:"+_start_ +" xFormula、xInitData请求开始时间");
            $.ajax({
                url: _this.URL_GET_FORM_DATA,
                dataType: 'json',
                data: jsonParams,
                success: function(data) {

                    // 解析formData
                    if(!_this.jxFormData(data)){
                        return;
                    }

                    // 加载公式
                    $.ajax({
                        url: _this.URL_GET_RULE_BASE,
                        dataType: 'json',
                        data: jsonParams,
                        success: function (result) {
                            formulaCalculates = result;
                            var _ms_ = new Date().getTime() - _start_;
                            if (true === flagFormDebuging) {
                            dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                            }

                            var _start_formula_ = new Date().getTime();
                            // Init formula engine.
                            formulaEngine = new FormulaEngine();

                            //初始定制公式暂无公式
                            if (formulaCalculates) {
                                if (formulaCalculates.length > 0) {
                                    //对公式引擎执行的异常进行捕获

                                    formulaEngine.loadFormulas(formulaCalculates);
                                    formulaEngine.initialize("formData");

                                    if (otherParams && otherParams.jsfb) {
                                        formulaEngineJb = new FormulaEngine();
                                        formulaEngineJb.loadFormulas(formulaCalculates);
                                        otherParams.formDataJb = jQuery.parseJSON(otherParams.formDataJb);
                                        formulaEngineJb.initialize4Jb("otherParams.formDataJb");
                                    }

                                }

                                _ms_ = new Date().getTime() - _start_formula_;
                                if (true === flagFormDebuging) {
                                    dhtmlx.message("公式引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                                }
                            }

                            try {
                                if ('true' === $("#fxsm").val()) {
                                    fxsmInitData.loadThirdIV2NoPass(); // 加载风险扫描提示  A by C.Q 20170213
                                }
                            } catch (e) {
                                console.log(e);
                            }

                            flagDataLoaded = true;
                            _ms_ = new Date().getTime() - _start_;
                            if (true === flagFormDebuging) {
                                dhtmlx.message("表单引擎初始化完毕 , " + _ms_ + "ms", "info", 2000);
                            }
                            window.parent.layer.closeAll("loading");
                        },
                        error: function(result) {
                            if (typeof commonError500Callback === "function") {
                                if (commonError500Callback(window.parent.layer, result)) {
                                    return;
                                }
                            }
                            var closeFlag = false;
                            if (result.responseText.indexOf("closeFlag") !== -1) {
                                closeFlag = true;
                            }
                            window.parent.layer.open({
                                type: 1,
                                area: ['840px', '420px'],
                                content: result.responseText,
                                cancel: function () {
                                    if (closeFlag) {
                                        _this.closeWindow();
                                    }
                                }
                            });
                        }
                    });
                },
                error:function(result) {
                    if (typeof commonError500Callback === "function") {
                        if (commonError500Callback(window.parent.layer, result)) {
                            return;
                        }
                    }
                    var closeFlag = false;
                    if (result.responseText.indexOf("closeFlag") !== -1) {
                        closeFlag = true;
                    }
                    window.parent.layer.open({
                        type: 1,
                        area: ['840px', '420px'],
                        content: result.responseText,
                        cancel: function () {
                            if (closeFlag) {
                                _this.closeWindow();
                            }
                        }
                    });
                }
            });
        };
        /**
         * 监听表单装载成功的事件，即IFrame的#frmSheet的onLoad()事件，然后动态注入所需资源. 依赖[IFRAME id="frmSheet" name="frmSheet"]
         */
        FormEngine.prototype.listenFrameSheet = function(){
            $("#frmSheet").load(function(event){
            	//TODO 如果加载的页面为空（偶尔会出现加载不到内容的情况,此处为补偿措施），则重新加载
            	var frame = document.getElementById("frmSheet");
                var domDocument = frame.contentWindow.document.body;
                var $dom = $(domDocument);
                // 蒙层
                var html = "<div id=\"maskFrmSheet\" style=\"position: absolute; width: 100%; height: 100%; top: 0px; background-color: #EEEEEE; z-index: 999; opacity: 0.75;overflow: hidden; \"></div>"
                    + "<div id=\"marqueeFrmSheet\" style=\"position: absolute; width: 100%; height: 100%; top: 45%; color: black; z-index: 9999; opacity: 1; overflow: hidden; text-align: center;font-family: '宋体'; font-size: 16px;\"><b>正在加载表单...</b></div></td>";
                $dom.append(html);
                $dom.css({ "overflow" : "hidden" });
                // 动态注入<script>和<link>
                var useLoad=$("#frmSheet").attr("useLoad");
                if (formEngine&&useLoad!=="N") {
                    var delay = 50;
                    // 注入CSS，也即<link>标签
                    for (var i = 0; i < formEngine.viewCss.length; i++) {
                        formEngine.loadCss4Sheet(formEngine.viewCss[i]);
                    }
                    formEngine.loadScript4Sheet("/abacus/_res_/js/abacus/viewInit.js");
                } else {
                    console.log("Object formEngine not ready.");
                }
            });
        };
        
        FormEngine.prototype.appendToHead = function(domDocument, elem){
            var temp = domDocument.getElementsByTagName("head");
            if (temp && temp.length > 0) {
                temp[0].appendChild(elem);
            } else {
                dhtmlx.message("动态增加头部信息节点失败, 无法获取 HEAD 节点 ", "error", 5000);
            }
        };
        /**
         * 装载表单所需要的样式表.
         * @param urlViewCss 样式表文件的URL
         */
        FormEngine.prototype.loadCss4Sheet = function(urlViewCss){
        	var _start_ = new Date().getTime();
            var frame = document.getElementById("frmSheet");
            var domDocument = frame.contentWindow.document;
            var oCss = document.createElement("link");
            oCss.type = "text/css";
            oCss.rel = "stylesheet";
            oCss.href = pathRoot + urlViewCss;
            this.appendToHead(domDocument, oCss);
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewCss);
        };
        /**
         * 装载表单所需要的脚本文件.
         * @param urlViewScript 脚本文件的URL
         */
        FormEngine.prototype.loadScript4Sheet = function(urlViewScript){
        	var _start_ = new Date().getTime();

        	var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = pathRoot + urlViewScript;
            var frame = document.getElementById("frmSheet");
            
            if(frame!=null && frame.contentWindow!=null){
            	var domDocument = frame.contentWindow.document;
                this.appendToHead(domDocument, oScript);
            }
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewScript);
        };
        
        
        FormEngine.prototype.loadScript4head = function(urlViewScript){
        	var _start_ = new Date().getTime();
        	var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = pathRoot + urlViewScript;
            var oHead = document.getElementsByTagName("head").item(0);

            if(oHead!=null){
            	oHead.appendChild(oScript);
            }
            var _end_ = new Date().getTime();
            console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 加载:"+urlViewScript);
        };
        /**
         * 装载表单列表信息.
         */
        FormEngine.prototype.loadSheetList = function(urlFormList, jsonParams){
            var _this = this;
            var _start_ = new Date().getTime();

            var formEngine = this;
            jsonParams['_random'] = Math.random();
            var async = _this.Load4YwztBz();
            $.ajax({
        		url : urlFormList,
        		dataType : "json",
        		async: async,
        		data : jsonParams,
                success : function(data, status, xhr){
                    var _end_ = new Date().getTime();
                    console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms xSheets");

                    if (status === "success") {
            			if(data.length===1){
            				var $menu = $(".MenuNormal .SheetMenu");
            		        var menuWidth = $menu.width();
                            $menu.fadeOut();
            	            $(".MenuNormal .close_btn span").text(">");
            	            var rightEditW = $(window).width() - $(".TableMain").width();
            	            $(".DEV .RightEdit").width(rightEditW - 4);
            	            closebtn++;
            			}
                        _this.lstSheets = data;
                        _this.showSheetList();


                        if(true === flagFormDebuging) {
                            dhtmlx.message("主附表清单加载完毕, " + _ms_ + "ms", "info", 2000);
                        }
                        //设置dzbdbmLists
                        var dzbdbms="";
                        for(var i=0; i<data.length;i++){
                			dzbdbms += data[i].dzbdbm + "---";
                        }
                        $("#dzbdbmList").val(dzbdbms);
                        
                        formEngine.bindEvents4vSheetlist(); // 附表加载完成后增加click事件 A by C.Q 20170210
                    } else {
                        if(true === flagFormDebuging) {
                            dhtmlx.message("主附表清单加载失败.", "error", 5000);
                        }
                        console.log("FormlistLoader: Error while loading: " + xhr.status + ": "
                            + xhr.statusText);
                    }
                    if (formEngine.lstSheets.length > 0) {
                        var jqFrmSheet = $("#frmSheet");
                        if (jqFrmSheet.length) {
                        	if('true' === $("#fxsm").val()) {
                        		 var divSheetlist = $("#divSheetlist");
                        		 var toFbid = $("#fbid").val();
                        		 var sheetName; 
                        		 if (toFbid != null && toFbid !== '') {
                        			 for(var index in formEngine.lstSheets){
                            			 sheetName = formEngine.lstSheets[index].name;
                            			 if(sheetName != null && sheetName !== '' && sheetName.substr(0,toFbid.length) === toFbid) {
                             				jqFrmSheet.attr("src", formEngine.lstSheets[index].url);
                                      		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                                      		formEngine.getTbsmData(formEngine.lstSheets[index].url);
                                      		divSheetlist.find("li:not(.active)").first().removeClass("current_selected_BD");
                                      		divSheetlist.find("li:eq("+index+")").addClass("current_selected_BD");
                                      		break;
                             			 }
                            		 }
                        		 }
                        		 
                        		 if(!jqFrmSheet.attr("src")) {
                        			 jqFrmSheet.attr("src", formEngine.lstSheets[0].url);
                             		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                             		formEngine.getTbsmData(formEngine.lstSheets[0].url);
                        		 }
                        	} else {
    							if(typeof automaticloadingSheet === "function"){
    								automaticloadingSheet(formEngine.lstSheets);
    							}else{
    								jqFrmSheet.attr("src", formEngine.lstSheets[0].url);
    							}
                        		// 装载第一张表的时候查询填表说明数据 A by C.Q 20170210
                        		formEngine.getTbsmData(formEngine.lstSheets[0].url);
                        	}
                        }  
                    }    
                },
            	error :function(xhr, msg, err) {
                    var status = (xhr.status === "200") ? msg : xhr.status;
                    console.log("Loading sheet list fail with [" + status + "]\n----"
                        + xhr.responseText);
                    if(true === flagFormDebuging) {
                        dhtmlx.message("加载表清单失败 [" + status + "] " + err, "error", 5000);
                    }
            	}
        	});
            
        };
        /**
         *  判断url中的ywzt是否为Y
         */
        FormEngine.prototype.Load4YwztBz = function(){
	        //获取ywzt信息，如果为Y，则设置为同步执行
	        var querystr = "{"+$("#_query_string_").val()+"}";
	        var async = true;
	        if(typeof querystr !== 'undefined' && querystr !=="" && querystr !=null){
	        	 var obj = JSON.parse(querystr);
	             if("Y"===obj.ywzt){
                     async = false;

                     if("true"===obj.test){
                         //url 中同时含有test=true和ywzt=Y 即为业务中台自动化测试
                         flagYwztAutoTest = true;
                     }
	             }
	        }  
	        return async;
        };
        
        /**
         * 主附表下的a标签赋予点击事件，点击时从服务器获取填表说明数据 A by C.Q 20170210
         */
        FormEngine.prototype.bindEvents4vSheetlist = function(){
            var _this = this;

            var $frmSheet = $("#frmSheet");

            var $divSheetlist = $("#divSheetlist");
        	if ($divSheetlist.length) {
                $divSheetlist.find("a").each(function(){
    	            //注册事件
    	            $(this).on({ "click" : function(){
    	            	//修改src属性
                        $frmSheet.attr("src", $(this).attr("href"));
    	            	// 获取填表说明数据
                        _this.getTbsmData($(this).attr("href"));
    	            } });
        		});
        	}

            var $uiStepSheetlist = $("#uiStepSheetlist");
        	if ($uiStepSheetlist.length) {
        		var uiStepSheet=$($uiStepSheetlist.find(".ui-step-item-num")[0]);
        		uiStepSheet.on({ "click" : function(){
	            	//修改src属性
					parent.closeWin();

                    $frmSheet.attr("src", $(this).attr("url"));
                    $frmSheet.attr("xh", $(this).attr("xh"));
	            } });
        	}
    		
        };
        /**
         * 替换querystring中的ysqxxid为最新的 A by C.Q 20170929
         */
        FormEngine.prototype.replaceYsqxxid = function(ysqxxid){
    		var querystr = $("#_query_string_").val();
    		if (querystr=== '' || querystr==null) {
    			return;
    		}
    		// 判断qs中是否有ysqxxid
    		var regexYsq = /ysqxxid\":\"[0-9a-zA-Z]{32}/g;
    		var isHasSameYsq = false; // querystr中ysqxxid与传入是否有相同
    		var isReplace = false; // 是否需要替换,不同则替换
    		var oldysqid;
    		
    		var resultNode;
    		do
			{
				resultNode = regexYsq.exec(querystr);
				if(resultNode != null) {
					if(resultNode[0] === ('ysqxxid\":\"'+ysqxxid)) {
						isHasSameYsq = true;
						isReplace = false;
						break;
					} 
					if(!isHasSameYsq){
						isReplace = true;
						oldysqid = resultNode[0];
					}
				}
			} while (resultNode!=null) ;
    		
    		if(!isHasSameYsq && isReplace) {
    			querystr = querystr.replace(oldysqid,'ysqxxid\":\"'+ysqxxid);
    			$("#_query_string_").val(querystr);
    		}
    		 
        };
        
        /**
         * 获取填表说明数据 A by C.Q 20170210
         */
        FormEngine.prototype.getTbsmData = function(url){
        	// 先清空填表说明内容
        	if (typeof formDebuging === "undefined") {
        		tbsmUrl = url;
        		setTimeout(function() {
        			formEngine.getTbsmData(tbsmUrl);
        		}, 100);
        	} else {
	        	formDebuging.TBSM_JSON = {};
	        	formDebuging.setShowTbsmValues('','','');
	        	// 由_bizReq_path_和当前页面文件名组成urlkey作为保存至mongodb的模块唯一键
	        	// 例：当前请求连接为http://localhost:8080/sbzs-cjpt-web/biz/sbzs/xgmzzs/form/xgmzzs_BDA0610535.html，取到sbzs/xgmzzs/form/xgmzzs_BDA0610535.html作为urlkey存入数据库
	        	var urlkey = formEngine.getUrlkey(url); // 保存至数据库作为此模块唯一key
	        	var _start_ = new Date().getTime();

	        	var urlExtractTbsm = formDebuging.URL_EXTRACT_TBSM + "?gdslxDm=" + jsonParams["gdslxDm"] + "&urlkey="+urlkey;
	        	$.ajax({
	        		type : "POST",
	        		url : urlExtractTbsm,
	        		dataType : "json",
	                success : function(data) {
	                    formDebuging.TBSM_JSON = eval('('+data+')');
	        			
	                    var _end_ = new Date().getTime();
	                    console.log("INFO:"+_start_+"-"+_end_+"-"+(_end_ - _start_)+"ms 填表说明请求");
	        		}
	        	});
        	}
        };
        /**
         * 根据当前请求url + lstSheets的url来获取urlkey，作为当前页面唯一标识符 A by C.Q
         */
        FormEngine.prototype.getUrlkey = function(url){
        	// 如http://localhost:8080/sbzs-cjpt-web/biz/sbzs/xgmzzs，则取得到'/sbzs/xgmzzs'
        	return "/"+_bizReq_path_ + "/" + url;
        };
        /**
         * 显示表单列表信息在界面左侧，依赖[DIV id="divSheetlist"]
         */
        FormEngine.prototype.showSheetList = function(){
            var sheets = this.lstSheets;
            var divSheetlist = $("#divSheetlist");
			var divStepSheet = $(".table-step-item");
            if (divSheetlist.length) {
                var html = "";
                var sheet;
                var $ywbm = $("#ywbm");
                for ( var i = 0; i< sheets.length; i++) {
                    sheet = sheets[i];
                    if($ywbm.val()==='qysds_a_17nd'||$ywbm.val()==='qysds_a_18yjd'){
                    	 var reg = /\.a\d{6}/g;	//以a开始,数字结束
                         var result = reg.exec(sheet.bdsxmc);                         
                         sheet.bdsxmc=result!=null?sheet.bdsxmc.replace(result[0],result[0].toUpperCase()):sheet.bdsxmc;
                    }
                    html += "<li><a target=\"frmSheet\" style=\"display: inline-block;width: 100%;\" title=\""+sheet.name.replace(/<[^>]+>/g,"")+"\"  href=\"" + sheet.url + "\" dzbdbm=\""+(sheet.dzbdbm ? sheet.dzbdbm : '')+"\" bdsxmc=\""+(sheet.bdsxmc ? sheet.bdsxmc : '')+"\">" + sheet.name + "</a>"
                	+ "<span></span>"
                    + "</li>";
                }
                divSheetlist.html(html);
                divSheetlist.find("li:not(.active)").first().addClass("current_selected_BD");
            }
            if (divStepSheet.length) {
				showStepSheetlist(sheets);
			}
        };

        FormEngine.prototype.hideMaskFrmSheet = function(sheets){
        	     	
        	var frame = document.getElementById("frmSheet");
            var domDocument = frame.contentWindow.document.body;
            //导出中，锁定右侧工作区域
            if( true === isExporting){
            	//获取 右侧工作区 左右方向滚轮的宽度			
            	var scrollWidth = domDocument.scrollWidth;
            	//获取 右侧工作区 上下方向滚轮的高度			
            	var scrollHeight = domDocument.scrollHeight;
            	//获取 id=viewCtrlId 的 div
            	var $viewCtrlId = $(window.frames["frmSheet"].document).find("#viewCtrlId");
            	//设置靠左浮动，这样就可以实现div覆盖
            	$viewCtrlId.css("float","left");
            	//添加一个id=mask的div（该div将覆盖整个右侧工作区，主要用来添加mask，代替原来在body的范围内mask，因为table和div的宽、高度可能会超出body，导致覆盖不全）
            	$viewCtrlId.after("<div id='mask'></div>");
            	//获取刚刚添加的id=mask的div对象
            	var $mask = $(window.frames["frmSheet"].document).find("#mask");
            	//用id=mask的 div 覆盖整个右侧工作区（该div是透明的）
            	$mask.css({"float":"left","width":scrollWidth,"height":scrollHeight,"position":"absolute"})
            	//锁定整个右侧工作区
            	$mask.mask(" ");
                layer.alert("您已经将申报表导出报盘进行申报，此申报表不可再次填写编辑！");
                $mask.click(function () {
                    layer.alert("您已经将申报表导出报盘进行申报，此申报表不可再次填写编辑！");
                });
            }
            window.parent.layer.closeAll('loading');
            $(domDocument).find("#maskFrmSheet").hide();
            $(domDocument).find("#marqueeFrmSheet").hide();
            $(domDocument).css({ "overflow" : "scroll" });   
        };
        FormEngine.prototype.cacheCodeTable = function(key, value) {
            formCT[key] =jQuery.extend(true, {}, value);
        };
	
		FormEngine.prototype.cloneFormData = function(scope, newData) {
            formData = jQuery.extend(true, {}, newData);
            scope.$apply();
		};
        /**
         * 核心接口业务报文
         * 对核心返回信息进一步封装
         */
        FormEngine.prototype.hxjkBizXml = function(datas) {
        	var dataXml;
        	var hxjkBizObj = {};
        	if(datas != null && datas !== "") {//当datas为空是，强制$.parseXML()会抛异常
        		try{
        			dataXml = $($.parseXML(datas));
        		}catch(e){
            		hxjkBizObj.rtn_code='10';
            		hxjkBizObj.Code='0001';
            		hxjkBizObj.Message='';
            		hxjkBizObj.Reason=datas;
            		hxjkBizObj.bizXml='';
            		return hxjkBizObj;
        		}
        		//if(!isNull(dataXml.find("taxML > rtn_code")[0])){
        		if(dataXml.find("bizResult > head > rtnCode").length>0){
        			hxjkBizObj.rtn_code=$(dataXml.find("bizResult > head > rtnCode")[0]).text();
        			hxjkBizObj.Code=$(dataXml.find("bizResult > head > rtnMsg > code")[0]).text();
        			hxjkBizObj.Message=$(dataXml.find("bizResult > head > rtnMsg > message")[0]).text();
        			hxjkBizObj.Reason=$(dataXml.find("bizResult > head > rtnMsg > reason")[0]).text();
        			hxjkBizObj.bizXml=null;
        		} else {
        			hxjkBizObj.rtn_code='0';
        			hxjkBizObj.Code='000';
        			hxjkBizObj.Message='';
        			hxjkBizObj.Reason='';
        			hxjkBizObj.bizXml=dataXml;
        		}
        	}else{//TODO formData.msg为空，认为是返回成功报文，这个得依赖消息封装
        		hxjkBizObj.rtn_code='0';
        		hxjkBizObj.Code='000';
        		hxjkBizObj.Message='';
        		hxjkBizObj.Reason='';
        		hxjkBizObj.bizXml=dataXml;
        	}
        	return hxjkBizObj;
        };

        /**
         * 解析initData
         * */
        FormEngine.prototype.jxFormData = function(data){
            var _this = this;
            formData = data;
            if (formData){
                var _end_ = new Date().getTime();
                console.log("INFO:" +_end_ +" xFormula、xInitData请求结束时间");
                var _ms_ = _end_ - _start_;
                console.log("INFO:" +_ms_+"ms xFormula、xInitData请求耗时");
                // 设置服务器时间
                serverTime = formData['serverTime'];
                // 2018-07-03 将formData=formData.body会使ysqxxid丢失，保存到此变量
                var formData_ysqxxid = null;
                if (formData.otherParams) {
                    otherParams = formData.otherParams;
                    if ("string" === typeof otherParams) {
                        otherParams = jQuery.parseJSON(otherParams);
                    }
                    //判断signType的值，判断是否加载签章的js到主页面
                    var signType = '';
                    if(typeof otherParams !== 'undefined' && otherParams !=="" && otherParams !=null){
                        if(typeof otherParams.signType !== 'undefined'){
                            signType = otherParams.signType;
                        }
                        var i = 0;
                        if(signType === 'wzt'){//容器框签名
                            for (i = 0; i < _this.wztsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.wztsignJs[i]);
                            }
                        }else if(signType === 'ocx'){//ocx插件签名
                            for (i = 0; i < _this.ocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.ocxsignJs[i]);
                            }
                        }else if(signType === 'fjocx'){
                            for (i = 0; i < _this.fjocxsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.fjocxsignJs[i]);
                            }
                        }else if(signType === 'bw'){
                            for (i = 0; i < _this.bwsignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.bwsignJs[i]);
                            }
                        }else if(signType === 'yunnan'){
                            for (i = 0; i < _this.yunnansignJs.length; i++) {
                                formEngine.loadScript4head(formEngine.yunnansignJs[i]);
                            }
                        }
                    }
                }

                if("undefined" !== typeof "N" === formData['returnFlag']) {

                    //附税免申报弹窗提示
                    if(formData.warnInfo.code==="msb"){
                        if ("undefined" !== typeof formData.body&&"undefined" !== typeof
                            formData.flagExecuteInitial&&formData.flagExecuteInitial===true) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                            //设置依申请信息ID
                            $("#ysqxxid").val(formData.ysqxxid);
                            $("#showTipsType").val(formData.showTipsType);  // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                            try {
                                if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                    showTipsType = eval('('+formData.showTipsType+')');
                                }
                            } catch(e){
                                showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                            }
                            formulaExecType = formData.formulaExecType;
                            $("#formulaExecType").val(formulaExecType);
                            info2tip = formData.info2tip;
                            $("#info2tip").val(info2tip);
                            formData_ysqxxid = formData.ysqxxid;
                            formData = formData.body;
                            if ("string" === typeof formData) {
                                formData = jQuery.parseJSON(formData);
                            }
                            _ms_ = new Date().getTime() - _start_;
                            if(true === flagFormDebuging) {
                                dhtmlx.message("数据模型装载完毕 , " + _ms_ + "ms", "info", 2000);
                            }
                            //拿到ysqxxid，此时才能与附列资料集成
                            (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                            (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                            window.parent.layer.closeAll('loading');
                            layer.confirm(formData.warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                        }else{
                            window.parent.layer.closeAll('loading');
                            layer.confirm(formData.warnInfo.msg, {icon: 0, title:'提示'}, '', function(index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    }else{
                        if(typeof(formData.warnInfo) !== "undefined" && formData.warnInfo.msg !=="" && formData.warnInfo.msg!=null){
                            //流程阻断提示
                            window.parent.layer.load(2,{shade: 0.3});
                            window.parent.layer.alert(formData.warnInfo.msg, {icon: 0, title:'提示'}, function(index) {
                                _this.closeWindow();
                            });
                            return false;
                        }
                    }
                }else {
                    if(typeof(formData.warnInfo) !== "undefined" &&
                        typeof(formData.warnInfo.msg) !== "undefined" && formData.warnInfo.msg !==""
                        && formData.warnInfo.msg!=null){
                        //提醒类提示
                        var index = window.parent.layer.load(2,{shade: 0.3});
                        window.parent.layer.alert(formData.warnInfo.msg);
                        window.parent.layer.close(index);
                    }
                    if ("undefined" !== typeof formData.body) {
                        if("undefined" !== typeof formData.flagExecuteInitial) {
                            flagExecuteInitial = formData.flagExecuteInitial;
                        }

                        //设置依申请信息ID
                        $("#ysqxxid").val(formData.ysqxxid);
                        formEngine.replaceYsqxxid(formData.ysqxxid); // 若queryString中ysqxxid与此不同，则替换成此
                        $("#showTipsType").val(formData.showTipsType); // 设置风险扫描提醒显示方式 A:提示方式 B:显示至右边栏 Added by C.Q 20170217
                        try {
                            if(typeof(formData.showTipsType) !== "undefined" && formData.showTipsType !== ''){
                                showTipsType = eval('('+formData.showTipsType+')');
                            }
                        } catch(e){
                            showTipsType = {'gs_error':'1','gs_info':'1','fxsm_error':'2','fxsm_info':'2'};
                        }
                        formulaExecType = formData.formulaExecType;
                        $("#formulaExecType").val(formulaExecType);
                        info2tip = formData.info2tip;
                        $("#info2tip").val(info2tip);
                        formData_ysqxxid = formData.ysqxxid;
                        formData = formData.body;
                        //拿到ysqxxid，此时才能与附列资料集成
                    }
                    if ("string" === typeof formData) {
                        formData = jQuery.parseJSON(formData);
                    }
                    (typeof parent.fszlMeunBtnShow === "function") && parent.fszlMeunBtnShow(formData_ysqxxid);
                    (typeof parent.fileUploadMeunBtnShow === "function") && parent.fileUploadMeunBtnShow(formData_ysqxxid);
                }
            }
            return true;
        };

        /**
         * 针对verifyForm()的校验结构，给出相应的提示
         * */
        FormEngine.prototype.verifyForm = function() {
            var _this = this;
            if (typeof errorsAndWarnsAlert !== "undefined") {
                // 个性化提示
                if (errorsAndWarnsAlert(errors, warns, 'form')) {
                    return false;
                }
            } else {
                // 阻断提示
                var i = 1;
                if (errors != null && errors !== '' && errors !== '[]') {
                    var myErrors = '';
                    try {
                        var tempErrors = eval('(' + errors + ')');
                        for (i = 1; i <= tempErrors.length; i++) {
                            if (tempErrors.length === 1) {
                                myErrors = tempErrors[0].msg;
                                break;
                            }
                            myErrors += i + "：" + tempErrors[i - 1].msg + "<br>";
                        }
                    } catch (err) {
                        myErrors = errors;
                    }
                    window.parent.layer.load(2, {shade: 0.3});
                    window.parent.layer.alert(myErrors, {
                        title:'警告',
                        icon: 5,
                        closeBtn: 0,
                        offset: '270px'
                    }, function (index) {
                        // GZDSDZSWJ-1510 页面一直卡起，误认为死机
                        _this.closeWindow();
                    });
                    return false;
                } else if (warns != null && warns !== '' && warns !== '[]') {
                    // 提醒提示
                    var myWarns = '';
                    try {
                        var tempWarns = eval('(' + warns + ')');
                        for (i = 1; i <= tempWarns.length; i++) {
                            if (tempWarns.length === 1) {
                                myWarns = tempWarns[0].msg;
                                break;
                            }
                            myWarns += i + "：" + tempWarns[i - 1].msg + "<br>";
                        }
                    } catch (err) {
                        myWarns = warns;
                    }
                    var index = window.parent.layer.load(2, {shade: 0.3});
                    window.parent.layer.alert(myWarns, {
                        title:'提醒',
                        icon: 7,
                        closeBtn: 0,
                        offset: '270px'
                    });
                    window.parent.layer.close(index);
                }
            }
            return true;
        };
        /**
         * 关闭窗口
         * */
        FormEngine.prototype.closeWindow = function() {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    window.opener = null;
                    window.close();
                } else {
                    window.open('', '_top');
                    window.top.close();
                }
            } else if (navigator.userAgent.indexOf("Firefox") > 0) {
                window.location.href = 'about:blank ';
                window.close();
            } else if (navigator.userAgent.indexOf("Chrome") > 0) {
                top.open(location, '_self').close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        };
        
        // For not to do initialization twice.
        FormEngine._inited = true;
    }
}


$(function(){
	/**
	 * 进入填表页弹框提示操作规程
	 */
	var czgcFlag = $("#czgcFlag").val(); // 全局设置
	var czgcStart = document.cookie.indexOf("czgcCookie=")===-1?-1:document.cookie.indexOf("czgcCookie=")+11;
	var czgcEnd = document.cookie.indexOf(";", czgcStart)===-1?document.cookie.length:document.cookie.indexOf(";", czgcStart);
	var czgcCookie = document.cookie.substring(czgcStart, czgcEnd);
	var sxslFlag = true;
	if (contextPath.indexOf("sxsl")>-1) {
		sxslFlag = false;
	}
	if (czgcFlag==="Y" && czgcCookie!=="N" && sxslFlag) {
		var zyywnWebContextPath = $("#zyywnWebContextPath").val();
		if(zyywnWebContextPath === null || typeof zyywnWebContextPath === 'undefined'){
			zyywnWebContextPath = "/zyywn-cjpt-web";
		}
		var czgcUrl = zyywnWebContextPath+"/czgc/queryWSDataList.do?ywbm="+$("#ywbm").val().toUpperCase();
		window.parent.layer.open({
			type : 1,
			title : "操作规程",
			id : "czgcIframe",
			zIndex : 10000,
			skin : 'layui-layer-demo', // 样式类名
			anim : 2,
			shadeClose : true, // 开启遮罩关闭
			area : ['1000px', '600px'],
			content : '<iframe src='+czgcUrl+' style="width:100%; height:95%;"></iframe>',
			success : function(layero, index) {
				var $iframe = layero.find("#czgcIframe");
				$iframe.css("padding", "0px 0px 0px 0px");
				layero.css("height", (layero.height()-60)+"px");
				var $div = layero.find(".layui-layer-btn");
				$div.append('<span style="position:absolute; left:780px; bottom: 28px;"><input type="checkbox" id="nextShowFlag"/>下次不显示</span>');
			},
			btn : ['确认'],
			yes : function(index, layero) {
				var $checkbox = layero.find("#nextShowFlag");
				if ($checkbox.attr("checked")==="checked") {
					// 往Cookies里塞czgcCookies = false;
					document.cookie = "czgcCookie="+escape("N");
				}
				window.parent.layer.close(index);
			}
		});
	}
	
    formEngine = new FormEngine();

    //1、检查Adobe Reader
    checkPDFPlugin();

    //2、针对verifyForm()的校验结果，给出相应的提示
    if(!formEngine.verifyForm()){
        return;
    }

    //3、
    fxsmInitData = new FxsmInitData();
    formEngine.loadScript4Sheet("/resources/js/lib/jquery.min.js");
    
    // 更正申报自定义回调
    if(typeof commonGzsbCallback === "function"){
    	commonGzsbCallback();
		return false;
	}

    // 联合附加税申报（专表）自定义回调
    if(typeof lhfjssbCallback === "function"){
    	lhfjssbCallback();
		return false;
	}
    
	//纳税人是否需要输入免抵税额判断
 	if($('#isInputMdse').val()==="true"){
 		$("td.areaHeadBtn", window.parent.document).hide();
        window.parent.layer.confirm('<br><table>' +
            '<tr style=\'font-size:18px\' >' +
            '<td colspan=\'2\' width=\'100%\'>&nbsp;&nbsp;&nbsp;&nbsp;生产型出口退税企业：</td>' +
            '<td>' +
            '<input type=\'radio\' name=\'sfscqy\'onclick=\'javascript:document.getElementById("mdsetr").style.visibility="visible";\' value=\'1\'/>是&nbsp;&nbsp;' +
            '<input type=\'radio\' name=\'sfscqy\' value=\'2\'onclick=\'javascript:document.getElementById("mdsetr").style.visibility="hidden";\' checked=\'checked\'/>否' +
            '</td>' +
            '</tr>' +
            '<tr id=\'mdsetr\' style=\'visibility:hidden;\'>' +
            '<td  style=\'font-size:18px\' width=\'70%\'>&nbsp;&nbsp;&nbsp;&nbsp;当期免抵税额：</td>' +
            '<td colspan=\'2\'>' +
            '<input type=\'text\' id=\'myInput\'  style=\'border:1px solid #fff;border-bottom-color:#b5b5b5;\' />' +
            '</td>' +
            '</tr>' +
            '</table>',{
            type: 1,
            area: ['420px','225px'],
            btn: ['确定'],
            title: '提示',
            yes: function (index, layero) {
                var radioValue = $(layero).find(':radio[name="sfscqy"]:checked').val();
                if (radioValue === "1") {
                    var v = $(layero).find('#myInput').val();
                    if (v === "" || v === undefined || !/(^\d+$)|(^\d+\.\d+$)/g.test(v)) {
                        window.parent.layer.alert('您输入的值无效或未输入！', {
                            title: '错误提示'
                        });
                    }
                    else {
                        window.parent.layer.load(2, {shade: 0.3});
                        $("td.areaHeadBtn", window.parent.document).show();
                        $(jsonParams).attr("mdse", v);
                        formEngine.initialize();
                        window.parent.layer.close(index);
                    }
                } else {
                    window.parent.layer.load(2, {shade: 0.3});
                    $("td.areaHeadBtn", window.parent.document).show();
                    formEngine.initialize();
                    window.parent.layer.close(index);
                }
            }
        });

   	}else{
   		window.parent.layer.load(2,{shade: 0.3});
   		formEngine.initialize();
   	} 
	
});
