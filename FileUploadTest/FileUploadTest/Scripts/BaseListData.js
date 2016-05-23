var MarkId = GetShowArea();
var NewPageCount = $.trim($("#" + MarkId + " input[name='NewPageCount']").val());
var NewPageNumber = $.trim($("#" + MarkId + " input[name='NewPageNumber']").val());
var NewPageSize = $.trim($("#" + MarkId + " input[name='NewPageSize']").val());

//alert(NewPageCount + "-" + NewPageNumber + "-" + NewPageSize);
//页面赋值
$("#" + MarkId + " span.PageCount").text(NewPageCount);
$("#" + MarkId + " span.PageNumber").text(NewPageNumber);
$("select.PageSize>option").each(function () {
    if ($(this).val() == NewPageSize) {
        $(this).attr("selected", "selected");
    }
});
//参数赋值
$("#" + MarkId + " input[name='Page.PageCount']").val(NewPageCount);
$("#" + MarkId + " input[name='Page.PageNumber']").val(NewPageNumber);
$("#" + MarkId + " input[name='Page.PageSize']").val(NewPageSize);
//alert(NewPageCount + "-" + NewPageNumber + "-" + NewPageSize);

//alert("霓虹灯，光棒");
var i = 1;
$("#" + MarkId + " .ListData>ul").each(function () {

    if (i * 1 % 2 == 0) {
        //淡蓝
        $(this).css({ "background-color": "rgba(229, 248, 254, 1)" });
        //悬停
        $(this).hover(function () {
            //土黄
            $(this).css({ "background-color": "rgba(255, 237, 209, 1)" });
        }, function () {
            $(this).css({ "background-color": "rgba(229, 248, 254, 1)" });
        });
    } else {
        //悬停
        $(this).hover(function () {
            $(this).css({ "background-color": "rgba(255, 237, 209, 1)" });
        }, function () {
            //白
            $(this).css({ "background-color": "rgba(255, 255, 255, 1)" });
        });
    }
    i = i * 1 + 1;
    //查看，重新指派
    var html = "<img class='img_see' alt='查看' src='/Img/img_See.png' title='查看' onclick='ClickSee(this)' />";
    html += "<img class='img_AgainAssignment' alt='重新指派' src='/Img/img_AgainAssignment.png' title='重新指派' onclick=ClickAgainAssignment(this) />";
    //尾部添加
    $(this).find(".li_operation").append(html);
    //置顶变红
    if ($(this).find("input[class='TopData']").val() == "1") {
        $(this).css({ "color": "red" });
    }
    //alert($("#" + MarkId + " .ListData ul").length);
    //alert($("#EmptyData").length);
    //添加复选框
    if ($("#" + MarkId + " input[name='IsBatchAssignment']").val() == "1" && $("#EmptyData").length == 0) {
        html = "";
        html += "<li class='li_BatchAssignment'>";
        html += "<input style='visibility:hidden' class='checkbox_AgainAssignment' type='checkbox' onclick=SingleBatchAssignment(this) />";
        //html += "<input style='display:none' class='checkbox_AgainAssignment' type='checkbox' onclick=SingleBatchAssignment(this) />";
        html += "</li>";
        $(this).prepend(html);
    }
});
//全隐藏要用visibility:hidden使元素站位
$(".li_operation img").css({ "visibility": "hidden" });
//$(".li_operation img").css({ "display": "none" });
//数据级显示
//批量指派控制显隐
MyAjax("/Base/DisplayAssign/", null, DisplayAssign, "Post", function () { alert("显隐重新指派") });
//显隐重新指派
function DisplayAssign(rel) {
    if (rel != "") {
        var str = rel;
        var strArray = str.split(",");
        //alert(strArray[0]);
        $(".ListData ul").each(function () {
            var FormStateId = $(this).find("input[class='FormStateId']").val();
            //alert(FormStateId);
            for (var i = 0; i < strArray.length - 1; i++) {
                //alert(strArray[i]);
                if (strArray[i] == FormStateId) {
                    //alert(strArray[i]);
                    //alert(FormStateId);
                    $(this).find(".li_operation img").each(function () {
                        //alert($(this).attr("class"));
                        var HtmlClass = $(this).attr("class");
                        //复选框显示
                        if (HtmlClass == "img_AgainAssignment") {
                            $(this).parents("ul").find(".checkbox_AgainAssignment").css({ "visibility": "visible" });
                            //$(this).parents("ul").find(".checkbox_AgainAssignment").css({ "display": "block" });
                            //批量指派显示
                            $(this).css({ "visibility": "visible" });
                            //$(this).css({ "display": "block" });
                        }
                    });
                }
                //alert(i);
            }
            //alert("zxc");
        });
    }
}
//查看显示
//MyAjax("/Base/PowerSee/", null, PowerSee, "Post", function () { alert("查看显示") });
function PowerSee(rel) {
    if (rel != "") {
        var str = rel;
        var strArray = str.split(",");
        //alert(strArray[0]);
        $(".ListData ul").each(function () {
            var FormStateId = $(this).find("input[class='FormStateId']").val();
            //alert(FormStateId);
            for (var i = 0; i < strArray.length - 1; i++) {
                //alert(strArray[i]);
                if (strArray[i] == FormStateId) {
                    //alert(strArray[i]);
                    //alert(FormStateId);
                    $(this).find(".li_operation img").each(function () {
                        //alert($(this).attr("class"));
                        var HtmlClass = $(this).attr("class");
                        //查看显示
                        if (HtmlClass == "img_see")
                            $(this).css({ "visibility": "visible" });
                    });
                }
                //alert(i);
            }
            //alert("zxc");
        });
    }
}
//查看都显示
$(".img_see").css({ "visibility": "visible" });
//$(".img_see").css({ "display": "block" });

