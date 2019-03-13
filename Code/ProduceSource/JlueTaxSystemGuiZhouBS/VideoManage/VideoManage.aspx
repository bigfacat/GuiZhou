<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="VideoManage.aspx.cs" Inherits="JlueTaxSystemGuiZhouBS.VideoManage1" %>

<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>视频管理</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link href="/VideoManage/css/VideoIndex.css" rel="stylesheet" />
    <script type="text/javascript" src="/js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="/js/json2.js"></script>
    <script type="text/javascript" src="/js/dump_src.js"></script>
    <style type="text/css">
        .colu:hover .png {
            width: 10px;
            height: 10px;
            background-image: url(/VideoManage/image/xzz.png);
            background-repeat: no-repeat;
            background-size: 100%;
            position: relative;
            left: -37px;
            top: 20px;
        }

        .colu:hover {
            background: #daf4fd;
        }
         .novideo {
            display: block;
            width: 100%;
            margin: 10% 0;
            background: #fff;
            font-size: 48px;
            text-align: center;
            /* box-sizing: border-box; */
        }
    </style>
    <script>
        function checkvideo(Id,VideoID, Model, CourseId) {
            if (VideoID != "null" && VideoID != "") {
                window.open("<%=System.Web.Configuration.WebConfigurationManager.AppSettings["Practicepath"]%>/UIRES/VideoPlay.aspx?VideoID=" + VideoID + "&Id=" + Id + "&CourseId=" + CourseId);
            }
            else {
                    alert('暂无视频');
            }
        }

        var VideoManage = '<%=Session["VideoManage"]%>'
        $(document).ready(function () {
            var json = JSON.parse(VideoManage);
            $("#showGtax").find("li").remove();
            $("#showDtax").find("li").remove();
            var gtaxcount = 0;
            var dtaxcount = 0;
            $.each(json, function (i, v) {
                if (v.TaxType == "0") {
                    Gtax = '<li class="colu"><div class="png"></div>';
                    Gtax += '<span>' + v.VideoName + '</span>';
                    Gtax += '<a class="play"  target="_blank" onclick="checkvideo(\'' + v.Id + '\',\'' + v.VideoID + '\',\'0\',\'' + v.CourseId + '\')">播放</a></li>';
                    $("#showGtax").append(Gtax);
                    gtaxcount++;
                }
                if (v.TaxType == "1") {
                    Dtax = '<li class="colu"><div class="png"></div>';
                    Dtax += '<span>' + v.VideoName + '</span>';
                    Dtax += '<a class="play"  target="_blank" onclick="checkvideo(\'' + v.Id + '\',\'' + v.VideoID + '\',\'1\',\'' + v.CourseId + '\')">播放</a></li>';
                    $("#showDtax").append(Dtax);
                    dtaxcount++;
                }
            })
            if (gtaxcount == 0 && dtaxcount == 0) {
                $("#divcontent").html("<span class='novideo'>暂无视频</span>");
            }
            else {
                if (gtaxcount == 0) {
                    $("#divgtax").css("display", "none");
                }
                if (dtaxcount == 0) {
                    $("#divdtax").css("display", "none");
                }
            }
        });
    </script>
</head>

<body id="body_cool_12">
    <div class="content" id="divcontent">
        <div class="wrapper">
            <div class="repeat" id="divgtax">
                <div class="tittle">
                </div>
                <div class="course">

                    <span id="tot" class="tot">纳税申报视频</span>
                    <br>
                    <span id="stot" class="stot"></span>
                    <div class="sect"></div>
                    <ul class="show" id="showGtax">
                        <%--<li class="colu">
                            <div class="png"></div>
                            <span>第一节 一般人纳税人增值税纳税申报</span>
                            <a class="play" href="/JLStudent/Video/Play?vid=246bb7e7a4f3c1b01317c3dc7e7bd41d_2&amp;buyid=19471&amp;videoid=e5464af6881642efae7fbf4dfbf7a2bd"
                                target="_blank">播放</a>
                        </li>
                        <li class="colu">
                            <div class="png"></div>
                            <span>第二节 增值税附加</span>
                            <a class="play" href="/JLStudent/Video/Play?vid=246bb7e7a43f4335cc7f2f7e72cd6766_2&amp;buyid=19471&amp;videoid=3cb6ba719f0f4c5f96e60e493a69b052"
                                target="_blank">播放</a>
                        </li>--%>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
</body>

</html>
