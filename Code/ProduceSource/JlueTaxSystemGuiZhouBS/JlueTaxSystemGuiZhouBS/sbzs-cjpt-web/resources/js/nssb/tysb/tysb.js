var ZSXM_DM_YHS = '10111';// 印花税
var ZSPM_DM_YHS_CCZLHT = '101110105';// 财产租赁合同
var ZSXM_DM_YYS = '10103';// 营业税
var ZSXM_DM_ZZS = '10101';// 增值税
var ZSXM_DM_TDZZS = '10113';// 土地增值税
// 个税征收品目代码array
var gs_zspmDm = "['101060200', '101060300', '101060400', '101060500', '101060600', '101060701', '101060799', '101060800', '101060901', '101060902', '101060999', '101061000', '101061100', '101060100', '101060900']";
var gs_zsxmDm = '10106';
//var ValidateSbzt = true;// 校验申报状态
//var ValidateYjse = true;// 校验预缴税额
//var ValidateSbqx = false;// 校验申报期限
//var zysbbSbztValidateCount = 0; // 专用申报表申报状态校验次数
//var zysbbSbztReqXml = [];// 专用申报表申报状态查询请求报文数组
var docElemChecked = new Object();// 当前选中那行的操作对象
var fjs_zspmDm_speacl = '30203,30216,30446,10109'; // 附加税进行计算带出的品目数组配置。
var gs_zszmDm_speacl = '1010601002440031,'; // 个税子目中税率来源于税费种认定，不进行累计税率计算。
var srze_noDecimal_zspmDm = '101110400,101110599'; // 收入总额需要四舍五入到整数位的；如按件数。
var qzd_noZfs_zspm = '304460201'; // 起征点校验中不存在主附税关系的征收品目.
var qzd_noAutoMz_swjg = '253,244,262';	//配置不自动免征的税务机关；只配置到省。
var qzd_showMzMsg_result = true;		//是否免征的提示框选择结果。
var unableSbZspm = '101060200,101060300,101040001';	//配置通用申报不能申报的征收品目。
var ableSbZszm = '1010400012440200';		//配置通用申报里面可以申报的征收子目信息；
var DJZCLX_HHQY = '420,172,421,422,423,175,522';	//合伙企业登记注册类型
  
