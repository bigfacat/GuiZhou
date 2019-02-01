<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index_login.aspx.cs" Inherits="JlueTaxSystemGuiZhouBS.xxmh.html.index_login" %>

<!DOCTYPE html>
<html>

<head>
    <meta name="renderer" content="ie-comp"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE"/>
    <title>国家税务总局贵州省电子税务局</title>
    <link rel="stylesheet" href="/xxmh/resources4/layui/css/layui.css">
    <link rel="stylesheet" href="/xxmh/resources4//tax-font-icon/iconfont.css">
    <link rel="stylesheet" href="/xxmh/resources/css/newcss/common.css">
    <link rel="stylesheet" href="/xxmh/resources/css/newcss/addstyle.css">

    <link rel="stylesheet" href="/xxmh/resources/skin/css/qystyle.css" type="text/css"/>
    <link rel="stylesheet" href="/xxmh/resources4/layui/css/modules/layer/default/layer.css">
    <script src="/xxmh/resources/skin/js/jquery.js"></script>
    <script src="/xxmh/resources4/layui/layui.js"></script>
    <script src="/xxmh/resources4/layui/transfer.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/html5.min.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/respond.min.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/index_login.js"></script>
    <script src="/xxmh/resources/js/portal.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/golobalTitle.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/zxkf.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/goPages.js"></script>
    <script type="text/javascript" src="/xxmh/resources/js/menuUtil.js"></script>
    <script src="/xxmh/resources/js/urlLogic.js"></script>
    <script src="/xxmh/resources/js/mlog.js"></script>
    <script src="/xxmh/resources/js/loginDbtxData.js"></script>
    <script src="/xxmh/resources/js/layer-v2.2/layer/layer.js"></script>
    <style type="text/css">
        .layui-table td, .layui-table th {
            line-height: 22px;
        }
        .demo-class .layui-layer-title{
            background:#0994dc;
            color:#fff;
            border: none;
        }
        
    </style>
</head>
<body class="bodybg-1">
<!--head-->
<!--新增头部-->

<!-- <div class="headbox">
    <div class="logo"></div>
    <div class="head-right">
            <div class="head-right-user"><span id="userName"></span></div>
            <div class="head-right-menu">
                <div class="head-search" style="margin-right: 90px;">
                    <input type="text" id="keyword" name="text" placeholder="请输入关键词" class="search-input">
                    <a id="keysearch" href="#">搜索</a>
                    </div>
                <div class="head-right-btn">
                    <a href="javascript:changeCard();"><img src="/xxmh/resources/images/common/head_btn_refresh.png"><span>切换身份</span></a>
                    <a href="javascript:logout();"><img src="/xxmh/resources/images/common/head_btn_close.png"><span>退出</span></a>
                </div>
            </div>
        </div>
</div> -->
<div class="tax-head-box login-after">
    <img id="titleLogo" class="head-logo" src=""></i>
    <div class="head-main">
        <div class="head-user" id="userName"></div>
        <div class="head-right-menu">
            <div class="head-search">
                <input type="text" id="keyword" name="text" placeholder="请输入关键词" class="search-input">
                <a id="keysearch" href="#">搜索</a>
            </div>
            <div class="head-btn">
                <a href="javascript:changeCard();" class="head-btn-refresh" id="qhsfBtn" style="display:none;"><span>切换身份</span></a>
                <a href="javascript:zztsfqh();" class="head-btn-refresh" id="zztsfqhBtn" style="display:none;"><span>主管税务机关选择</span></a>
                <a href="javascript:logout();" class="head-btn-close"><span>退出</span></a>
            </div>
        </div>
    </div>
</div>
<!--新增头部结束-->

