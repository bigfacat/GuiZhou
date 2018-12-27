/**
 * 印花税自动带出本期已缴税额(初始化的时候才用到)
 * @param zspmDm 征收品目代码
 * 
 * */
function yhssb_setbqyjse(zspmDm){
	var yjye = 0.00;
	var isGzsb = this.formData.qcs.initData.isGzsb;
	if(isGzsb!=null && isGzsb!=undefined && 'Y'==isGzsb){
		//更正申报时取明细信息
		var mxxx = this.formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
		if(mxxx!=null && mxxx!=undefined && mxxx.length>0){
			for(i=0;i<mxxx.length;i++){
				var mxxxObj = mxxx[i];
				if(mxxxObj!=null && mxxxObj!=undefined){
					var yeZspmDm = mxxxObj.yspzDm;
					if(zspmDm==yeZspmDm){
						yjye = ROUND(mxxxObj.bqyjse,2);
						break ;
					}
				}
			}
		}
	}else{
		//正常申报取yjxxGridlb
		var yjyelb = this.formData.qcs.initData.yhxx.yjxxGrid.yjxxGridlb;
		if(yjyelb!=null && yjyelb!=undefined && yjyelb.length>0){
			for(i=0;i<yjyelb.length;i++){
				var yjyeObj = yjyelb[i];
				if(yjyeObj!=null && yjyeObj!=undefined){
					var yeZspmDm = yjyeObj.zspmDm;
					if(zspmDm==yeZspmDm){
						yjye = ROUND(yjyeObj.yjye1,2);
						break ;
					}
				}
			}
		}
	}
	return yjye;
}

/**
 * 印花税本期已缴税额的校验
 * param
 * 
 * */
function yhssb_jybqyjse(zspmDm,bqyjse,value){
	if(zspmDm==null || zspmDm==""){
		return true;
	}
	//因为有增删行，所以要根据同一个品目合计本期已缴税额
	var pmBqyjsehj = 0;
	var yhssbGridlb = this.formData.yyssbbdxxVO.yhssb.yhssbGrid.yhssbGridlb;
	//需要返回提示语的时候使用，提示同一个品目相加的数值，如：hjTsy=10+10+10
	var hjTsy = "";
	var zspmMc = "";
	if(yhssbGridlb!=null && yhssbGridlb!=undefined && yhssbGridlb.length>0){
		for(i=0;i<yhssbGridlb.length;i++){
			var yhssbGrid = yhssbGridlb[i];
			if(yhssbGrid!=null && yhssbGrid!=undefined){
				var yeZspmDm = yhssbGrid.zspmDm;
				if(zspmDm==yeZspmDm){
					zspmMc = yhssbGrid.zspmMc;
					pmBqyjsehj = ROUND(yhssbGrid.bqyjse1+pmBqyjsehj,2);
					if(hjTsy==""){
						hjTsy = "" + pmBqyjsehj;
					}else{
						hjTsy = hjTsy + "+" + yhssbGrid.bqyjse1;
					}
				}
			}
		}
	}
	if(pmBqyjsehj<=0){
		return true;
	}
	var yjye = 0.00;
	var yjyelb = this.formData.qcs.initData.yhxx.yjxxGrid.yjxxGridlb;
	if(yjyelb!=null && yjyelb!=undefined && yjyelb.length>0){
		for(i=0;i<yjyelb.length;i++){
			var yjyeObj = yjyelb[i];
			if(yjyeObj!=null && yjyeObj!=undefined){
				var yeZspmDm = yjyeObj.zspmDm;
				if(zspmDm==yeZspmDm){
					yjye = ROUND(yjyeObj.yjye1,2);
					break ;
				}
			}
		}
	}
	if("tips"==value){
		//需要返回提示语的时候，返回字符串,否则返回true和false
		var tips = "征收品目["+zspmMc+"]的本期已缴税额合计【"+hjTsy+"】不能大于征收项目的实际预缴余额【"+yjye+"】"
		return tips;
	}
	if(yjye!=null && yjye!="" && pmBqyjsehj<=yjye){
		return true;
	}
	return false;
}

/**更正申报时计算减免税额*/
function yhsGzsb_jsJmse(zspmDm,jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl){
	var isGzsb = formData.qcs.initData.isGzsb;
	//因为初始化的时候会有动态行，所以动态行有多少个，就会调用多少次这个方法，当初始化完成之后，jmseCshJsCs将等于动态行的个数(新增的时候不会改变mxxx的个数)，
	var jmseCshJsCs = formData.qcs.jmseCshJsCs;
	var jmse = 0.00;
	if(formData.qcs.formContent.sbYhs.body.mxxxs!=null && formData.qcs.formContent.sbYhs.body.mxxxs!=undefined){
		var mxxx = formData.qcs.formContent.sbYhs.body.mxxxs.mxxx;
		if(mxxx!=null && mxxx!=undefined && mxxx.length>0 &&'Y'==isGzsb && jmseCshJsCs<mxxx.length){
			for(i=0;i<mxxx.length;i++){
				if(zspmDm!=null && zspmDm!=undefined && zspmDm==mxxx[i].yspzDm){
					jmse = mxxx[i].jmse;
					break ;
				}
			}
			formData.qcs.jmseCshJsCs = jmseCshJsCs + 1;
		}else{
			jmse = getMrjmseBySsjmxz(jmzlxDm,jsyj,bqynse,fdsl,jmfd,jmed,jmsl);
		}
	}
	return jmse;
}