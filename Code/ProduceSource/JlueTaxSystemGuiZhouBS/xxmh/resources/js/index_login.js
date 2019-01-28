$(function () {
    $('#cygnsz').click(function () {
        return false;
        layer.open({
            type: 2
            , area: ['940px', '572px']
            , title: ['常用功能设置']
            , scrollbar: false
            , id: 'layerCygn' //防止重复弹出
            , content: '/xxmh/html/cygn.html'
        });
    });
});