var validateTysb = {
		  calculate_tysb_row : function(nodeLeftPart) {
				
				var zsfsDm = "5";// 测试使用，暂时没来源
//				var zsfsDm = eval(nodeLeftPart + "zsfsDm");// 取出征收方式代码，后面会正对非定期定额的个税的进行处理
				var zsxmDm = nodeLeftPart.zsxmDm;
				var zspmDm = nodeLeftPart.zspmDm;
				var zszmDm =nodeLeftPart.zszmDm;
				var srze = parseFloat(nodeLeftPart.ysx);
				var kcs = parseFloat(nodeLeftPart.jcx);
				var yssdl = parseFloat(nodeLeftPart.yssdl);
				var jsyj = parseFloat(nodeLeftPart.jsfyj);
				var sl = parseFloat(nodeLeftPart.sflhdwse);
				var sskcs = parseFloat(nodeLeftPart.sskcs);
				var ynse = parseFloat(nodeLeftPart.bqynsfe);
				var jmse = parseFloat(nodeLeftPart.bqjmsfe);
				var yjse = parseFloat(nodeLeftPart.bqyjsfe);
				var ybtse = parseFloat(nodeLeftPart.bqybtsfe);
				var skssqz =  nodeLeftPart.sfkssqz;
				var hdynsjye = nodeLeftPart.hdynsjye;
				var zfsbz = nodeLeftPart.zfsbz;
				var hyDm = nodeLeftPart.hyDm;
				
				// 收入总额需要四舍五入取整数。
				if (zspmDm != '' && inArray(zspmDm, srze_noDecimal_zspmDm) >= 0) {
					srze = Math.round(srze);
					nodeLeftPart.ysx=srze;
				}
				
				// 对于税务机关核定数据的校验
				if (undefined != hdynsjye && srze < hdynsjye && zfsbz == '0' && hdynsjye > 0) {
					srze = hdynsjye;
					nodeLeftPart.ysx=srze;
					alert('收入额不能小于核定应纳税经营额！');
				}

				//当应税所得率为0或为空时默认为1
				if(yssdl == 0 || yssdl == ""  || yssdl == "undefined" || yssdl == undefined){
					nodeLeftPart.yssdl=yssdl;
					yssdl = 1;
				}
				// 计税（费）依据=(应税项-减除项)*yssdl
				jsyj = Math.round(100 * (srze - kcs) * yssdl) / 100;
				if(jsyj  <0 ){
					jsyj = 0;
				}
				
				// 调用个税计算税率和速算扣除数公式
				var json_sl_sskcs = new Array();
				if (zsfsDm.substr(0, 1) !== '4' && zsxmDm === gs_zsxmDm) {
					
					// 个税1010601002440031这个征收子目不需要根据累计税率进行计算，根据税费种认定带出。
					if (zszmDm == "" || inArray(zszmDm, gs_zszmDm_speacl) == -1) {
						
						//对于个税生产经营、承包承租经营所得，根据计税标志去进行计算。
						if(zspmDm == '101060200' || zspmDm == '101060300'){
							var gsdlHdxxArray =  validateTysb.getGrsdldlHdxx(zspmDm);
							var jsbz = '';
							var dqdeHdxxArray = validateTysb.getDqdeHdxxByZspm(zspmDm, hyDm);
							var dlhdfsbz = '0';	//定率核定方式标志：（1:在zs_hd_dqdehd_jg表中存在的数据；2 : zs_grsdsdlhd表中存在；0：两个表中都不存在）
							//先判断定期定额的表是否存在数据，如果不存在，则再去查询个税表。
							if(dqdeHdxxArray.length > 0){
								
								for(var n = 0; n < dqdeHdxxArray.length; n ++ ){
									//计税标志     1:征收率；2：应税所得率；3：所得率；5：甘肃和西藏特殊，定期定额生产经营所得个税3万以下减征，超过3万时需要减除3W进行计税
									jsbz = dqdeHdxxArray[n].jsbz;	
									if(jsbz == '1'){
										yssdl = dqdeHdxxArray[n].sl;		//计算生产经营时，把征收率传入计算公式进行计算。
									}else if(jsbz == '2' || jsbz == '3'){
										yssdl = dqdeHdxxArray[n].yssdl;
										nodeLeftPart.yssdl=yssdl;
									}else if(jsbz == '5'){
										yssdl = dqdeHdxxArray[n].sl;
									}else{
										jsbz =  '1';
										yssdl = sl;
									}
								}
								dlhdfsbz = '1';
								
							}else if(gsdlHdxxArray.length > 0){
								
								for(var m = 0; m < gsdlHdxxArray.length; m++){
									jsbz = gsdlHdxxArray[m].jsbz;	//计税标志     1:征收率；2：应税所得率；3：所得率；
									if(jsbz == '1' || jsbz == '2' || jsbz == '3'){
										yssdl = gsdlHdxxArray[m].ynssdl;
										//计税标志为2或者3时，把核心返回的所得率替换为个税认定的所得率。
										if( jsbz == '2' || jsbz == '3'){
											nodeLeftPart.yssdl=yssdl;
											if(jsbz == '3' && kcs > 0){
												alert("尊敬的纳税人，您属于按定率核定所得率方式征收，按业务规则，减除项无需填写，您填写的值将被置0，谢谢！");
												kcs = 0;
												nodeLeftPart.jcx=kcs;
											}
										}
										break;
									}else{	//如果计税标志为空，默认征收率这种方式。
										jsbz =  '1';
										yssdl = gsdlHdxxArray[m].ynssdl;
									}
								}
								dlhdfsbz = '2';
								
							}else{	//如果在个税核定表里不存在
								jsbz = '1';
								yssdl = sl;
								dlhdfsbz = '0';
							}
							var kyrq = eval("formData.qcs.initData.tysbbInitData.kyrq");
							var kzxxObj = {};
							kzxxObj.jsbz = jsbz;
							kzxxObj.dlhdfsbz = dlhdfsbz;
							nodeLeftPart.sjjyyf=nodeLeftPart.sjjyyf == '' ? calSjjyMonth(kyrq,skssqz) : nodeLeftPart.sjjyyf;
							kzxxObj.sjjyyf = nodeLeftPart.sjjyyf;
							nodeLeftPart.ysbyf=nodeLeftPart.ysbyf == '' ? calYsbMonth(kyrq,skssqz) : nodeLeftPart.ysbyf;
							kzxxObj.ysbyf = nodeLeftPart.ysbyf;
							json_sl_sskcs = calculate_gs_jsme_sl_sskcs(nodeLeftPart, zsxmDm, zspmDm,yssdl, kzxxObj);
						}else{
							json_sl_sskcs = calculate_gs_jsme_sl_sskcs(nodeLeftPart, zsxmDm, zspmDm,yssdl);
						}
						
					} else if ('1010601002440031' == zszmDm) {
						if ((sl * 1) == 0) {
							sl = 0.004;
							nodeLeftPart.sflhdwse=sl;
						}
					}
				}
				if (json_sl_sskcs.length > 0) {
					jsyj = json_sl_sskcs[0].ynssde;
					jsyj = (jsyj < 0) ? 0 : jsyj;
					sl = json_sl_sskcs[0].sl;
					sskcs = json_sl_sskcs[0].sskcs;
					ynse = json_sl_sskcs[0].ynse;
					ynse = (ynse < 0) ? 0 : ynse;
					nodeLeftPart.sflhdwse=sl;
					nodeLeftPart.sskcs=sskcs;
					if(typeof json_sl_sskcs[0].kcs != 'undefined' ){
						kcs =  json_sl_sskcs[0].kcs;
						nodeLeftPart.jcx=kcs;
					}
				}
				//计算非个税的应纳税额
				if (zsxmDm != gs_zsxmDm) {
					ynse =jsyj*sl;
				}
				jsyj = ROUND(jsyj,2);
				ynse = ROUND(ynse,2);
				jmse = ROUND(jmse,2);
				yjse = ROUND(yjse,2);
				ybtse = (ynse - jmse - yjse) < 0 ? 0.00 : (ynse - jmse - yjse);

				/* 印花税应补退税额处理*/
				if (zsxmDm == ZSXM_DM_YHS) {
					if (ynse < 0.1)
						ybtse = 0;
					if(ynse >= 0.1){
						ybtse = (ynse - jmse - yjse).toFixed(1);
					}
					if (zspmDm == ZSPM_DM_YHS_CCZLHT) {
						if (ynse >= 0.1 && ynse < 1){
							 ybtse = 1;
						}
					}
			//		ynse = ynse.toFixed(1);
				  } 
				
				nodeLeftPart.jsfyj=jsyj;
				nodeLeftPart.bqynsfe=ynse;
				nodeLeftPart.bqjmsfe=jmse;
				nodeLeftPart.bqybtsfe=ybtse;		
				
			},
	/**
	 * 根据征收品目代码获取个税所得率核定信息。
	 * @param zspmDm
	 */
	getGrsdldlHdxx : function(zspmDm){
		var hdxxArr = new Array();
		
		// 个人所得税核定信息节点路径
		var xmlDoc = $($.json2xml(formData));		
		xmlDoc.find("qcs > initData > tysbbInitData > grsdsdlHdxxGrid > grsdsdlHdxxGridlb").each(function() {
			var zspmDm_temp =  $(this).children("zspmDm").text();
			var jsbz =  ($(this).children("jsbz").text()) * 1;
			var ynssdl = $(this).children("ynssdl").text();
			if(zspmDm == zspmDm_temp && jsbz !== '' && jsbz !== null && jsbz !==  undefined 
					&& ynssdl != '' && ynssdl != '0'){
				var hdxxObj = {};
				hdxxObj['ynssdl'] =  $(this).children("ynssdl").text();
				hdxxObj['jsbz'] =  jsbz;
				hdxxArr.push(hdxxObj);	
			}
		});
		
		return hdxxArr;
	},
	
	/**
	 * 根据征收品目代码获取定期定额核定信息。
	 * @param zspmDm
	 * @param hyDm 
	 */
	getDqdeHdxxByZspm : function(zspmDm, hyDm){
		var hdxxArr = new Array();
		
		var xmlDoc = $($.json2xml(formData));
		xmlDoc.find("qcs > initData > tysbbInitData > dqdeHdxxGrid > dqdeHdxxGridlb").each(function() {
			var zspmDm_temp =  $(this).children("zspmDm").text();
			var jsbz =  ($(this).children("jsbz").text()) * 1;
			var yssdl = $(this).children("yssdl").text();
			var sl = $(this).children("sl").text();
			if( zspmDm == zspmDm_temp && jsbz !== '' && jsbz !== null && jsbz !==  undefined
					&& (((jsbz == '2' || jsbz == '3' ) && yssdl != '' && yssdl != '0') || 
							(jsbz == '1' && sl != '' && sl != '0') || (jsbz == '5' && sl != '' && sl != '0'))){
				var hdxxObj = {};
				hdxxObj['zspmDm'] =  zspmDm_temp;
				hdxxObj['sl'] =  sl;
				hdxxObj['ynse'] =  $(this).children("ynse").text();
				hdxxObj['hdse'] =  $(this).children("hdse").text();
				hdxxObj['jsyj'] =  $(this).children("jsyj").text();
				hdxxObj['ynsjye'] =  $(this).children("ynsjye").text();
				hdxxObj['yssdl'] = yssdl ;
				hdxxObj['jsbz'] =  jsbz;
				hdxxObj['hyDm'] =  $(this).children("hyDm").text();
				hdxxArr.push(hdxxObj);
			}
		});
		
		//如果定期定额核定信息里面存在多条同一品目的核定，则匹配到行业。
		if(hdxxArr.length > 1 && hyDm !== undefined && hyDm !== null && hyDm !== ""){
			for(var i = 0; i < hdxxArr.length; i ++){
				var obj = hdxxArr[i];
				if(obj.hyDm == hyDm){
					hdxxArr = [obj];
					break;
				}
			}
		}
		return hdxxArr;
	},
	
	 /**
	 * 获取通用申报减免税额
	 * 公式sbTysb.body.mxxxs.mxxx[].ynse-(sbTysb.body.mxxxs.mxxx[].jsyj*jzsl*(1-jzfd)-jzed)
	 * 
	 * @param docElem
	 * @returns
	 */
	get_tysb_jmse : function(nodeLeftPart) {		
		var jsyj = nodeLeftPart.jsfyj * 1;
		var sl = nodeLeftPart.sflhdwse * 1;
		var ynse = nodeLeftPart.bqynsfe * 1;
		var jmzlxDm =nodeLeftPart.jmzlxDm; //未知
		var jzfd = nodeLeftPart.jzfd;	//未知
		jzfd = jzfd == '' ? 0.00 : jzfd * 1;
		var jzsl = nodeLeftPart.jzsl;	//未知
		jzsl = jzsl == '' ? 0.00 : jzsl * 1;
		var jzed = nodeLeftPart.jzed;	//未知
		jzed = jzed == '' ? 0.00 : jzed * 1;

		var jmse = 0.00 ;
		var sljmje = 0.00 ;
		var flag = false;//是否非按照税率(超额累进税率的情况)计税标志
		if(ynse != Math.round(jsyj * sl * 100) / 100){//非按照税率计税的情况,此时对于税率减免和幅度减免不做减免税额计算，需要前台手工录入减免税额
			flag = true;
		}
		
		if(jmzlxDm == '02'){
			jmse = ynse ;
		}
		else if (jmzlxDm == '01'){
			if(jzed > 0){
				if(jzed > ynse){
					jmse = ynse ;
				}
				else{
					jmse = jzed ;
				}
			}
			else if(jzsl > 0 && sl > jzsl){
				sljmje = Math.round(jsyj * (sl - jzsl) * 100 ) / 100 ;
				if(sljmje > ynse ){
					jmse = ynse ;
				}
				else{
					jmse = sljmje ;
				}
				if(flag){
					jmse = 0;
				}
			}
			else if (jzfd > 0 && jzfd < 1){
				jmse = Math.round(jsyj * (1 - jzfd) * sl * 100) / 100;
				if(flag){
					jmse = 0;
				}
			}
		}
		
		return jmse ;
	},
	
	/**
	 * 取当前重复行下标
	 * @param zspm
	 * @param zszm
	 * @returns
	 */
	getCurrentRownum :function(nodeLeftPart){
		var arrayNum=0; //重复行下标
		var sbxxGridlb=validateTysb.getAllRow();
		for(var i=0;i<sbxxGridlb.length;i++){
			  if(sbxxGridlb[i].zspmDm==nodeLeftPart.zspmDm){
				  if(sbxxGridlb[i].zszmDm!=''&&sbxxGridlb[i].zszmDm==nodeLeftPart.zszmDm){
					  arrayNum=i;
					  break;
				  }else{
					  arrayNum=i; //确定是重复行下标							  
				  }
			  }
		}
		return arrayNum;
	},
	
	/**
	 * 取当前重复行
	 * @param zspm
	 * @param zszm
	 * @returns
	 */
	getCurrentRow :function(zspm,zszm){
		var arrayNum=0; //重复行下标
		var sbxxGridlb=validateTysb.getAllRow();
		for(var i=0;i<sbxxGridlb.length;i++){
			  if(sbxxGridlb[i].zspmDm==zspm){
				  if(sbxxGridlb[i].zszmDm!=''&&sbxxGridlb[i].zszmDm==zszm){
					  arrayNum=i;
					  break;
				  }else{
					  arrayNum=i; //确定是重复行下标							  
				  }
			  }
		}
		return sbxxGridlb[arrayNum];
	},
	
	/**
	 * 取指定重复行
	 * @param zspm
	 * @param zszm
	 * @returns
	 */
	getThisRow :function(i){		
		return formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb[i];
	},
	
	/**
	 * 取所有重复行
	 * @param zspm
	 * @param zszm
	 * @returns
	 */
	getAllRow :function(){		
		return formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb;
	},
	
	/***************************************************************************
	 * 获取一个属期征收项目相同的计税依据总额合计
	 * 
	 * @param {}
	 *            nodeLeftPart 节点路径      
	 * @return {} 收入总额合计金额
	 */
	getYysJsyjHj : function(nodeLeftPart) {
		var ssqq = nodeLeftPart.sfkssqq;
		var ssqz = nodeLeftPart.sfkssqz;
		var zsxmDm = nodeLeftPart.zsxmDm;

		var jsyjHj = 0;
		var nodeLeftPartPrefix =validateTysb.getAllRow();
		// 起征点信息节点路径
		var rowLength = nodeLeftPartPrefix.length;
		for ( var i = 0; i < rowLength; i++) {
			var zsxmDm_temp = nodeLeftPartPrefix[i].zsxmDm;
			var skssqq = nodeLeftPartPrefix[i].sfkssqq;
			var skssqz = nodeLeftPartPrefix[i].sfkssqz;
			if (zsxmDm == zsxmDm_temp && ssqq == skssqq && ssqz == skssqz) {
				//2015-02-11 wangfm 不能直接取nodeLeftPartPrefix[i].jsyj")。因为在填写的时候，jsyj还没有重新计算
				var srze = nodeLeftPartPrefix[i].ysx;
				var kcs = nodeLeftPartPrefix[i].jcx;
				var yssdl = nodeLeftPartPrefix[i].yssdl;
				//当应税所得率为0或为空时默认为1
				if(yssdl == 0 || yssdl == ""  || yssdl == "undefined" || yssdl == undefined){
					yssdl = 1;
				}
				// 计税（费）依据=(应税项-减除项)*yssdl
				var jsyj = Math.round(100 * (srze - kcs) * yssdl) / 100;
				if (jsyj < 0) jsyj = 0;
				jsyjHj += (jsyj / 1);
			}
		}
		return jsyjHj;
	},
	/**
	 * @param nodeLeftPart
	 *            节点路径
	 * @returns 免征额度
	 */
	getMzed : function(nodeLeftPart) {
		var mzed = 0;
		var ssqq = nodeLeftPart.sfkssqq;
		var ssqz = nodeLeftPart.sfkssqz;
		var zsxmDm = nodeLeftPart.zsxmDm;

		var _relydatanum = 0;
		// 起征点信息节点路径
		var nodeLeftPartPrefix = formData.qcs.initData.tysbbInitData.qzdMxxxs.qzdMxxx;
		var rootLeft = nodeLeftPartPrefix;
		if (typeof rootLeft !== 'undefined') {
			// 是否存在多行数据。
			if (typeof rootLeft.length !== 'undefined') {
				_relydatanum = nodeLeftPartPrefix.length;
				for ( var i = 0; i < _relydatanum; i++) {
					var qzdSsqq = nodeLeftPartPrefix[i].skssqq;
					var qzdSsqz = nodeLeftPartPrefix[i].skssqz;
					var qzdZsxmDm =nodeLeftPartPrefix[i].zsxmDm;
					if (ssqq == qzdSsqq && ssqz == qzdSsqz && zsxmDm == qzdZsxmDm) {
						var qzdje =nodeLeftPartPrefix[i].qzdje;
						var ysbje = nodeLeftPartPrefix[i].ysbje;
						mzed = qzdje - ysbje;
						return mzed;
					}
				}
			} else {
				// 1行的时候需要特殊处理
				_relydatanum = 1;
				var qzdSsqq = nodeLeftPartPrefix[0].skssqq;
				var qzdSsqz = nodeLeftPartPrefix[0].skssqz;
				var qzdZsxmDm = nodeLeftPartPrefix[0].zsxmDm;
				if (ssqq == qzdSsqq && ssqz == qzdSsqz && zsxmDm == qzdZsxmDm) {
					var qzdje = nodeLeftPartPrefix[0].qzdje;
					var ysbje = nodeLeftPartPrefix[0].ysbje;
					mzed = qzdje - ysbje;
				}
			}
		}

		return mzed;
	},

	/**
	 * @param nodeLeftPart
	 *            节点路径
	 * @returns 免征额度
	 */
	getYsbje : function(nodeLeftPart) {
		var ssqq = nodeLeftPart.sfkssqq;
		var ssqz = nodeLeftPart.sfkssqz;
		var zsxmDm = nodeLeftPart.zsxmDm;

		var _relydatanum = 0;
		// 起征点信息节点路径
		var nodeLeftPartPrefix =formData.qcs.initData.tysbbInitData.qzdMxxxs.qzdMxxx;
		var ysbje = 0;
		if (typeof nodeLeftPartPrefix !== 'undefined') {
			// 是否存在多行数据。
			if (typeof nodeLeftPartPrefix.length !== 'undefined') {
				_relydatanum = nodeLeftPartPrefix.length;
				for ( var i = 0; i < _relydatanum; i++) {
					var qzdSsqq = nodeLeftPartPrefix[i].skssqq;
					var qzdSsqz = nodeLeftPartPrefix[i].skssqz;
					var qzdZsxmDm = nodeLeftPartPrefix[i].zsxmDm;
					if (ssqq == qzdSsqq && ssqz == qzdSsqz && zsxmDm == qzdZsxmDm) {
						ysbje = nodeLeftPartPrefix[i].ysbje;
						ysbje = ysbje == undefined ? 0.00 : ysbje;
						return ysbje * 1;
					}
				}
			} else {
				// 1行的时候需要特殊处理
				_relydatanum = 1;
				var qzdSsqq = nodeLeftPartPrefix[0].skssqq;
				var qzdSsqz = nodeLeftPartPrefix[0].skssqz;
				var qzdZsxmDm =nodeLeftPartPrefix[0].zsxmDm;
				if (ssqq == qzdSsqq && ssqz == qzdSsqz && zsxmDm == qzdZsxmDm) {
					ysbje = nodeLeftPartPrefix[0].ysbje;
					ysbje = ysbje == undefined ? 0.00 : ysbje;
					return ysbje * 1;
				}
			}
		}

		return ysbje * 1;
	},
	/*
	 * 计算通用申报合计数
	 */
	calculate_tysb_hjxx : function() {
		var nodeLeftPartPrefix = validateTysb.getAllRow();
		var rowLength = nodeLeftPartPrefix.length;
		var ynseHj = 0;
		var jmseHj = 0;
		var yjseHj = 0;
		var ybtseHj = 0;
		var ynseHjYgx = 0;
		var jmseHjYgx = 0;
		var yjseHjYgx = 0;
		var ybtseHjYgx = 0;
		for ( var i = 0; i < rowLength; i++) {
			ynseHj += parseFloat(nodeLeftPartPrefix[i].bqynsfe);
			jmseHj += parseFloat(nodeLeftPartPrefix[i].bqjmsfe);
			yjseHj += parseFloat(nodeLeftPartPrefix[i].bqyjsfe);
			ybtseHj += parseFloat(nodeLeftPartPrefix[i].bqybtsfe);
			if(nodeLeftPartPrefix[i].checkedbz){
				ynseHjYgx += parseFloat(nodeLeftPartPrefix[i].bqynsfe);
				jmseHjYgx += parseFloat(nodeLeftPartPrefix[i].bqjmsfe);
				yjseHjYgx += parseFloat(nodeLeftPartPrefix[i].bqyjsfe);
				ybtseHjYgx += parseFloat(nodeLeftPartPrefix[i].bqybtsfe);
			}
			
		}
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqynsfehj=ynseHj;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqjmsfehj=jmseHj;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqyjsfehj=yjseHj;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqybtsfehj=ybtseHj;
		
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqynsfehjYgx=ynseHjYgx;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqjmsfehjYgx=jmseHjYgx;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqyjsfehjYgx=yjseHjYgx;
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.bqybtsfehjYgx=ybtseHjYgx;
	},
	
	/**
	 * 对于个税生产经营、企业承包承租，根据征收品目代码、税款所属期获取已申报金额信息。
	 * @param zspmDm
	 */
	getGsYsbjeByZspm : function(zspmDm, skssqq, skssqz){
		var xmlDoc = $($.json2xml(formData));	
		var ysbje = 0.00;
		
		xmlDoc.find("qcs > initData > tysbbInitData > sbxxGrid > sbxxGridlb").each(function() {
			var zspmDm_temp = $(this).children("zspmDm").text();
			var skssqq_temp = $(this).children("skssqq").text().substr(0,10);
			var skssqz_temp = $(this).children("skssqz").text().substr(0,10);
			if(zspmDm == zspmDm_temp && skssqq == skssqq_temp && skssqz == skssqz_temp){
				ysbje += $(this).children("yjse").text() * 1 + $(this).children("ybtse").text() * 1;
			}
		});
		
		return Math.round(100 * ysbje) /100;
	},
	
	
	
	/**
	   * 改变计税依据、减免性质时重新计算减免税额，重复行所有行都重新计算
	   */
	   tysb_jmse:function(zsxmDm,zspmDm,ssjmxzDm){
	  	  var bqjmsfe = 0;
	  	  var qzdMxxxArr = [];
	  	  var zsJsyj =formData.qcs.initData.tysbbInitData.zsJsyj;
	  	  var jsfyj =0;
	  	  var sflhdwse =0;
	  	  var bqynsfe =0;
	  	  var jmzlxDm ="";
	  	  var jmed =0;
	  	  var jmsl =0;
	  	  var jmfd =0;
	  	  var arrayNum=0;
	  	  var sbxxGridlb=formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb;
	  	  var fjsQzdxx=formData.qcs.initData.tysbbInitData.fjsQzdMxxxs.fjsQzdMxxx;
	  	  for(var i=0;i<sbxxGridlb.length;i++){
	  		  if(sbxxGridlb[i].zspmDm==zspmDm){
	  			  arrayNum=i;
	  			  jsfyj= sbxxGridlb[i].jsfyj;
	  			  sflhdwse= sbxxGridlb[i].sflhdwse;
	  			  bqynsfe= sbxxGridlb[i].bqynsfe;			 
	  			  if(ssjmxzDm==null){
	  				  sbxxGridlb[i].ssjmxzDm="";
	  				  return 0;
	  			  }
	  			  if(ssjmxzDm=="0010101401"){
	  				  jmzlxDm= "01";
	  				  jmfd= 0.000000;				  
	  				  jmed= 500.000000;
	  				  jmsl= 0.000000;
	  			  }else if(ssjmxzDm=="0010012702"){
	  				  jmzlxDm= "02";
	  				  jmfd= 0.900000;	
	  				  jmed= 0.000000;
	  				  jmsl= 0.000000;
	  			  }else{
	  				  jmzlxDm= "02";
	  				  jmfd= 0.000000;	
	  				  jmed= 0.000000;
	  				  jmsl= 0.000000;
	  			  }
	  			sbxxGridlb[i].jmzlxDm=jmzlxDm;
	  			sbxxGridlb[i].jzfd=jmfd;
	  			sbxxGridlb[i].jzed=jmed;
	  			sbxxGridlb[i].jzsl=jmsl;
	  		  }
	  	  }
	  	//获取纳服配置中起征点明细信息中的起征点信息
	  	  if(fjsQzdxx!=undefined && $.isArray(fjsQzdxx)){
	  		  for(var i=0;i<fjsQzdxx.length;i++){
	  			  qzdMxxxArr[fjsQzdxx[i].zsxmDm] = (parseFloat(fjsQzdxx[i].qzdje)-parseFloat(fjsQzdxx[i].ysbje)).toFixed(2);
	  		  }
	  	  }
	  	 
	  	  if(ssjmxzDm==""){
	  		  return 0;
	  	  }
	  	  if(qzdMxxxArr[zsxmDm+'_06']!=undefined&&zsJsyj>0){
	  		  if(zsJsyj<qzdMxxxArr[zsxmDm+'_06']){
	  			  return jsfyj*sflhdwse;			  
	  		  }else{
	  			  if(ssjmxzDm=="0099129999"){
	  				//  sbxxGridlb[arrayNum].ssjmxzDm="";
	  				  return 0;
	  			  }
	  		  }
	  	  }
	  	  if(jmzlxDm==""){
	  			bqjmsfe = 0;
	  		}else if(jmzlxDm=="02"){
	  			bqjmsfe = bqynsfe;
	  		}else{
	  			if(jmed>0){
	  				bqjmsfe = jmed > bqynsfe ? bqynsfe : jmed;
	  			}else if(jmsl>0 && sflhdwse>jmsl){
	  				bqjmsfe = jsfyj*(sflhdwse-jmsl)
	  			}else if(jmfd>0 && jmfd<1){
	  				bqjmsfe = jsfyj*(1-jmfd);
	  			}else{
	  				bqjmsfe = 0;
	  			}
	  		}
	  	  return ROUND(bqjmsfe,2);	 
	  },
	    
	    /**
	     * 改变计税依据，根据起征点信息改变减免性质
	     * @param zsJsyj
	     * @param jsfyj
	     * @param fjsQzdxx
	     * @returns
	     */
	     tysb_ssjmxzDm:function(zsxmDm,zspmDm){	  
	  	  var ssjmxzDm ="";
	  	  var qzdMxxxArr = [];	 
	  	  var zsJsyj =formData.qcs.initData.tysbbInitData.zsJsyj;
	  	  var sbxxGridlb=formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.sbxxGridlb;
	  	  var fjsQzdxx=formData.qcs.initData.tysbbInitData.fjsQzdMxxxs.fjsQzdMxxx;
	  	  for(var i=0;i<sbxxGridlb.length;i++){
	  		  if(sbxxGridlb[i].zspmDm==zspmDm){
	  			  ssjmxzDm = sbxxGridlb[i].ssjmxzDm;
	  		  }
	  	  }
	  	   	
	  	//获取纳服配置中起征点明细信息中的起征点信息
	  	  if(fjsQzdxx!=undefined && $.isArray(fjsQzdxx)){
	  		  for(var i=0;i<fjsQzdxx.length;i++){
	  			  qzdMxxxArr[fjsQzdxx[i].zsxmDm] = (parseFloat(fjsQzdxx[i].qzdje)-parseFloat(fjsQzdxx[i].ysbje)).toFixed(2);			 
	  		  }
	  	  }
	  	  //根据主税的计税依据判断起征点，未达起征点返回默认值
	  	  if(qzdMxxxArr[zsxmDm+'_06']!=undefined && zsJsyj > 0 && zsJsyj<qzdMxxxArr[zsxmDm+'_06']){
	  		  return '0099129999';
	  	  }else{
	  		  return ssjmxzDm;
	  	  }
	    }
  };
  
	

  /**
   * 计算实际经营的月份
   * @param kyrq	开业日期
   * @param tbrq	填报日期
   * @returns
   */
  function calSjjyMonth(kyrq,tbrq){
  	if(kyrq == 'undefined' || kyrq == '' || kyrq == undefined){
  		return 12;
  	}
  	var kyrqYear = kyrq.substring(0,4);
  	var tbrqYear = tbrq.substring(0,4);
  	if(tbrqYear > kyrqYear){
  		return 12;
  	}
  	return parseFloat(12 - kyrq.substring(5, 7))+1;
  }
  
  /**
   * 计算已申报月份
   * @param kyrq	开业日期
   * @param tbrq	填报日期
   * @returns
   */
  function calYsbMonth(kyrq,tbrq){
  	if(kyrq == 'undefined' || kyrq == '' || kyrq == undefined){
  		return tbrq.substring(5,7);
  	}
  	var kyrqYear = kyrq.substring(0,4);
  	var tbrqYear = tbrq.substring(0,4);
  	if(tbrqYear > kyrqYear){
  		return parseFloat(tbrq.substring(5,7));
  	}
  	return parseFloat( tbrq.substring(5, 7) - kyrq.substring(5, 7) + 1);
  }
  
  /**
   * 根据dm_gs_zspm表，对
   * 1.工资、薪金所得，2.生产经营所得和企事业单位承包经营所得，3.稿酬所得，4.劳动报酬所得，
   * 5.特许权使用费所得，利息股息红利所得，财产租赁所得，财产转让所得，偶然所得和其他所得
   * 进行减免税额，税率和速算扣除数的计算
   * @param nodeLeftPart 申报信息节点路径
   * @param zsxmDm 征收项目代码
   * @param zspmDm 征收品目代码
   * @param yssdl 应税所得率
   * @param kzxxObj 扩展信息对象。
   */
  function calculate_gs_jsme_sl_sskcs(nodeLeftPart, zsxmDm, zspmDm,yssdl,kzxxObj) {
  	var json = new Array();
  	var srze = 0.00;
  	var kcs = 0.00;
  	if(nodeLeftPart == ""){
  		srze = kzxxObj.srze;
  		kcs = kzxxObj.kcs;
  	}else{
  		srze = parseFloat(nodeLeftPart.ysx);
  		kcs = parseFloat(nodeLeftPart.jcx);
  	}
  	
  	//省级环境特殊需求,增加应税所得率字段,modified by 2014-12-23 lijunfeng 
  	if(yssdl ==  'undefined' || yssdl == undefined){
  		yssdl = 1;
  	}
  	
  	var ynssde = parseFloat((srze - kcs) *  yssdl);
  	ynssde = Math.round(100*ynssde)/100;
  	if(gs_zsxmDm === zsxmDm) {//个人所得税
  			var jsonElement = {};
  			switch(zspmDm) {
  			case '101060200' : 
  				var jsbz = kzxxObj.jsbz;
  				var sjjyyf =  kzxxObj.sjjyyf;	//实际经营月份
  				var dlhdfsbz =  kzxxObj.dlhdfsbz;	//定率核定方式标志；1：定期定额核定；2：个税定率核定
  				var ysbyf = kzxxObj.ysbyf;		//已申报月份
  				if(jsbz == '1'){	//征收率
  					jsonElement['sl'] = yssdl;
  					jsonElement['sskcs'] = 0;
  					ynssde = parseFloat((srze - kcs) *  1);
  					break;
  				}else if(jsbz == '2'){	//应税所得率。
  					ynssde = parseFloat((srze - kcs) *  yssdl);
  				}else if(jsbz == '3'){	//所得率
  					//所得率情况:
  					if(dlhdfsbz == '1'){
  						//定期定额核定
  						//用来判断税率和速算扣除数的应纳税所得额 = (应税项*所得率-3500)*实际经营月份 
  						ynssde = Math.round(100 * ((srze - kcs) *  yssdl - 3500) * sjjyyf ) / 100;
  					}else if(dlhdfsbz == '2'){
  						//个税定率核定
  						//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
  						ynssde = Math.round(100 * ((srze - kcs) *  yssdl - 3500 * ysbyf)) / 100;
  					}
  					
  				}else if(jsbz == '5' && dlhdfsbz == '1'){	
  					//甘肃和西藏比较特殊，定期定额生产经营所得个税3万以下减征，超过3万时需要减除3W进行计税
  					
  					if(srze >= 30000){
  						jsonElement['kcs'] = 30000.00;
  						jsonElement['sl'] = yssdl;
  						jsonElement['sskcs'] = 0.00;	
  						ynssde = parseFloat((srze - 30000) *  1);
  					}else{
  						jsonElement['sl'] = 0.00;
  						jsonElement['sskcs'] = 0.00;	
  						jsonElement['kcs'] = 0.00;
  						ynssde = 0;
  					}
  					break;
  				}
  					
  				if(ynssde <= 15000) {
  					jsonElement['sl'] = 0.05;
  					jsonElement['sskcs'] = 0;					
  				} else if(ynssde > 15000 && ynssde <=30000) {
  					jsonElement['sl'] = 0.1;
  					jsonElement['sskcs'] = 750;						
  				} else if(ynssde > 30000 && ynssde <=60000) {
  					jsonElement['sl'] = 0.2;
  					jsonElement['sskcs'] = 3750;						
  				} else if(ynssde > 60000 && ynssde <=100000) {
  					jsonElement['sl'] = 0.3;
  					jsonElement['sskcs'] = 9750;						
  				} else if(ynssde > 100000) {
  					jsonElement['sl'] = 0.35;
  					jsonElement['sskcs'] = 14750;						
  				}
  				
  				//所得率情况，
  				//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
  				if(jsbz == '3'){
  					if(dlhdfsbz == '1'){
  						//定期定额核定情况
  						//个人所得税应纳税所得额=应税项*所得率-3500
  						//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
  						jsonElement['ynssde'] = Math.round(((srze - kcs) *  yssdl - 3500) * 100) / 100;
  						jsonElement['ynse'] = Math.round(100 * (jsonElement.ynssde * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf) / 100;
  						jsonElement['sskcs'] = Math.round(100 * jsonElement.sskcs / sjjyyf) / 100;
  					}else if(dlhdfsbz == '2'){
  						//个税核定率情况
  						//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
  						//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
  						jsonElement['ynse'] = Math.round(100 * (ynssde * jsonElement.sl - jsonElement.sskcs)) / 100;
  					}
  					
  				}
  				break;//个体户生产经营所得
  			case '101060300' : 
  				var jsbz = kzxxObj.jsbz;
  				var sjjyyf =  kzxxObj.sjjyyf;	//实际经营月份
  				var dlhdfsbz =  kzxxObj.dlhdfsbz;	//定率核定方式标志；1：定期定额核定；2：个税定率核定
  				var ysbyf = kzxxObj.ysbyf;		//已申报月份
  				if(jsbz == '1'){	//征收率
  					jsonElement['sl'] = yssdl;
  					jsonElement['sskcs'] = 0;
  					ynssde = parseFloat((srze - kcs) *  1);
  					break;
  				}else if(jsbz == '2'){	//应税所得率。
  					ynssde = parseFloat((srze - kcs) *  yssdl);
  				}else if(jsbz == '3'){	//所得率
  					//所得率情况:
  					if(dlhdfsbz == '1'){
  						//定期定额核定
  						//用来判断税率和速算扣除数的应纳税所得额 = (应税项*所得率-3500)*实际经营月份 
  						ynssde = Math.round(100 * ((srze - kcs) *  yssdl - 3500) * sjjyyf ) / 100;
  					}else if(dlhdfsbz == '2'){
  						//个税定率核定
  						//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
  						ynssde = Math.round(100 * ((srze - kcs) *  yssdl - 3500 * ysbyf)) / 100;
  					}
  					
  				}
  					
  				if(ynssde <= 15000) {
  					jsonElement['sl'] = 0.05;
  					jsonElement['sskcs'] = 0;					
  				} else if(ynssde > 15000 && ynssde <=30000) {
  					jsonElement['sl'] = 0.1;
  					jsonElement['sskcs'] = 750;						
  				} else if(ynssde > 30000 && ynssde <=60000) {
  					jsonElement['sl'] = 0.2;
  					jsonElement['sskcs'] = 3750;						
  				} else if(ynssde > 60000 && ynssde <=100000) {
  					jsonElement['sl'] = 0.3;
  					jsonElement['sskcs'] = 9750;						
  				} else if(ynssde > 100000) {
  					jsonElement['sl'] = 0.35;
  					jsonElement['sskcs'] = 14750;						
  				}
  				
  				//所得率情况，
  				//按照累计计税的应纳税额 应纳税额=（计税依据*税率-速算扣除数)*已申报月份/实际经营月份
  				if(jsbz == '3'){
  					if(dlhdfsbz == '1'){
  						//定期定额核定情况
  						//个人所得税应纳税所得额=应税项*所得率-3500
  						//个人所得税应纳税额=[(应税项*所得率-3500)*实际经营月份*分档税率-速算扣除数]/实际经营月份
  						jsonElement['ynssde'] = Math.round(100 * ((srze - kcs) *  yssdl - 3500)) / 100;
  						jsonElement['ynse'] = Math.round(100 * (jsonElement.ynssde * sjjyyf * jsonElement.sl - jsonElement.sskcs) / sjjyyf) /100;
  						jsonElement['sskcs'] = Math.round(100 * jsonElement.sskcs / sjjyyf) / 100;
  					}else if(dlhdfsbz == '2'){
  						//个税核定率情况
  						//按照累计收入计税:计税依据=应税项*所得率-3500*已申报月份数 
  						//按照累计收入计税:应纳税额=计税依据*税率-速算扣除数 
  						jsonElement['ynse'] = Math.round(100 * (ynssde * jsonElement.sl - jsonElement.sskcs)) / 100;
  					}
  					
  				}
  				break;//企事业承包承租经营所得
  			
  			case '101060400' : 
  				//劳务报酬所得税，先判断收入，不超过4000的，减800，超过4000的减20%后为应纳税所得额
  				if(ynssde <= 4000) {
  					ynssde = ynssde - 800;
  				}else if(ynssde > 4000) {
  					ynssde = ynssde*0.8;
  				}
  				if(ynssde <= 20000) {
  					jsonElement['sl'] = 0.2;
  					jsonElement['sskcs'] = 0;						
  				} else if(ynssde > 20000 && ynssde <=50000) {
  					jsonElement['sl'] = 0.3;
  					jsonElement['sskcs'] = 2000;						
  				} else if(ynssde > 50000) {
  					jsonElement['sl'] = 0.4;
  					jsonElement['sskcs'] = 7000;						
  				}
  				; break;//劳务报酬所得税
  			case '101060500' :
  				if(ynssde >=800 && ynssde <= 4000) {
  					ynssde = ynssde - 800;				
  				}else if(ynssde > 4000) {
  					ynssde = ynssde*0.8;	
  				}
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] =  ynssde*0.2*0.3;
  				//ynssde = ynssde*0.7;//再按应纳税额减征30%
  				; break;//稿酬所得
  			case '101060600' : 
  				if(ynssde >=800 && ynssde <= 4000) {
  					ynssde = ynssde - 800;					
  				}else if(ynssde > 4000) {
  					ynssde = ynssde*0.8;	
  				}
  				jsonElement['sl'] = 0.2;	
  				jsonElement['sskcs'] = 0;
  				; break;//特许权使用所得
  		/*			case '101060701' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;	
  				; break;//储蓄存款利息所得
  			case '101060799' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;					
  				; break;//其他利息、股息、红利所得
  			case '101060901' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;	
  				; break;//限售股转让所得
  			case '101060900' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;					
  				; break;//财产转让所得
  			case '101060902' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;						
  				; break;//房屋转让所得
  			case '101060999' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;					
  				; break;//其他转让所得
  			case '101061000' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;	
  				; break;//偶然所得
  			case '101061100' : 
  				jsonElement['sl'] = 0.2;
  				jsonElement['sskcs'] = 0;				
  				; break;//其他所得
  		*/	
  			case '101060800' : 
  				if(ynssde >=800 && ynssde <= 4000) {
  					ynssde = ynssde - 800;
  				}else if(ynssde > 4000) {
  					ynssde = ynssde*0.8;
  				}
  				jsonElement['sl'] = 0.2;	
  				jsonElement['sskcs'] = 0;
  				; break;//财产租赁所得
  			case '101060100' : 
  				//工资薪金的暂不用速算扣除数，跟认定走。
  				/*ynssde = ynssde - 3500;
  				if(ynssde <= 1500) {
  					jsonElement['sl'] = 0.03;
  					jsonElement['sskcs'] = 0;
  				} else if(ynssde > 1500 && ynssde <=4500) {
  					jsonElement['sl'] = 0.1;
  					jsonElement['sskcs'] = 105;					
  				} else if(ynssde > 4500 && ynssde <=9000) {
  					jsonElement['sl'] = 0.2;
  					jsonElement['sskcs'] = 555;
  				} else if(ynssde > 9000 && ynssde <= 35000) {
  					jsonElement['sl'] = 0.25;
  					jsonElement['sskcs'] = 1005;
  				} else if(ynssde > 35000 && ynssde <= 55000) {
  					jsonElement['sl'] = 0.3;
  					jsonElement['sskcs'] = 2755;
  				} else if(ynssde > 55000 && ynssde <= 80000) {
  					jsonElement['sl'] = 0.35;
  					jsonElement['sskcs'] = 5505;
  				} else if(ynssde > 80000) {
  					jsonElement['sl'] = 0.45;
  					jsonElement['sskcs'] = 13505;
  				}*/
  				; break;//工资薪金所得
  				default :
  				//取核心税率。
  				; break;
  			}
  			//计算应纳税所得额，如果特殊的应纳税所得额处理方式，在前面进行处理。
  			if(jsonElement.ynssde == 'undefined' || jsonElement.ynssde == undefined){
  				jsonElement['ynssde'] = ynssde;
  			}
  			
  			//计算应纳税额，如果特殊的应纳税额处理方式，在前面进行处理。
  			if((jsonElement.ynse == 'undefined' || jsonElement.ynse == undefined) 
  					&& jsonElement.sl !=  'undefined' && jsonElement.sl != undefined){
  				jsonElement['ynse'] = ynssde * jsonElement.sl - jsonElement.sskcs;
  			}
  			if(jsonElement.ynse != 'undefined' && jsonElement.ynse != undefined){
  				json.push(jsonElement); 		
  			}
  	}
  	return json ;
  }
  
  /**
   * 减免性质改变后，赋值减免税额。
   * @param docElem
   */
  function changeJmxz(nodeLeftPart){
  	var ssjmxzDm =nodeLeftPart.ssjmxzDm;
  	var zspmDm =nodeLeftPart.zspmDm;
  	var zszmDm =nodeLeftPart.zszmDm;
  	var bqjmsfe=nodeLeftPart.bqjmsfe;
  	var bqynsfe=nodeLeftPart.bqynsfe;
  	//税收减免性质代码不为空时触发。
  	if(ssjmxzDm != '' && ssjmxzDm != undefined && ssjmxzDm != 'undefined'){
  		//根据ssjmxzDm改变对应的jmzlxDm,jzed,jzfd,jzsl
  		var sbxxGridlb=formData.qcs.formContent.sbTysb.body.sbxxGrid.sbxxGridlb;
  		var arrayNum=0;
	  	for(var i=0;i<sbxxGridlb.length;i++){
		  if(sbxxGridlb[i].zspmDm==zspmDm){
			  if(sbxxGridlb[i].zszmDm!=''&&sbxxGridlb[i].zszmDm==zszmDm){
				  arrayNum=i;
				  break;
			  }else{
				  arrayNum=i; //确定是重复行下标							  
			  }
		  }
		}
	  	var option=sbxxGridlb[arrayNum].option;
	  	for(var i=0;i<option.length;i++){
			  if(option[i].dm==ssjmxzDm){
				  nodeLeftPart.jmzlxDm=option[i].jmzlxDm;
				  nodeLeftPart.jzed=option[i].jmed;
				  nodeLeftPart.jzfd=option[i].jmfd;
				  nodeLeftPart.jzsl=option[i].jmsl;					  
				  break;				 
			  }
			}
  		validateTysb.calculate_tysb_row(nodeLeftPart);	// 先计算当前行的计算关系
  		var jmse = validateTysb.get_tysb_jmse(nodeLeftPart);	//根据减免性质，确定可以减免的税额。
  		if(nodeLeftPart.ssjmxzDm!=null&&nodeLeftPart.ssjmxzDm!=''){
  			if(jmse==0){
  				nodeLeftPart.bqjmsfe=bqjmsfe<bqynsfe?bqjmsfe:bqynsfe;  
  			}else{
  				if(bqjmsfe==0){
  					nodeLeftPart.bqjmsfe=jmse;
  				}else{
  					nodeLeftPart.bqjmsfe=bqjmsfe<jmse?bqjmsfe:jmse;  			  				
  				}  				
  			}
  		}else{
  			//nodeLeftPart.bqjmsfe=jmse;
  		}
  	}
  }
  
  /**
   * 页面加载完毕后，进行调用初始化
   */
  function afterLoadDataAction() {
  	var formsDataXml = $($.json2xml(formData));;
  	var nodeLeftPart = "";
  	var i = 0;
  	$(formsDataXml).find('fxmtysbbdVO > fxmtySbb > sbxxGrid > sbxxGridlb').each(function() {
  		nodeLeftPart = validateTysb.getThisRow(i);  		
  		validateTysb.calculate_tysb_row(nodeLeftPart);
  		nodeLeftPart.ysbse=validateTysb.getYsbje(nodeLeftPart);
  		/*var zfsbz = $(this).children("zfsbz").text();
  		if (zfsbz == '0') {
  			validateTysb.calculate_tysb_fjs(nodeLeftPart);
  		}*/
  		
  		//全选控制
  		var flag = false;
  		//过滤合伙企业登记注册类型
  		flag = fiterDjzclxByHhqy(nodeLeftPart);
  		if(flag){
  			//过滤不可以申报的征收品目代码
  			flag = fiterZspm(nodeLeftPart);
  		}
  		/*if(flag){
  			nodeLeftPart.sftj='Y';
  		}*/
  		i++;
  	});
  	
  	validateTysb.calculate_tysb_hjxx();
  }
 
  /*
   * 公共公式执行后、填充数据前执行业务逻辑 @return boolean
   */
  function callbackBeforeSetData(nodeLeftPart) {
  	var flag = validateGsscjyxx(nodeLeftPart);	//校验个税生产经营信息。如果是为空，则返回false，不能进行计算。
  	if(!flag){
  		return false;
  	}
  	//setSLIsWrite(docElem);// 土地增值税核定税率从其他税种核定获取
  //	validateTysb.validateData(nodeLeftPart);	//校验填写的数据项。

  	//调用减免性质逻辑。
  	changeJmxz(nodeLeftPart);
  		
	validateTysb.control_tysb_jmse(nodeLeftPart);
	validateTysb.calculate_tysb_row(nodeLeftPart);// 计算当前行的计算关系
	/*var zfsbz = nodeLeftPart.zfsbz;
	if (zfsbz == '0') {
		validateTysb.calculate_tysb_fjs(nodeLeftPart); // 计算附加税
	}*/
	validateTysb.calculate_tysb_hjxx(nodeLeftPart);// 计算合计信息  	
  }
  
  /**
   * 数据改变时执行业务逻辑
   * @param zspm
   * @param zszm
   * @param ssjmxzdm
   * @param ysx
   * @param jcx
   * @param bqjmsfe
   * @param bqyjsfe
   */
  function changeData(zspm,zszm,ssjmxzDm,ysx,jcx,bqynsfe,bqjmsfe,bqyjsfe) {
  	var nodeLeftPart=validateTysb.getCurrentRow(zspm, zszm);
  	//调用减免性质逻辑。
  	if(inArray(nodeLeftPart.zsxmDm, fjs_zspmDm_speacl)!=-1){
  		if(ssjmxzDm == '' || ssjmxzDm == undefined || ssjmxzDm == 'undefined'){
  			nodeLeftPart.ssjmxzDm=validateTysb.tysb_ssjmxzDm(nodeLeftPart.zsxmDm,nodeLeftPart.zspmDm);  			
  		}
  		validateTysb.calculate_tysb_row(nodeLeftPart);// 计算当前行的计算关系
  		var jmse=validateTysb.tysb_jmse(nodeLeftPart.zsxmDm,nodeLeftPart.zspmDm, nodeLeftPart.ssjmxzDm);
  		if(nodeLeftPart.ssjmxzDm!=null&&nodeLeftPart.ssjmxzDm!=''){
  			if(jmse==0){
  				nodeLeftPart.bqjmsfe=bqjmsfe<bqynsfe?bqjmsfe:bqynsfe;  
  			}else{
  				if(bqjmsfe==0){
  					nodeLeftPart.bqjmsfe=jmse;
  				}else{
  					nodeLeftPart.bqjmsfe=bqjmsfe<jmse?bqjmsfe:jmse;  			  				
  				}  				
  			}
  		}else{
  			//nodeLeftPart.bqjmsfe=jmse;
  		}
  	}else{
  		changeJmxz(nodeLeftPart);  		
  	}
  	if(nodeLeftPart.bqynsfe==0){
  		nodeLeftPart.bqjmsfe=0;
  		nodeLeftPart.ssjmxzDm="";
  	}	
	validateTysb.calculate_tysb_row(nodeLeftPart);// 计算当前行的计算关系
	
	validateTysb.calculate_tysb_hjxx(nodeLeftPart);// 计算合计信息 
	
  }
  
  /**
   * 个税生产经营所得信息判断。获取实际经营月份、已申报月份、已申报金额等字段。
   * @param docElem
   * 
   * @returns true 已获取到相关信息；false:没有获取到相关信息
   */
  function validateGsscjyxx(nodeLeftPart) {
  	var zspmDm = nodeLeftPart.zspmDm;
  	//只针对生产经营所得，进行特殊处理。
  	if(zspmDm != '101060200' && zspmDm != '101060300'){
  		return true;
  	}
  	//如果是合伙企业，则不进行特殊计算。
  	var djzclxDm = formData.qcs.initData.nsrjbxx.djzclxDm;
  	if(undefined != djzclxDm &&  djzclxDm != '' && inArray(djzclxDm, DJZCLX_HHQY) > -1){
  		return true;
  	}
  	
  	var jsbz = '';
  	var dlhdfsbz = '';	//定率核定方式标志；1: 定期定额表核定的。 2：在个税核定表中核定的。
  	var gsdlHdxxArray =  validateTysb.getGrsdldlHdxx(zspmDm);
  	var dqdeHdxxArray = validateTysb.getDqdeHdxxByZspm(zspmDm);
  	
  	//判断是在定期定额表核定的还是在个税定率表核定的。如果在两个表中都不存在，则不需要获取生产经营计算公式相关的信息。
  	if(dqdeHdxxArray.length > 0){
  		jsbz = dqdeHdxxArray[0].jsbz;
  		dlhdfsbz = 1;
  	}else if(gsdlHdxxArray.length > 0){
  		jsbz = gsdlHdxxArray[0].jsbz;
  		dlhdfsbz = 2;
  	}else{
  		return true;
  	}
  	
  	//如果计税标志不是为3的，不需要重新获取与计算公式相关的信息。
  	if(jsbz != '3'){
  		return true;
  	}
  	var sjjyyf = nodeLeftPart.sjjyyf;
  	var ysbyf = nodeLeftPart.ysbyf;
  	
  	//实际经营月份已经获取到，则不需要重新去获取。
  	if(sjjyyf != "" && sjjyyf != undefined && sjjyyf != null && sjjyyf > 0 ){
  		return true;
  	}
  	
  	//对于是在个税核定表中，如果已申报月份已获取到，则不需要重新去获取。
  	if(dlhdfsbz == '2' && ysbyf != "" && ysbyf != undefined && ysbyf != null && ysbyf > 0){
  		return true;
  	}
  	
  	//如果实际经营月份或者已申报月份没值，则需要纳税人自行录入。
  	Message.win({message:buildGsscjyxxHtml(nodeLeftPart, dlhdfsbz), width:600, height:300, title:'生产经营信息录入', btn: ['OK'],
  		closeBtn:false,autoClose:false, handler:function(){setGsscjyxx(nodeLeftPart, dlhdfsbz);},maxBtn:false,minBtn:false});
  	return false;
  }

  /**
   * 初始化生产经营录入信息的html
   * @param nodeLeftPart 通用申报 dom 对象节点路径左边部分
   * @param dlhdfsbz 定率核定方式标志； 1 ：定期定额表核定的；2：个税核定表核定的。
   */
  function buildGsscjyxxHtml(nodeLeftPart, dlhdfsbz){
  	var multipos = validateTysb.getCurrentRownum(nodeLeftPart);
  	if (typeof multipos === 'undefined') {
  		multipos = 0;
  	}
  	var skssqq = nodeLeftPart.sfkssqq;
  	var skssqz = nodeLeftPart.sfkssqz;
  	var zspmDm = nodeLeftPart.zspmDm;
  	var kyrq = eval("formData.qcs.initData.tysbbInitData.kyrq");
  	var sjjyyf = calSjjyMonth(kyrq,skssqz);
  	
  	var content = '<link href="/skin/www/style/css-swzj-01/style.css"  rel="stylesheet" type="text/css">'
  		+'<div></div>'
  		+'<table border="0" cellpadding="0" cellspacing="0"  align="center" width="99%">'
  		+ '<tr align="center">'
  		+ '<td width="100px" class="title-td01">实际经营月份</td>'
  		+ '<td width="200px" class="title-td01f"><input type="text" id="' + 'sjjyyf' + multipos +  '"  value ="' + sjjyyf + '" /></td>'
  		+ '<td width="200px" class="title-td01f" id="sjjyyfErrorMsg" style="color:red;font-size:11px;"></td>'
  		+ "</tr>";
  	
  	//如果核定方式标志为个税核定的，则需要纳税人自行填写已申报月份和已申报金额。
  	if(dlhdfsbz == 2){
  		var ysbyfVal =  calYsbMonth(kyrq,skssqz);
 //未知 	var array = parent.parent.parent.initBusinessFormFrame.getPreviousSkssq(skssqq, skssqz).split(":");
  		var ysbjeVal = validateTysb.getGsYsbjeByZspm(zspmDm, array[0], array[1]);
  		var ysbyfId = "ysbyf" + multipos;
  		var ysbjeId = "ysbje" + multipos;
  		
  		content +=  '<tr align="center">'
  			+ '<td width="100px" class="title-td01">已申报月份</td>'
  			+ '<td width="200px" class="title-td01f"><input type="text" id="' + ysbyfId +  '"  value="' + ysbyfVal + '" /></td>'
  			+ '<td width="200px" class="title-td01f" id="ysbyfErrorMsg" style="color:red;"></td>'
  			+ "</tr>"
  			+ '<tr align="center">'
  			+ '<td width="100px" class="title-td01">已申报金额</td>'
  			+ '<td width="200px" class="title-td01f"><input type="text" id="' + ysbjeId +  '"  value="' + ysbjeVal +'"  disabled/></td>'
  			+ '<td width="200px" class="title-td01f" id="ysbjeErrorMsg" style="color:red;font-size:11px;"></td>'
  			+ "</tr>";
  	}
  	content +='</table>'
  	+'<div style="height:50px"></div>'
  	+'<table border="0" cellpadding="0" cellspacing="0"  align="center" width="99%">'
  	+'<div style="color:#FF0000" id="tsxx">提示信息：<br/>1. 实际经营月份：默认为12，当以下两种情形时例外：（1）年中开业时，当年实际经营月份为开业当月至年底（年中注销除外）；（2）年中注销时，当年实际经营月份为年初（或开业当月）至注销月份.';
  	
  	if(dlhdfsbz == 2){
  		content +=  ' <br/>2. 已申报月数：税款所属月份-当年税费种认定月起+1';
  	}
  	content += '</div></table>';
  	
  	return content;
  }

  /**
   * 输入完生产经营信息后回调
   * @param docElem
   *  @param dlhdfsbz 定率核定方式标志； 1 ：定期定额表核定的；2：个税核定表核定的。
   */
  function setGsscjyxx(nodeLeftPart, dlhdfsbz){
	var multipos = validateTysb.getCurrentRownum(nodeLeftPart);
  	if (typeof multipos === 'undefined') {
  		multipos = 0;
  	}
  	var sjjyyf = document.getElementById('sjjyyf' + multipos).value;
  	var ysbje = "0.00";
  	var ysbyf = "";
  	
  	//校验值。
  	if(sjjyyf == ""){
  		document.getElementById('sjjyyfErrorMsg').innerHTML = "实际经营月份不能为空！<br/>";
  		return false;
  	}else if(sjjyyf.match(/^[-+]?\d*$/) == null){
  		document.getElementById('sjjyyfErrorMsg').innerHTML =  '实际经营月份必须是整形数字！<br/>';
  		return false;
  	}else if(sjjyyf <= 0){
  		document.getElementById('sjjyyfErrorMsg').innerHTML =  "实际经营月份不能小于等于0！<br/>";
  		return false;
  	}else if(sjjyyf > 12){
  		document.getElementById('sjjyyfErrorMsg').innerHTML =  "实际经营月份不能大于12！<br/>";
  		return false;
  	}else{
  		document.getElementById('sjjyyfErrorMsg').innerHTML = "";
  	}
  	

  	if(dlhdfsbz == '2'){
  		ysbyf = document.getElementById('ysbyf' + multipos).value;
  		ysbje = document.getElementById('ysbje' + multipos).value;

  		if(ysbyf == ""){
  			document.getElementById('ysbyfErrorMsg').innerHTML = "已申报月份不能为空！";
  			return false;
  		}else if(ysbyf.match(/^[-+]?\d*$/) == null){
  			document.getElementById('ysbyfErrorMsg').innerHTML = '已申报月份必须是整形数字！<br>';
  			return false;
  		}else if(ysbyf <= 0){
  			document.getElementById('ysbyfErrorMsg').innerHTML = "已申报月份不能小于等于0！<br/>";
  			return false;
  		}else if(ysbyf > 12){
  			document.getElementById('ysbyfErrorMsg').innerHTML = "已申报月份不能大于12！<br/>";
  			return false;
  		}else{
  			document.getElementById('ysbyfErrorMsg').innerHTML = "";
  		}
  		
  		if(ysbje == ""){
  			document.getElementById('ysbjeErrorMsg').innerHTML = "已申报金额不能为空！<br/>";
  			return false;
  		}else if(ysbje.match(/^\d*(\.\d{0,2})?$/) == null){
  			document.getElementById('ysbjeErrorMsg').innerHTML = '已申报金额必须是数字，且小数点位数不能大于2位！<br/>';
  			return false;
  		}else if(ysbje < 0){
  			document.getElementById('ysbjeErrorMsg').innerHTML = "已申报金额不能小于0！<br/>";
  			return false;
  		}else{
  			document.getElementById('ysbjeErrorMsg').innerHTML = "";
  		}
  		
  		nodeLeftPart.ysbyf =ysbyf;
  		nodeLeftPart.ysbse =ysbje;
  		nodeLeftPart.bqyjsfe =ysbje;
  	}
  	
  	nodeLeftPart.sjjyyf =sjjyyf;
  	Message.close();
  	callbackBeforeSetData(nodeLeftPart);
  	//在ie10下不能加parent，ie8下需要加。
  /*	if('undefined' ==  typeof(setDataToActiveSheet)){
  		parent.setDataToActiveSheet();
  	}else{
  		setDataToActiveSheet();
  	}*/ //未知
  }
  
  /**
   * 过滤不可以申报的征收品目。
   * @param nodeLeftPart
   */
  function fiterZspm(nodeLeftPart){
  	var zspmDm = nodeLeftPart.zspmDm;
  	var zspmCsz = unableSbZspm;
  	if(typeof(zspmCsz) == undefined || zspmCsz == 'undefined' || zspmCsz == undefined  || zspmCsz == ''){
  		return true;
  	}
  	
  	if(inArray(zspmDm, zspmCsz) > -1){
  		var zszmDm =  nodeLeftPart.zszmDm;
  		//配置可以申报的征收子目代码
  		if(zszmDm != '' && zszmDm != undefined && inArray(zszmDm, ableSbZszm) > -1){
  			return true;
  		}
  		
  		//对于个人所得税生产经营品目、承包承租经营所得，先查询定期定额表
  		//如果在定期定额表中查询不到，则查询个税核定表;
  		//如果都不存在，则不允许在此申报。
  		if(zspmDm == '101060200' || zspmDm == '101060300'){
  			var dqdeHdxxArray = validateTysb.getDqdeHdxxByZspm(zspmDm);
  			if(dqdeHdxxArray.length > 0){
  				return true;
  			}else{
  				var gsdlHdxxArray = validateTysb.getGrsdldlHdxx(zspmDm);
  				if(gsdlHdxxArray.length > 0){
  					return true;
  				}
  			}
  		}
  		
  		nodeLeftPart.sftj = 'N';

  		setRowReadOnly(nodeLeftPart);
  		return false;
  	}else{
  		return true;
  	}
  }

  /**
   * 过滤合伙企业登记注册类型
   * @param nodeLeftPart
   */
  function fiterDjzclxByHhqy(nodeLeftPart){
  	var zspmDm = nodeLeftPart.zspmDm;
  	var djzclxDm = eval("formData.qcs.initData.nsrjbxx.djzclxDm");
  	if(zspmDm == '101060200' || zspmDm == '101060300'){
  		if(undefined != djzclxDm &&  djzclxDm != '' && inArray(djzclxDm, DJZCLX_HHQY) > -1){
  			nodeLeftPart.sftj = 'N';
  			setRowReadOnly(nodeLeftPart);
  			return false;
  		}
  	}
  	return true;
  }
  
  /**
   * 设置当前行只读
   * @param nodeLeftPart 
   */
  function setRowReadOnly(nodeLeftPart){
	var multipos = nodeLeftPart.substr($.inArray('[', nodeLeftPart) + 1, ($.inArray(']', nodeLeftPart) - $.inArray('[', nodeLeftPart) -1));
  	if (multipos == '' || multipos == undefined || typeof multipos === 'undefined') {
  		multipos = 0;
  	}
  	var i = 0;
  	$("input[type='checkbox']").each(function() {
  		if (this.name == 'sftj') {
  			if(i == multipos){
  				var checkValue = nodeLeftPart.sftj;
  				var checkedStatus = (checkValue == 'Y' ? true : false);
  				if (checkValue != undefined) {
  					$(this).attr("checked", checkedStatus);
  					$(this).val(checkValue);
  					//设置只读
  					$(this).attr("disabled","disabled");
  					var inputObj = $(this).parent().parent().find("input");
  					for(var  m = 0;m < inputObj.length; m++){
  						if(inputObj[m].readOnly == false){
  							$(inputObj[m]).attr("readOnly", "readOnly");
  							$(inputObj[m]).removeClass().addClass("read");
  						}		
  					}
  					return false;
  				}
  			}			
  			i++;
  		}
  	});
  }
  
  //全选操作
  function selectedAll(allSelected){	  
	/*if(allSelected=='false'){
		formData.fxmtysbbdVO.fxmtySbb.sbxxGrid.allSelected=false;
		return false;
	}*/
	//选择或取消全选同时改变是否提交标志
	  var sbxxGridlb=validateTysb.getAllRow();
	  for(var i=0;i<sbxxGridlb.length;i++){
		  if(allSelected==true){
			  sbxxGridlb[i].checkedbz=true;		
			//  sbxxGridlb[i].sftj="Y";			  
		  }else{
			  sbxxGridlb[i].checkedbz=false;		
			//  sbxxGridlb[i].sftj="N";	
		  }
	  }
	  return true;
  }
  
  function submitValid(){	  
	  var sbxxGridlb=validateTysb.getAllRow();
	  for(var i=0;i<sbxxGridlb.length;i++){
		  	if(sbxxGridlb[i].sftj=="Y"){
		  		return true;
		  	}			  			  		 
	  }
	  return false;
  }
  
  function setYsbse(){	
	  var sbxxGridlb=validateTysb.getAllRow();
  }
  
function inArray(elem, arr, i) {
		var len;
		
		if (arr) {
			/*if (core_indexOf) {
				return core_indexOf.call(arr, elem, i);
			}*/
			len = arr.length;
			i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
			
			// fix bug when ie8 ;这两行目的就是解决这个bug
	        if (typeof arr === "string") {
	            return arr.indexOf(elem);
	        }
			
		    for (; i < len; i++) {
				// Skip accessing in sparse arrays
				if ((i in arr) && (arr[i] === elem)) {
					return i;
				}
			}
		}
		
		return -1;
}
  