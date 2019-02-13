
/**
 * 申报提交时框架校验成功后的业务特有校验
 * @param callBeforSubmitForm ：回调方法，调用表单提交前的业务特有提示
 * @param callSubmitForm ：回调方法，调用表单提交
 * @param params : 回调参数
 */
function doAfterVerify(callBeforSubmitForm,callSubmitForm, params) {
    var swjgDm = getSwjgDm(formData);
    var url = window.location.href;

    if(swjgDm.substring(0,3)==="137" && url.indexOf("bzz=csgj") > -1){
        var proMessage = "<div style=\"padding-left:20px;\">请确认是否提交申报？</div><br/>";
        parent.layer.confirm(proMessage,{
            icon : 3,
            title:'提示',
            btn : ['确认','取消'],
            btn2:function(index){
                parent.layer.close(index);
                $("body").unmask();
                prepareMakeFlag = true;
                return;
            }
        },function(index){
            parent.layer.close(index);
            // 执行回调函数
            callBeforSubmitForm(callSubmitForm,params);
        });
    }else{
        // 执行回调函数
        callBeforSubmitForm(callSubmitForm,params);
    }
}
/**
 * 一般纳税人增值税附征 应纳税额计算
 * @param a 主表第 34行1列
 * @param b  主表  34行 3列
 * @param c  附加税附表 税率
 */
function calculateYnse(a,b,i) {
    var a = a;//formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.zbGrid.zbGridlbVO[0].bqybtse;
    var b = b;//formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.zbGrid.zbGridlbVO[2].bqybtse;
    var c= formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].sl1;
    return ROUND((a+b) * c,2);
}

/**
 * 一般纳税人增值税附征 减免性质代码
 * @param i
 * @returns {string}
 * 混运 "ygznsrzg":"22",
 * 非营改征 "ygznsrzg":"11",
 * 纯营改征  "ygznsrzg":"21", 其他
 *
 */
function jmdm(i,asysljsxse){
    
    var before = asysljsxse;  //低于10万过滤
    var ssqq = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqq;
    var ssqz = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqz;
  //计算月报还是季报，月报；月销售额合计10万及以下，季度销售额合计30万及以下，才免征两费。
    var iDays = DATE_GET_TIME_INTERVAL_DAYS(ssqq,ssqz); // 相差天数
    
    if((iDays<=31 && before>100000) || ((iDays<=93 && before>300000))){
        return '';
    }
    var ygznsrzg = formData.qcs.initData.zzsybnsrsbInitData.ygznsrzg;
    if(ygznsrzg=='22'||ygznsrzg=='11'||ygznsrzg=='21'||ygznsrzg =='30'||ygznsrzg=='31'||ygznsrzg=='32'){
        if(formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].zsxmDm == '30203'){
            return '0061129999';
        }
        if(formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].zsxmDm == '30216'){
            return '0099129999';
        }
    }else{
        return'';
    }
}
/**
 * 一般纳税人增值税附征 减免税额
 * @param i
 * @returns {string}
 * bf: 主表销售额合计（第1+5+7+8（第1+5+7+8栏
 * jsyj: 计税依据
 * sl:" 税率
 *
 */
function getJmse(bf,jsyj,sl,jmdm1,i){
    var before = bf;
    var jsyj = jsyj;
    var sl = sl;
    var ssqq = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqq;
    var ssqz = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqz;
    //计算月报还是季报，月报；月销售额合计10万及以下，季度销售额合计30万及以下，才免征两费。
    var iDays = DATE_GET_TIME_INTERVAL_DAYS(ssqq,ssqz); // 相差天数
    
    if((iDays<=31 && before>100000) || ((iDays<=93 && before>300000))){
        return 0;
    }else {
        if(jmdm1==''||jmdm1==null||jmdm1==undefined){
            return 0;
        }
        return jsyj*sl;
    }
}