//审批，编辑，显示
MyAjax("/Base/PowerOther/", null, PowerOther, "Post", function () { alert("查看显示") });
function PowerOther(rel) {
    if (rel != "") {
        var str = rel;
        var strArray = str.split(",");
        //alert(strArray[0]);
        $(".ListData ul").each(function () {
            var FormStateId = $(this).find("input[class='FormStateId']").val();
            //alert(FormStateId);
            for (var i = 0; i < strArray.length - 1; i++) {
                //alert(strArray[i]);
                if (strArray[i] == FormStateId) {
                    //alert(strArray[i]);
                    //alert(FormStateId);
                    $(this).find(".li_operation img").each(function () {
                        //alert($(this).attr("class"));
                        var HtmlClass = $(this).attr("class");
                        //查看显示
                        if (HtmlClass != "img_see" && HtmlClass != "img_AgainAssignment")
                            $(this).css({ "visibility": "visible" });
                        //$(this).css({ "display": "block" });
                    });
                }
                //alert(i);
            }
            //alert("zxc");
        });
    }
}
//自动补齐li宽度
CompleteLi();
//都显示，测试专用
//$(".li_operation img").css({ "visibility": "visible" });

//盾牌
function DP(Loannumber, DP) {
    //提交申请
    var Url = "";
    if (DP == "/Img/TD_yellow.png") {
        Url = "/Base/Manual_DH_Add/" + Loannumber;
        MyAjax(Url, Data, function (rel) {
            alert(rel.msg);
            //刷新页面
            PagingQuery("All");
        }, "Post", function () { alert("黄色失败") });
    } else {
        Url = "/Base/DH_Select_BB/" + Loannumber;
        //alert($("#CKDHBG").attr("id"));
        $("#CKDHBG").attr({ "href": Url, "target": "_blank" });
        $("#_CKDHBG").click();
    }
}

//盾牌都显示
$(".DP").css({ "visibility": "visible" });
//图片剧中
$(".li_operation img").each(function () {
    //alert($(this).css("visibility"));
    if ($(this).css("visibility") == "hidden")
        $(this).css({ "display": "none" });
});