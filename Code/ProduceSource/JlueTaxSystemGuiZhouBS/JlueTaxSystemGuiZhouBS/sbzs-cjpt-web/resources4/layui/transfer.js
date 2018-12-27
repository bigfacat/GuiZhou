layui.use(['layer','laydate','form'], function(){
    if(!window.form){
        window.form = layui.form;
    }
    if(!window.layer){
        window.layer=layui.layer;
    }
    if(!window.laydate){
        window.laydate=layui.laydate;
    }
});