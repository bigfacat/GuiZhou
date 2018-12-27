/**
 * 设置国地税标志
 */
function setGdsBz() {
    var $gdFlag = $("#gdFlag");
    if (1 === gdslxDm) {
        $gdFlag.text("国税" + emName);
    } else if (2 === gdslxDm) {
        $gdFlag.text("地税" + emName);
    } else {
        $gdFlag.text("国地");
    }
    if (isGgUser === "00") {
        $gdFlag.text("国地");
    }
    //判断是否是国地税合并，为Y则不显示国税、地税标识
    if ("N" === gdshbbz) {
        $gdFlag.text("");
        $gdFlag.removeClass();
    }
    //判断是否显示申报表名
    var sbbName = getSbbMc(ywbm);
    if (sbbmBz === "Y" && sbbName) {
        $("#sbbName").text(sbbName);
    }
    var href = window.location.href;
    if (href.indexOf("CWBB") > -1) {
        setInterval('autoSave()', 1680000);
    }
}


function openWin(url) {
    window.open(url + "&nsrsbh=" + nsrsbh + "&_bt=chreom&_st=sm,0,800,600,培训视频");
}

function resizeFrame() {
    var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    document.body.style.height = winH + "px";
    var height = $(document).height();
    autoResizeIframe("frmMain", height);
}

function loadPage(page) {
    var href = window.location.href;

    var pathname = window.location.pathname;
    if (pathname.indexOf(".") > 0) {
        pathname = pathname.substr(0, pathname.indexOf("."));
    }

    if (href.indexOf("?") > -1) {
        href = href.substr(0, href.indexOf("?"));
    }
    if (href.indexOf(";") > -1) {
        href = href.substr(0, href.indexOf(";"));
    }
    document.getElementById("frmMain").src = window.location.protocol +"//"+ window.location.host + pathname + "/" + page + "?" + queryString;
}

var index_loading;

function initFrame() {
    //提示错误信息
    if (errors != null && errors !== '' && errors !== '[]') {
        alertErrors();
        //阻断流程
        return;
    }
    //提示警告信息
    if (warns != null && warns !== '' && warns !== '[]') {
        alertWarns();
    }

    index_loading = layer.load(2, {shade: 0.3});
    window.setTimeout(function () {
        resizeFrame()
    }, 50);
    if (jsonConfig && jsonConfig.pages.length) {
        window.setTimeout(function () {
            loadPage(jsonConfig.pages[0].name)
        }, 1);
    }
}

function autoResizeIframe(frameId, customizedHeight, customizedWidth) {
    if (typeof frameId !== 'string') {
        if (frameId.frameElement && frameId.frameElement.id) {
            frameId = frameId.frameElement.id;
            //frameId error into frame window object
        } else {
            console.info("frameId error into unknow object:" + frameId);
        }
    }
    var frame = document.getElementById(frameId);
    if (frame != null && !window.opera) {
        if (frame.contentDocument && frame.contentDocument.body && frame.contentDocument.body.offsetHeight) {
            var height = frame.contentDocument.body.offsetHeight;
            if (customizedHeight) {
                height = height > customizedHeight ? height : customizedHeight;
                height -= 70;
            }
            frame.style.height = height + "px";
            frame.height = height;
            frameContentWidth = frame.contentDocument.body.offsetWidth;
        } else if (frame.Document && frame.Document.body && frame.Document.body.scrollHeight) {
            frame.style.height = frame.Document.body.scrollHeight;
            frame.height = frame.Document.body.scrollHeight;
            frameContentWidth = frame.Document.body.scrollWidth;
        } else {
            window.setTimeout("autoResizeIframe(" + frameId + "," + customizedHeight + "," + customizedWidth + ")", 50);
            return;
        }
        layer.close(index_loading);
    }
}

/**
 *   按钮控制说明
 */