<div class="main-container pad-top layui-row">
    <!--side-->
    <div class="con-side">
        <div class="title">
            <h3>
                <img src="/xxmh/resources4/tax-images/login/login_ico1.png">常用功能
            </h3>
            <div class="title-r">
                <a id="cygnsz" href="#">设置</a>
            </div>
        </div>
        <div id="cygn" class="listcon menusDiv menusDiv-l">
            <!-- <ul>
                <li><a href="#"
                    onclick="goIndexUrl('/taxpayer/doLogin?is_client_login=1&actionType=zpdk.dkfp&cdId=631&gnDm=gndm-631&gdslxDm=3','fpgl','zzszyfpdk','','undefined');">代开增值税专用发票</a>
                </li>
                <li><a href="#"
                    onclick="goIndexUrl('/taxpayer/doLogin?is_client_login=1&actionType=lyfp&cdId=64&gnDm=gndm-64&gdslxDm=3','fpgl','fply','','undefined');">发票领用</a>
                </li>
                <li><a href="#"
                    onclick="goIndexUrl('/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb?cdId=231&gnDm=gndm-23&gdslxDm=3','sbjs','aqysb','','undefined')">按期应申报</a>
                </li>
                <li><a href="#"
                    onclick="goIndexUrl('/taxpayer/fpcy/fpcy?cdId=533&gnDm=gndm-533&gdslxDm=3','sscx','fpcy','','1')">发票查验</a>
                </li>
            </ul> -->
        </div>
        <div class="title titnbar">
            <h3>
                <img src="/xxmh/resources/images/login/login_ico2.png">套餐业务
            </h3>
        </div>
        <div class="listcon menusDiv menusDiv-l">
            <!-- <ul>
                <li><a href="#" onclick="goUrl('/sxsq-cjpt-web/biz/sxsq/hbzxdj?swsxDm=SXA011005001&gdslxDm=1')">注销登记综合办理</a></li>
                <li><a href="#">跨区域涉税事项报告</a></li>
            </ul> -->
        </div>
        <div class="title titnbar">
            <h3>
                <img src="/xxmh/resources/images/login/login_ico3.png">特色业务
            </h3>
        </div>
        <div class="listcon menusDiv menusDiv-l">
            <!-- <ul>
                <li><a href="#" onclick="goUrl('/sbzs-cjpt-web/biz/sbzs/ybnsrzzs?gdslxDm=1')">一表集成</a></li>
                <li><a href="#" onclick="goIndexUrl('','nsrhx','nsrhxgl')">纳税人画像</a></li>
            </ul> -->
        </div>
    </div>

    <!--rightcon-->
    <div class="con-rcon">
        <div class="layui-tab layui-tab-brief layui-tab-hover" lay-filter="docDemoTabBrief">
            <ul class="layui-tab-title contit">
                <li class="showtab1 layui-this">我的信息</li>
                <li class="showtab1">我要办税</li>
                <li class="showtab1">我要查询</li>
                <li class="showtab1">互动中心</li>
                <li class="showtab2">公众服务</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div class="conbox menusDiv menusDiv-r">
                       
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="conbox menusDiv menusDiv-r">
                       
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="conbox menusDiv menusDiv-r">
                        
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="conbox menusDiv menusDiv-r">
                        
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="conbox menusDiv menusDiv-r">
                        
                    </div>
                </div>
            </div>


            <div class="nexttab nexttab1">
                <div class="layui-tab layui-tab-brief layui-tab-hover">
                    <ul class="layui-tab-title contit">
                        <li class="layui-this">我的待办<span id="dbxxTotalCount" class="layui-badge" style="display: none;"></span></li>
                        <li>服务提醒<span id="sstxTotalCount" class="layui-badge" style="display: none;"></span></li>
                    </ul>
                    <div class="layui-tab-content secondcon">
                        <div class="layui-tab-item layui-show">
                            <div class="tablecon home-table-01">
                                <table id="dbxxDataList" class="layui-table" lay-even="" lay-skin="line" lay-size="lg" style="margin-top: -3px;">
                                    <colgroup>
                                        <col>
                                        <col width="220">
                                        <col width="120">
                                        <col width="120">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>事件名称</th>
                                        <th>截止日期</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                        <div class="layui-tab-item">
                            <div class="tablecon home-table-01">
                                <table id="sstxDataList" class="layui-table" lay-even="" lay-skin="line" lay-size="lg" style="margin-top: -3px;">
                                    <colgroup>
                                        <col>
                                        <col width="220">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>事件名称</th>
                                        <th>时间</th>
                                    </tr>
                                    </thead>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nexttab nexttab2" style="display:none;">
                <div class="layui-tab layui-tab-brief">
                    <div class="layui-tab-content secondcon">
                        <div class="layui-tab-item layui-show">
                            <div style="height: 270px;border:1px solid #E6E6E6;">
                                <iframe frameborder="0" style="width: 100%;height: 100%; border:none" scrolling="no"
                                        src="/resource/html/swzj/tzgg/tzggIndex.htm"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    
        </div>
        <div class="backtop">
            <ul>
                <li class="mabox"><a href="#none"><img src="/xxmh/resources/skin/images/icons/left_icons03.png"/><span>微信</span></a>
                    <div class="erweima">
                        <h3>微信二维码</h3>
                        <div class="ctrl01">
                            <img src="/xxmh/resources/skin/images/gswx.jpg" width="100" height="100"/>
                            <p>贵州国税</p>
                            <img src="/xxmh/resources/skin/images/dswx.jpg" width="100" height="100"/>
                            <p>贵州地税</p></div>
                        <div class="ctrl02"><img src="/xxmh/resources/skin/images/gswx.jpg" width="100" height="100"/>
                            <p>贵州省税务局</p></div>
                    </div>
                </li>
                <li class="mabox"><a href="#none"><img src="/xxmh/resources/skin/images/icons/left_icons01.png"/><span>微博</span></a>
                    <div class="erweima">
                        <h3>微博二维码</h3>
                        <div class="ctrl01">
                            <img src="/xxmh/resources/skin/images/gswb.jpg" width="100" height="100"/>
                            <p>贵州国税</p>
                            <img src="/xxmh/resources/skin/images/dswb.png" width="100" height="100"/>
                            <p>贵州地税</p></div>
                        <div class="ctrl02"><img src="/xxmh/resources/skin/images/gswb.jpg" width="100" height="100"/>
                            <p>贵州省税务局</p></div>
                    </div>

                </li>
                <li class="mabox">
                    <a href="#none" onclick='onclickZxkf()'>
                        <img title="在线客服" src="/xxmh/resources/skin/images/icons/left_icons06.png"/>
                    </a>
                </li>

                <!--  <li class="mabox"><a href="#none"><img src="/xxmh/resources/skin/images/icons/left_icons06.png" /><span>手机客户端</span></a>
                     <div class="erweima">
                         <h3>手机客户端</h3>
                         <img src="/xxmh/resources/skin/images/gswb.jpg" width="100" height="100" /><p>安卓版</p>
                         <img src="/xxmh/resources/skin/images/dswb.png" width="100" height="100" /><p>ios版</p>
                     </div>
                 </li> -->
                <!-- <li><a href="#none"><img src="/xxmh/resources/skin/images/icons/left_icons05.png" /><span>在线咨询</span></a></li>
                <li><a href="#none"><img src="/xxmh/resources/skin/images/icons/left_icons02.png" /><span>客服电话</span></a></li> -->
                <li><a href="#"><img src="/xxmh/resources/skin/images/icons/left_icons04.png"/><span>顶部</span></a></li>
            </ul>
        </div>

        <!-- 切换身份start -->
        <div class="win-center" id="chooseNsr" style="display: none;">
            <div class="sfxz-box">

                <div class="left-box">
                    <div class="qybs-itme">

                        <h4 class="sfxz-title"><span>企业办税</span></h4>

                        <div class="sfxz-center">

                            <div id="qysfTitle" class="sfxz-search">
                                <div class="tax-search">选择企业：
                                    <input type="text" id="qykeywords" name="qykeywords" oninput="getValue(this.value)"
                                           onpropertychange="getValue(this.value)" placeholder="请输入关键词"
                                           class="search-input">
                                    <a href="#" id="seachQy" name="seachQy">查询</a>
                                </div>
                            </div>

                            <div id="nsrzt" class="qybs-list-item">
                            </div>

                            <div class="qybs-add-btn" id="addQysf2"><img
                                    src="/xxmh/resources/images/common/icon_add.png"><span
                                    onclick="newQysf()">企业绑定</span></div>

                        </div>

                        <div class="btnbox">
                            <button id="qyjrBtn" class="layui-btn" onclick="selectQy()">企业进入</button>
                        </div>

                    </div>
                </div>


                <div class="right-box ">
                    <div class="grbs-itme">
                        <h4 class="sfxz-title"><span>个人办税</span></h4>
                        <div class="sfxz-center">
                            <!-- 没有实名  -->
                            <div id="smzTitle">
                                <div class="grbs-notice font-weak">
                                    <i class="iconfont fsicon-tanhao "></i> 暂时未实名，请先进行实名制申请
                                </div>
                            </div>

                            <div id="addSmz" class="qybs-add-btn" onclick="newSmz();"><img
                                    src="/xxmh/resources/images/common/icon_add.png"><span>实名制申请</span></div>

                            <!-- 已经实名，没有授权数据  回传标志-->
                            <div id="smzxx" class="grbs-list-item">
                                <li id="qhsf_yhmc"></li>
                                <li id="qhsf_zjlx"></li>
                                <li id="qhsf_zjhm"></li>
                                <li id="qhsf_zjyxq"></li>
                            </div>

                            <div id="selectZrrs" class="sfxz-search">
                                <div id="grsfTitle" class="tax-search">
                                    请选择个人身份
                                    <input type="text" id="grkeywords" placeholder="请输入关键词" name="grkeywords"
                                           class="search-input">
                                    <a id="seachGr" href="#">查询</a>
                                </div>
                                <div id="zrrsList" class="grbs-list-itme">
                                </div>
                            </div>

                        </div>
                        <div class="btnbox">
                            <button class="layui-btn" onclick="grsfjr();">个人进入</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--切换身份弹出框结束-->

        <!-- 主管税务机关选择 开始-->

        <div class="win-center" id="zztsfqhDiv" style="display: none;">
            <div class="sfxz-box">
                <div class="sfxz-search" style="text-align: center;">
                    <div class="tax-search">
                        请选择主管税务机关：
                        <input type="text" name="text" placeholder="请输入关键词" class="search-input">
                        <a href="javascript:seachZgswjg();" id="seachZgswjg">查询</a>
                    </div>
                </div>
            </div>
            <div class="sfxz-table">
                <form class="layui-form" lay-filter="zztIdUL">
                    <table class="layui-table">
                        <thead>
                        <tr>
                            <th style="width: 28px;">选择</th>
                            <th style="width: 185px;">主管税务所（科、分局）名称</th>
                            <th>课征主体登记类型</th>
                            <th>跨区财产税主体登记标志</th>
                            <th>外出经营活动税收管理证明编号</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody id="zztIdUL">

                        </tbody>
                    </table>
                </form>
            </div>
        </div>
        <!-- 切换身份end -->
        <!--headend-->
        <input type='hidden' id="logoutUrl" value=""/><!-- 退出登录地址 -->
        <input type='hidden' id="ssoServerAddr" value=""/><!-- 单点登录地址 -->
        <input type='hidden' id="ssoXxmhUrl" value=""/><!-- 信息门户单点登录地址 -->


        <script>
            $(document).ready(function () {
                getShowGdsbz();//获取国地税标志是否显示配置  在portal.js

                if (showGdsbz == "N") {
                    $(".ctrl01").hide();
                    $(".ctrl02").show();
                } else if (showGdsbz == "Y") {
                    $(".ctrl01").show();
                    $(".ctrl02").hide();
                } else {
                    $(".ctrl01").show();
                    $(".ctrl02").hide();
                }
                //layui加载

                layui.use('element', function () {
                    var element = layui.element;
                });
                layui.use(['jquery', 'layer'], function () {
                    var $ = layui.$, //重点处
                        layer = layui.layer;
                    $(function () {
                        var item = $("#listbox li");
                        for (var i = 0; i < item.length; i++) {
                            if (i % 2 == 0) {
                                item[i].style.backgroundColor = "#f9fafd";
                            }
                        }

                    });
                });

                //是否登录
                var checkLoginUrl = "/xxmh/portalSer/checkLogin.do";
                $.get(checkLoginUrl, {}, function (d) {
                    var isLogin = d.isLogin;
                    if (isLogin == "Y") {
                        getLoginMenus();
                        getMenu();
                        tips(d.info.nsr.dsnsrsbh);
                    } else {
                        window.location.href = "/xxmh/html/index.html";
                    }
                });

                // 绑定回车搜索
                $("#keyword").keydown(function (e) {
                    return false;
                    if (e.keyCode == 13) {
                        window.open("/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key=" + encodeURI($('#keyword').val()));
                    }
                });

                // 绑定按钮搜索
                $("#keysearch").click(function (e) {
                    return false;
                    window.open("/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key=" + encodeURI($('#keyword').val()));
                });

                //layui-tab-hover 鼠标划入切换标签
                $(".layui-tab-hover>.layui-tab-title>li").on("mouseenter", function () {
                    $(this).click();
                    /* $(this).addClass("layui-this").siblings().removeClass("layui-this");
                    $(this).parent().next().children().eq($(this).index()).addClass("layui-show").siblings().removeClass("layui-show"); */

                });
                var yjcd = getURLParameter("yjcd");
                var ejcd = getURLParameter("ejcd");
                var sjcd = getURLParameter("sjcd");
                var from = getURLParameter("from");
                if ("dzswj_qjss" == from) {
                    if (yjcd != null && yjcd != "" && ejcd != null && ejcd != "") {
                        if (yjcd == "znhd") {
                            goPage('/xxmh/html/znhd.html', 'znhd', '', '', '')
                        } else {
                            goPage('', yjcd, ejcd, '', '');
                        }
                    }
                }

            });

            function tips(nsrsbh) {
                //贵州本地begin
                var layer = layui.layer;
                var fkzt = "";
                var fxlx = "";
                var txmx = "";
                var nsrsbh = nsrsbh;
                var tipsurl = "/xxmh/portalSer/checkfxxx";
                $.ajax({
                    type: "POST",
                    url: tipsurl,
                    async: false,
                    dataType: "json",
                    data: {
                        "nsrsbh": nsrsbh
                    },
                    success: function (retData) {
                        fkzt = retData.fkzt;
                        fxlx = retData.fxlx;
                        txmx = retData.txmx;
                    },
                })
                if (fkzt == "01") {

                    if (fxlx == "01") {
                        layer.open({
                            type: 1
                            , content: '<div style="padding: 20px 20px;">' + txmx + '</div>'
                            , btn: '确定'
                            , btnAlign: 'c'
                            , shade: 0 //不显示遮罩
                            , closeBtn: 0
                            , skin: "demo-class"
                            , yes: function () {
                                layer.closeAll();
                            }
                        });
                    }
                    else {
                        layer.open({
                            type: 1
                            , id: 'tip'
                            , content: '<div style="padding: 20px 20px;">' + txmx + '</div>'
                            , btn: '确定'
                            , btnAlign: 'c'
                            , shade: 0 //不显示遮罩
                            , closeBtn: 0
                            , skin: "demo-class"
                            , yes: function () {
                                layer.closeAll();
                                logout();
                            }
                        });
                    }
                }
                //贵州本地end
            }

            //注销登录
            function logout() {
                return false;
                var logoutUrl = $("#logoutUrl").val();
                top.window.location.href = logoutUrl;//"/sso/logout?service="+encodeURIComponent(indexUrl);
            }
        </script>
        <div style="display:none">
            <iframe id="qhsfIfrm" src="" style="display:none"></iframe>
        </div><!-- 切换身份后，通知外围系统 -->
</body>
</html>