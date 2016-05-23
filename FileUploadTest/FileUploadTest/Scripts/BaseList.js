
//加载
$(function () {
    //添加面包地址
    AddBreadUrl();
    //自动创建
    AutomaticCreate();
    //绑定排序字段
    SetOrderByText()
});
//
//绑定排序字段
function SetOrderByText() {
    var MarkId = GetShowArea();
    $("#" + MarkId + " .ListTable>.ul_title>li").each(function () {
        var Dom = $(this);
        var Class = $(this).attr("class");
        if (Class != "li_operation" && Class != "li_BatchAssignment") {
            //添加img
            var html = "<img class='imgTitleUp' src='/Img/Tree/title_down.png' />";
            $(this).append(html);
            $(this).click(function () {
                var TempOrderByText = $(this).attr("class");
                //改变图片
                if ($(this).find("img").attr("src") == "/Img/Tree/title_down.png") {
                    //都向下互斥
                    $(".imgTitleUp").each(function () {
                        $(this).attr("src", "/Img/Tree/title_down.png");
                    });
                    $(this).find("img").attr("src", "/Img/Tree/title_up.png");
                    TempOrderByText += " asc";
                } else {
                    //都向下互斥
                    $(".imgTitleUp").each(function () {
                        $(this).attr("src", "/Img/Tree/title_down.png");
                    });
                    $(this).find("img").attr("src", "/Img/Tree/title_down.png");
                    TempOrderByText += " desc";
                }
                $("#" + MarkId + " input[name='OrderByText']").val(TempOrderByText);
                PagingQuery();
            });
        }
    });
}
//自动创建
function AutomaticCreate() {
    var MarkId = GetShowArea();
    var html = "";
    html += "<input type='hidden' name='Page.PageNumber' value='1' />";
    html += "<input type='hidden' name='Page.PageSize' value='10' />";
    html += "<input type='hidden' name='Page.PageCount' value='' />";
    //排序
    html += "<input type='hidden' name='OrderByText' value='' />";
    //alert(html);
    $("#" + MarkId + " form").prepend(html);
}
//创建数据加载
function CreateListData(html) {
    //alert(html);
    $("#" + GetShowArea() + " .ListData").html(html);
}
//分页查询
function PagingQuery(QueryMark) {
    var MarkId = GetShowArea();
    //地址
    var Url = $("#" + MarkId + " form").attr("action");
    if (QueryMark == "All") {
        //保存Seave至Query
        $("#" + MarkId + " input.Seave").each(function () {
            var SeaveName = $(this).attr("name");
            SeaveName = SeaveName.substring(SeaveName.lastIndexOf(".") + 1, SeaveName.length);
            var Value = $(this).val();
            //alert(SeaveName + "-" + Value);
            $("#" + MarkId + " input.Query").each(function () {
                var QueryName = $(this).attr("name");
                QueryName = QueryName.substring(QueryName.lastIndexOf(".") + 1, QueryName.length);
                if (SeaveName == QueryName) {
                    $(this).val(Value);
                }
            });
        });
        //表单赋值,当前页
        $("#" + MarkId + " input[name='Page.PageNumber']").val("1");
    }
    var Data = $("#" + MarkId + " form").serialize();
    //alert(Data);
    //Url += "/" + parseInt(Math.random() * (99 - 10 + 1) + 10);
    //alert(Url);
    MyAjax(Url, Data, CreateListData, "Post", function () { alert("数据加载失败") });
    //alert(MarkId);
}
//首页
function FirstPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //获取当前页
    var PageNumber = $.trim($("#" + MarkId + " input[name='Page.PageNumber']").val());
    //alert(PageNumber);
    if (PageNumber * 1 == 1) {
        alert("这就是首页");
    } else {
        //表单赋值
        $("#" + MarkId + " input[name='Page.PageNumber']").val("1");
        PagingQuery();
    }
}
//上一页
function PrevPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //获取当前页
    var PageNumber = $.trim($("#" + MarkId + " input[name='Page.PageNumber']").val());
    //alert(PageNumber);
    if (PageNumber * 1 - 1 >= 1) {
        //表单赋值
        $("#" + MarkId + " input[name='Page.PageNumber']").val(PageNumber * 1 - 1);
        PagingQuery();
    } else {
        alert("已到首页");
    }
}
//下一页
function NextPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //alert(MarkId);
    //获取当前页
    var PageNumber = $.trim($("#" + MarkId + " input[name='Page.PageNumber']").val());
    //获取总页
    var PageCount = $.trim($("#" + MarkId + " input[name='Page.PageCount']").val());
    //alert(PageNumber + "-" + PageCount);
    if (PageNumber * 1 + 1 <= PageCount * 1) {
        //表单赋值
        $("#" + MarkId + " input[name='Page.PageNumber']").val(PageNumber * 1 + 1);
        PagingQuery();
    } else {
        alert("已到尾页");
    }
}
//尾页
function LastPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //获取当前页
    var PageNumber = $.trim($("#" + MarkId + " input[name='Page.PageNumber']").val());
    //获取总页
    var PageCount = $.trim($("#" + MarkId + " input[name='Page.PageCount']").val());
    //alert(PageNumber + "-" + PageCount);
    if (PageNumber * 1 == PageCount * 1) {
        alert("这就是尾页");
    } else {
        //表单赋值
        $("#" + MarkId + " input[name='Page.PageNumber']").val(PageCount);
        PagingQuery();
    }
}
//每页
function NumberPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //获取选中
    var PageSize = $("#" + MarkId + " select.PageSize>option:selected").val();
    //alert(PageSize);
    //表单赋值
    $("#" + MarkId + " input[name='Page.PageSize']").val(PageSize);
    $("#" + MarkId + " input[name='Page.PageNumber']").val("1");
    PagingQuery();
}
//跳转
function ToPage() {
    ClearSelectAgainAssignment();
    var MarkId = GetShowArea();
    //获取跳转
    var ToPageNumber = $.trim($("#" + MarkId + " input[name='ToPageNumber']").val());
    //获取总页数
    var PageCount = $.trim($("#" + MarkId + " input[name='Page.PageCount']").val());
    //验证跳转输入
    var reg = /^(([1-9]{1})|([1-9]{1}[0-9]{1,}))$/;
    if (reg.test(ToPageNumber)) {
        //小于总页数
        if (ToPageNumber * 1 <= PageCount * 1) {
            //表单赋值
            $("#" + MarkId + " input[name='Page.PageNumber']").val(ToPageNumber);
            PagingQuery();
        } else {
            alert("超过总页数");
        }
    } else {
        alert("非法字符");
    }
    $("#" + MarkId + " input[name='ToPageNumber']").val("");
}
//添加面包地址
function AddBreadUrl() {
    var MarkId = GetShowArea();
    //alert(MarkId);
    var NewBreadUrl = $("#" + MarkId + " .BreadUrl").val();
    //alert(NewBreadUrl);
    //alert($(".div_bread>ul").html());
    if ($(".div_bread>ul>li").length * 1 > 1) {
        $(".div_bread>ul>li:last").remove();
    }
    $(".div_bread>ul").append("<li>" + NewBreadUrl + "</li>");
}
//清除批量指派选择
function ClearSelectAgainAssignment() {
    if ($("#" + MarkId + " input[name='IsBatchAssignment']").val() == "1") {
        $("#" + MarkId + " ul").each(function () {
            $(this).find("input[type='checkbox']").attr("checked", false);
        });
    }
}
//查看
function ClickSee(Dom) {
    SelectRow(Dom);
    //标记选中行
    $(Dom).parents("ul").find("input[class='SelectRow']").val("1");
    //获取当前数据表单状态

    //显示查看模版
    $(".Area").css({ "display": "none" });
    $("#SeeTemp").css({ "display": "block" });
    //环节
    var FromStateId = $(Dom).parents("ul").find("input[class='FormStateId']").val();
    //主键
    var FormId = $(Dom).parents("ul").find("input[class='PrimaryKey']").val();
    //拼接
    //var Url = "/SeeTemp/GetShowTemp?FormStateId=" + FromStateId + "&FormId=" + FormId;
    var Data = { "FromStateId": FromStateId, "FormId": FormId }
    MyAjax("/SeeTemp/GetShowTemp/", Data, ShowTab, "Post", function () { alert("Tab显示") });

}
//选中行
function SelectRow(Dom) {
    return false;
    var MarkId = GetShowArea();
    $("#" + MarkId + " .ListData>ul").each(function () {
        $(this).css({ "color": "black" });
    });
    //黄
    $(Dom).parents("ul").css({ "color": "rgba(255, 114, 0, 1)" });
}
//返回列表页,Query是否查询
function ReturnListPage(Query) {
    //关闭所有区域
    $(".Area").css({ "display": "none" });
    //显示列表区域
    $("#List").css({ "display": "block" });
    if (Query != null) {
        //看要求啦
    }
}

//下载专用
function ClickDownLaod() {
    //alert($("#EmptyData").length);
    if ($("#EmptyData").length == 0) {
        $("input[name='IsDownLoad']").val("true");
        $("#" + GetShowArea() + " form").submit();
        $("input[name='IsDownLoad']").val("false");
    } else {
        alert("无数据可下载");
    }
}

//自动补齐li宽度
function CompleteLi() {
    //alert($("#RemovePadding").val());
    if ($("#RemovePadding").val() != "") {
        var ul_title = $(".ul_title").width() * 1;
        var widthPadding = "2.5%"
        if ($("#" + GetShowArea() + " .ul_title li").length > 15) {
            widthPadding = "2%"
        }
        if ($("input[name='IsBatchAssignment']").val() != "1") {
            //标题
            $("#" + GetShowArea() + " .ListTable ul").each(function () {
                $(this).find("li").each(function () {
                    if ($(this).css("display") != "none") {
                        $(this).css({ "padding-left": widthPadding });
                        return false;
                    }
                });
                $(this).find("li:last").css({ "padding-right": widthPadding });
            });
        }
    }
}