function menuBtnControl(menuBtnConfig, isExporting) {
    var $areaHeadBtn = $(".areaHeadBtn");
    //1、先清空按钮
    $areaHeadBtn.html("");

    //2、再添加按鈕，按需显示按钮
    var menuBtn = "";
    if (showPxsp.indexOf(ywbm.toUpperCase()) !== -1 && bbFunction === 'tx') {
        menuBtn += spcd;
    }
    var hideBtnsSet = {};
    var arr = hideBtns.split(",");
    for (var i in arr) {
        if (arr[i] !== "") {
            hideBtnsSet[arr[i]] = 1;
        }
    }
    var showBtnsSet = {};
    arr = showBtns.split(",");
    for (var i in arr) {
        if (arr[i] !== "") {
            showBtnsSet[arr[i]] = 1;
        }
    }
    /**
     改成map 形式，避免按钮名包含，indexOf 无法正确控制按钮。
     */
    $.each(menuBtnConfig, function (name, value) {
        if ("block" === value.disp || showBtnsSet[name]) {
            //判断哪些按钮需要隐藏
            if (hideBtns != null && (hideBtnsSet[name] === undefined || showBtnsSet[name])) {
                var clas = 'btn btn06';
                if (value.isUsual && (value.isUsual === 'true' || value.isUsual === true)) {
                    clas += ' btn10';
                }
                //扣缴个税上传文件按钮要黄色显示
                if (value.sichuan && (value.sichuan === 'true' || value.sichuan === true)) {
                    clas += ' btn11';
                }
                // "下一步" 根据配置中心确定按钮名称 a by C.Q 20180327
                var btnName = value.name;
                if (name === 'btnPrepareMake' && makeTypeDefualt === 'HTML'
                    && ("SBZS" === ywlx || "SBZSB1" === ywlx || "CWBB" === ywlx || "CWBBB1" === ywlx)) {
                    btnName = '申报';
                }
                //处理带参数的方法
                var func=value.func;
                var reg = new RegExp('\"',"g");
                func = func.replace(reg,"'");
                menuBtn += '<li><a id=\"' + name + '\" class="' + clas + '\" onClick=\"javascript:window.frames[0].' + func + ';\">' + btnName + '</a></li>';
            }
        }
    });
    $areaHeadBtn.append($(menuBtn));
    $(".TopHead").show();
    resetCtrl();
}

/**
 * 清空按钮区域
 */
function cleanMeunBtn() {
    $(".areaHeadBtn").empty();
}

/**
 *获取主页面frmMain元素
 */
function loadFrmMainData() {
    return document.getElementById("frmMain");
}

/**
 * 重新加载 frmMain 的URL
 */
function loadFrmMainURL(frmURL) {
    document.getElementById("frmMain").src = frmURL;
    //获取引导页传过来的swsxDm
    var str = frmURL;
    var num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substr(0, num);
            value = arr[i].substr(num + 1);
            if (name === "swsxDm") {
                swsxDm = value;
            }
        }
    }
}

/**
 * 影藏框架头部区域
 */
function hideFrameHead() {
    $(".TopHead").hide();
}

