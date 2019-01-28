function extMethods(mathFlag, newData, data, $scope) {
	if ("changeJmse" == mathFlag) {
		//解决bug:SNSWJ-131,提出的问题
		var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
		var ssjmxzDm=yhssbGridlb[newData].ssjmxzDm;
		var zspmDm=yhssbGridlb[newData].zspmDm;
		
		var isJmba=false;
		var jmxx=$scope.formData.qcs.initData.yhxx.jmxxGrid;
		if(jmxx&&jmxx.jmxxGridlb.length>0){//存在减免备案信息
			for(var i=0;i<jmxx.jmxxGridlb.length;i++){
				var jmbaxx=jmxx.jmxxGridlb[i];
				if(jmbaxx.zspmDm==zspmDm&&jmbaxx.ssjmxzhzDm==ssjmxzDm){
					isJmba=true;
					break;
				}
			}
		}
        if(ssjmxzDm!=null && ssjmxzDm!='' && !isJmba){
			layer.alert("您选择的减免性质没有进行税收减免优惠备案", {icon: 2});
		}
		changeJmse($scope,newData);
	}
	if ("selectYspz" == mathFlag) {
		selectYspz($scope,newData);
	}
	if ("selectHdbl" == mathFlag) {
		selectHdbl($scope,newData);
	}
}


function selectYspz($scope,newData){
	var mxxxList = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	var hdbls = $scope.formData.qcs.hdbls;
	var zspmDm = yhssbGridlb[newData].zspmDm;
	var zspmMc = '';
	for(var i = 0;i<mxxxList.length;i++){
		if(zspmDm == mxxxList[i].yspzDm){
			zspmMc = mxxxList[i].yspzMc;
			break ;
		}
	}
	var array = [];
	//这个品目已使用的比例
	var pmysyblArr = [];
	if(zspmDm == '' || zspmDm == null){
		parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdlx = '';
	}else{
		for(var i = 0;i<yhssbGridlb.length;i++){
			if(i != newData && zspmDm == yhssbGridlb[i].zspmDm){
				var hdzsHdbl = yhssbGridlb[i].hdzsHdbl;
				for(var key in hdbls){
					if(zspmDm == key){
						array = hdbls[key];
					}
				}
				if(hdzsHdbl!=null && hdzsHdbl!=""){
					pmysyblArr.push(hdzsHdbl);
				}
				var bhhdlx = "0";
				for(j=0;j<mxxxList.length;j++){
					if(zspmDm == mxxxList[j].yspzDm){
						bhhdlx = mxxxList[j].hdlx2
						break ;
					}
				}
				if(array.length <= 1 || "2"!=bhhdlx){
					layer.alert("应税凭证【"+zspmMc+"】不存在多条核定信息，不可重复选择！");
				}
			}
		}
		for(var i=0;i<mxxxList.length;i++){
			if(zspmDm == mxxxList[i].yspzDm){
				var bhhdlx = mxxxList[i].hdlx2
				parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdlx = bhhdlx;
				if(bhhdlx=='1'){
					parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 1;
				}else if(bhhdlx=='2'){
					var kybl = getKybl(pmysyblArr,array);
					if(kybl!=null){
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = kybl;
					}else{
						parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 0;
					}
				}else if(bhhdlx!='2'){
					parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].hdzsHdbl = 0;
				}
				parent.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb[newData].sysl = mxxxList[i].sysl;
				break ;
			}
		}
	}
	var bh_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].hdlx";
	parent.formulaEngine.apply(bh_jpath,"");
	
	var sysl_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].sysl";
	parent.formulaEngine.apply(sysl_jpath,"");
	
	var hdzsHdbl_jpath = "yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb["+newData+"].hdzsHdbl";
	parent.formulaEngine.apply(hdzsHdbl_jpath,"");
	
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify(document.body);
}

function selectHdbl($scope,newData){
	var mxxxList = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	var hdbls = $scope.formData.qcs.hdbls;
	var zspmDm = yhssbGridlb[newData].zspmDm;
	var zspmMc = '';
	for(var i = 0;i<mxxxList.length;i++){
		if(zspmDm == mxxxList[i].yspzDm){
			zspmMc = mxxxList[i].yspzMc;
			break ;
		}
	}
	var hdbl = yhssbGridlb[newData].hdzsHdbl;
	for(var i = 0;i<yhssbGridlb.length;i++){
		if(i != newData && zspmDm == yhssbGridlb[i].zspmDm){
			if(hdbl!=null && hdbl!="" && hdbl == yhssbGridlb[i].hdzsHdbl){
				layer.alert("应税凭证【"+zspmMc+"】,核定比例【"+yhssbGridlb[newData].hdzsHdbl+"】不能重复选择！");
				break ;
			}
		}
	}
}

function changeJmse($scope,newData){
	//设置税务事项名称
	var ssjmxzPjMc = $("#ssjmxzDm"+newData).find("span.select2-chosen").text();
	var yhssbGridlb = $scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	var ssjmxzDm = yhssbGridlb[newData].ssjmxzDm;
	//根据减免性质代码设置减免信息
	if(ssjmxzDm!=null && ssjmxzDm!=''){
		var zspmDm = yhssbGridlb[newData].zspmDm;
		var jmxxlist = $scope.formData.qcs.formContent.sbYhs.body.mxxxs.jmxxlist[zspmDm];
		if(jmxxlist!=null && jmxxlist!=undefined && jmxxlist.length>0){
			for(i=0;i<jmxxlist.length;i++){
				var jmxxObj = jmxxlist[i];
				if(ssjmxzDm==jmxxObj.dm){
					yhssbGridlb[newData].jmzlxDm = jmxxObj.jmzlxDm;
					yhssbGridlb[newData].jmsl = jmxxObj.jmsl;
					yhssbGridlb[newData].jmfd = jmxxObj.jmfd;
					yhssbGridlb[newData].jmed = jmxxObj.jmed;
					break ;
				}
			}
		}
		yhssbGridlb[newData].ssjmxzPjMc = ssjmxzPjMc;
	}else{
		yhssbGridlb[newData].jmzlxDm = '';
		yhssbGridlb[newData].jmsl = 0;
		yhssbGridlb[newData].jmfd = 0;
		yhssbGridlb[newData].jmed = 0;
		yhssbGridlb[newData].ssjmxzPjMc = '';
	}
	$scope.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb = yhssbGridlb;
	viewEngine.formApply($('#viewCtrlId'));
	viewEngine.tipsForVerify(document.body);
}

/**
 * 根据已使用的比例，返回一个可用的比例
 * */
function getKybl(pmysyblArr,allblArr){
	if(allblArr!=null && allblArr.length>0 && allblArr.length!=pmysyblArr.length){
		if(pmysyblArr==null || pmysyblArr.length<1){
			return allblArr[0];
		}
		for(i=0;i<allblArr.length;i++){
			var allblVal = allblArr[i];
			for(j=0;j<pmysyblArr.length;j++){
				var ysyblVal = pmysyblArr[j];
				if(allblVal==ysyblVal){
					break ;
				}else if(j==pmysyblArr.length-1){
					//说明allblVal还没有用到,
					return allblVal;
				}
			}
		}
	}
	return null;
	
}

