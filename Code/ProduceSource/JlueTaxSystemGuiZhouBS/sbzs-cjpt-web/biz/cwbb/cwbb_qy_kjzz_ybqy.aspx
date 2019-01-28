











<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
	<title>国家税务总局贵州省电子税务局</title>
	<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/_res_/css/abacus/main.css">
	<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/_res_/css/message/message_solid.css">
	<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/_res_/js/message/skin/default/Message.css"/>
	<script src="/sbzs-cjpt-web/resources/js/lib/jquery.min.js"></script>
	<script src="/sbzs-cjpt-web/resources4/layui/layui.js"></script>
	<script src="/sbzs-cjpt-web/abacus/_res_/js/pxsp.js"></script>
	<script src="/sbzs-cjpt-web/abacus/_res_/js/ywbm.js"></script>
	<style type="text/css">
	* {margin: 0px; padding: 0px; font-family: "微软雅黑"; list-style-type: none;}
	body {margin: 0px; padding: 0px;}
	table {border-spacing: 0px;}
	iframe {margin: 0px; padding: 0px; border-spacing: 0px; border:0px;}
	</style>
	<script type="text/javascript">
		var layer;
		layui.use('layer', function() { //独立版的layer无需执行这一句
			layer = layui.layer;
		});

		var makeTypeDefualt = 'HTML' ;
		var signType = 'ocx' ;
		var swsxDm = "";
		var jsonConfig = {"ywbm":"DEFAULT","level":"DEFAULT","rt_biz":"/cwbb/cwbb_qy_kjzz_ybqy","_id":0,"pages":[{"needHead":true,"name":"begin","needGet":true,"headPath":"/WEB-INF/_default_/begin/doHead.jsp"},{"needHead":true,"name":"form","realPath":"/WEB-INF/_default_/form/","needGet":true,"headPath":"/WEB-INF/cwbb/_default_/form/doHead.jsp"},{"needHead":true,"name":"make","realPath":"/WEB-INF/cwbb/_default_/make/","needGet":true,"headPath":"/WEB-INF/cwbb/_default_/make/doHead.jsp"},{"needHead":true,"name":"well","realPath":"/WEB-INF/cwbb/_default_/well/","needGet":true,"headPath":"/WEB-INF/cwbb/_default_/well/doHead.jsp"},{"needHead":false,"name":"xSheets","realPath":"/WEB-INF/_default_/xSheets/","needGet":true},{"needHead":false,"name":"xFormula","realPath":"/WEB-INF/_default_/xFormula/","needGet":true},{"needHead":false,"name":"xInitData","realPath":"/WEB-INF/_default_/xInitData/","needGet":true},{"needHead":false,"name":"xTempSave","realPath":"/WEB-INF/_default_/xTempSave/","needGet":true},{"needHead":false,"name":"xExportXML","needGet":true}],"framePath":"/WEB-INF/_default_/","ywmc":"依申请--缺省业务"};
		var queryString = "gos=true&gdslxDm=1&nsrsbh=91520111MA6HA38P10&skssqQ=2018-10-01&shxyDm=null&biz=null&kjzdzzDm=101&ywbm=CWBBYDY&yhid=T5H8fr5coAmV6oxzxn9vd8wW%20uNI08HO27GRpJubo3PuU49WHwqRPw==&isCwbabz=Y&sssqZ=2018-10-31&djxh=10115201010000193737&tjNd=2018&zgswskfjDm=15201110300&bbbsqDm=4&yhm=2QSPM7F//a/i6iw4L439UwZbaaJN8Vv&bzz=dzswj&skssqZ=2018-10-31&sssqQ=2018-10-01&zlbsxlDm=&tjYf=11&gsdq=152";

		var queryString = "gos=true&gdslxDm=1&nsrsbh=91520111MA6HA38P10&skssqQ=2018-10-01&shxyDm=null&biz=null&kjzdzzDm=101&ywbm=CWBBYDY&yhid=T5H8fr5coAmV6oxzxn9vd8wW%20uNI08HO27GRpJubo3PuU49WHwqRPw==&isCwbabz=Y&sssqZ=2018-10-31&djxh=10115201010000193737&tjNd=2018&zgswskfjDm=15201110300&bbbsqDm=4&yhm=2QSPM7F//a/i6iw4L439UwZbaaJN8Vv&skssqZ=2018-10-31&sssqQ=2018-10-01&zlbsxlDm=&tjYf=11&gsdq=152";

		var lcswsxDm = "";
		var pathRoot = "/sbzs-cjpt-web";
		var sybbfs1 = 0;
		var sytjbbfs1 = 0;
		var ywlx = "CWBB";
		//逾期申报入口
		var yqsbbz = "N";
		var yqsbuuid = "";
		//阻断提示和非阻断提示
		var errors = '[]' ;
		var warns = '[]' ;

		var zlpzWebContextPath = "/zlpz-cjpt-web";
        var sbzsWebContextPath = "/sbzs-cjpt-web";

        var gdslxDm = "1";
        var isGgUser = "00";
        var gdshbbz = "N";
        var ywbm = "cwbb_qy_kjzz_ybqy";
        var nsrsbh = '91520111MA6HA38P10';
        var sbbmBz = "N"
        
        var emName = "";//公司测试环境A端国地公用，此方法不可用，暂时屏蔽

        var hideBtns = 'btnExport01,btnImport01';
        var showBtns = 'btnCbzh';
        var showPxsp = 'null';
        var bbFunction = 'null';
        var spcd = "null";
        
		var cs_swsxDm = '';


		$(function(){
			setGdsBz();
		});
	</script>

</head>
<body onresize="resizeFrame()" onload="initFrame()">
    <table width="100%" height="100%">
		<tr>
			<td>
			<div class="TopHead">
				<div class="LeftPadding">
				<table class="topHeadTab" width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td><div class="HeadTitle">
								<span class="spangs" id="gdFlag"></span> <span class="spanbm" id="sbbName"></span>
							</div></td>
						<td class="areaHeadBtn" align="right">

						</td>
					</tr>
				</table>
				</div>
			</div>
			</td>
		</tr>
		<tr height="100%">
			<td vAlign="top"><iframe id="frmMain" name="frmMain" width="100%" height="100%" src="about:blank"></iframe></td>
		</tr>
	</table>
	<div id="myModa1" class="winbox fjzl" style="width:1000px;height:80%; display:none;">
		<div class="tc_tit">上传文件<a href="#" class="winclose" style="margin-left:800px;">×</a></div>
		<iframe id="fszlFrame" name="fszlFrame" class="fszlFrame" width="100%" height="90%" ></iframe>
	</div>

	<div id="myModa2" class="winbox fjzl" style="width:1000px;height:80%; display:none;">
		<div class="tc_tit">上传附注<a href="#" class="winclose" style="margin-left:500px;">×</a></div>
		<iframe id="fzzlFrame" class="fszlFrame" width="100%" height="90%" ></iframe>
	</div>
		</div>
	<div id="myModa4" class="winbox fjzl" style="width:1000px;height:80%; display:none;">
		<div class="tc_tit">导入XML<a href="#" class="winclose" style="margin-left:500px;">×</a></div>
		<iframe id="xmlFrame" class="fszlFrame" width="100%" height="90%" ></iframe>
	</div>

	<script src="/sbzs-cjpt-web/resources/js/frame/frame.js"></script>
</body>
</html>