function fszlMeunBtnShow(ysqxxid) {
    var secondLoadTag = null;
    if (typeof window.frames[0].flzlDeliver === 'function') {
        var json = window.frames[0].flzlDeliver();
        if (json.flag === "Y" && (json.params !== undefined && json.params !== "")) {
            secondLoadTag = json.params;
        }
    }
    if ($("#btnScfszl").length > 0) {
        var paraObj = queryString2Obj();
        var djxh = $("#djxh", window.frames["frmMain"].document).val() || paraObj.djxh;
        var nsrsbh = $("#nsrsbh", window.frames["frmMain"].document).val() || paraObj.nsrsbh;
        var test = $("#test", window.frames["frmMain"].document).val() || paraObj.test;
        if (cs_swsxDm === "" || cs_swsxDm == null) {//参数没有是，获取引导页传过来的swsxDm
            cs_swsxDm = swsxDm;
        }
        var param = "swsxDm=" + cs_swsxDm + "&gdslxDm=" + gdslxDm
            + "&ysqxxid=" + ysqxxid + "&djxh=" + djxh + "&lcswsxDm=" + lcswsxDm
            + "&nsrsbh=" + nsrsbh + "&test=" + test + "&secondLoadTag=" + secondLoadTag;
        if (cs_swsxDm == null || cs_swsxDm === "") {
            var index = layer.load(2, {shade: 0.3});
            layer.alert('税务事项为空', {icon: 5});
            return;
        }
        if (ysqxxid == null || ysqxxid === "") {
            var index = layer.load(2, {shade: 0.3});
            layer.alert('依申请信息为空', {icon: 5});
            return;
        }
        var btmake = $("#btnPrepareMake");
        var $fszlFrame = $("#fszlFrame").attr("src", zlpzWebContextPath + "/attachment/getDzbdFlzlList.do?" + param);
        $.ajax({
            type: "POST",
            url: zlpzWebContextPath + "/attachment/queryFszlfs.do?" + param,
            success: function (data) {
                //保存必报份数
                sybbfs1 = data.blfs;
                //保存条件报送份数
                sytjbbfs1 = data.tjblfs;
                var flzlsldiv, flzltjbssldiv;
                var jybz = data.jybz;
                //根据返回的资料份数（必传、非必传）,在附送资料按钮中显示对应的数目和颜色
                if (data.blfs > 0) {
                    flzlsldiv = '<div id="syblfs" class="temp01" style="">' + data.blfs + '</div>';
                } else if (data.tjblfs > 0) {
                    flzltjbssldiv = '<div id="syblfs" class="temp02" style="">' + data.tjblfs + '</div>';
                }
                if (flzlsldiv) {
                    $("#btnScfszl").append($(flzlsldiv));
                }
                if (flzltjbssldiv) {
                    $("#btnScfszl").append($(flzltjbssldiv));
                }
            },
            error: function () {
                layer.alert('查询附送资料份数失败', {icon: 5});
            }
        });
        //点击附送资料按钮，弹出附列资料框
        // 2018-05-05 迁移关闭按钮事件，将修改附送资料右上方红标时间迁移到attachment.js的uploadify_updateBlfs函数中
        var $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa1").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }
}

//优惠备案要求重置按钮失效不可用
function resetCtrl() {
    var urlYsquuidFlag = false; //如果浏览器中传入了依申请uuid，表单入口就是事项进度管理。
    var resetBtn = $("#btnReset");
    var str = location.href;
    var num = str.indexOf("?");
    var beforeNum = str.lastIndexOf("\/");
    var strBefore = str.substring(beforeNum + 1, num);
    var strAfter = str.substr(num + 1);
    if (strAfter.indexOf("ysqxxid") > 0) {
        urlYsquuidFlag = true;
    }
    if (urlYsquuidFlag === true
        && (strBefore === 'ssjmyhsq' || strBefore === 'ssjmyhba' || strBefore === 'qysdsyhba' || strBefore === 'zzsjzjt' || strBefore === 'ccsjmsba' || strBefore === 'sqkcba')) {
        resetBtn.prop('disabled', true);
        resetBtn.css('background-color', "#DDE0E5");
        resetBtn.css("opacity", "0.8");
        resetBtn.css("color", "#fff");
    }
}

/**
 *
 * 文件上传菜单显示
 */
function fileUploadMeunBtnShow() {
    var $fszlFrame, $winclose;
    if ($("#btnUpload").length > 0) {

        if (ywbm.toUpperCase() === "QYSDS_A_17ND") {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getQysdsA17ndUploadList.do");
        } else if ((ywbm.toUpperCase()).indexOf("HBS") > -1) {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getHbsUploadList.do");
        } else {
            $fszlFrame = $("#fszlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getUploadList.do");
        }

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa1").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

    //上传附注
    if ($("#btnScfzzl").length > 0) {
        var paraObj = queryString2Obj();
        var djxh = $("#djxh", window.frames["frmMain"].document).val() || paraObj.djxh;
        var scfzzlParm = "?sbywbm=" + ywbm + "&djxh=" + djxh + "&gdslxDm=" + gdslxDm;
        $fzzlFrame = $("#fzzlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/getCwbbUploadList.do" + scfzzlParm);

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa2").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

    if ($("#btnDrxml").length > 0) {
        $fzzlFrame = $("#xmlFrame").attr("src", sbzsWebContextPath + "/attachmentSb/openDrym.do");

        //点击附送资料按钮，弹出附列资料框
        $winclose = $(window.parent.document).find(".winclose");
        $winclose.click(function () {
            var $winbox_bg = $(window.parent.document).find(".winbox_bg");
            $winbox_bg.remove();
            $winclose.parents("#myModa4").animate({top: "-200px", opacity: "0"}, 300).fadeOut();
        });
    }

}

function autoSave() {
    eval("window.frames[0].tempSave()");
}


function closeWindow() {
    var browserName = navigator.appName;
    if (browserName === "Netscape") {
        window.opener = null;
        window.open('', '_self');
        window.close();

    } else {
        if (browserName === "Microsoft Internet Explorer") {
            window.opener = null;
            window.open('', '_self');
            window.close();
        }
    }
}

//将querystring转为obj
function queryString2Obj() {
    var paraObj = {};
    if (queryString) {
        var qs = queryString.split("&");
        for (var i = 0; i < qs.length; i++) {
            var kv = qs[i].split("=");
            if (kv[0] && kv[1]) {
                paraObj[kv[0]] = kv[1];
            }
        }
    }
    return paraObj;
}

//提示错误信息
function alertErrors() {
    var myErrors = '';
    try {
        var tempErrors = eval('(' + errors + ')');
        for (var i = 1; i <= tempErrors.length; i++) {
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
        icon: 5,
        closeBtn: 0,
        offset: '270px'
    }, function () {
        closeWindow();
    });
}

//提示警告信息
function alertWarns() {
    var myWarns = '';
    try {
        var tempWarns = eval('(' + warns + ')');
        for (var i = 1; i <= tempWarns.length; i++) {
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
        icon: 5,
        offset: '270px'
    });
    window.parent.layer.close(index);
}