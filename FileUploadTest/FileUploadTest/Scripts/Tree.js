$(function () {
    //悬停
    $(".node_leave").hover(function () {
        $(this).addClass("node_hover");
        $(this).children("a").addClass("a_hover");
    }, function () {
        $(this).removeClass("node_hover");
        $(this).children("a").removeClass("a_hover");
    });
    //点击打开（上下）
    $(".node_title").click(function () {
        var open = $(this).children("div:last");

        var mark = $(open).prev().attr("class");

        $("." + mark + ":not(:first)").each(function () {
            $(this).next().slideToggle("slow");
        });

        if ($(open).attr("class") == "title_down") {
            $(open).removeClass("title_down");
            $(open).addClass("title_up");
        } else {
            $(open).removeClass("title_up");
            $(open).addClass("title_down");
        }
    });
    //点击打开（左右）
    $(".div_middle>img").click(function () {
        var ImgUrl = $(this).attr("src");
        var Dom = $(this);
        //alert(ImgUrl);

        //x=width-1220
        var Correction = 0;
        if ($("html").width() * 1 > 1440)
            Correction = $("html").width() * 1 - 1440;//修正

        if (ImgUrl == "/Img/Tree/middle_close.png") {
            $(".div_left").css({ "overflow-y": "hidden" });
            $(".left_group").animate({ width: 12 }, "slow", function () {
                $(".div_left").css({ "width": "0px" });
                $(Dom).attr("src", "/Img/Tree/middle_open.png");
            });
            //.div_bread,.div_right 1220+207=1427+x
            //左右壳
            $(".div_bread,.div_right").animate({ left: 13, right: 0, width: 1427 + Correction }, "slow");
            //分页控件 305+110=415+x/2
            $(".div_Paging").animate({ right: 415 + Correction / 2 }, "slow");

        } else {
            $(".div_left").css({ "width": "207px" });
            $(".left_group").animate({ width: 220 }, "slow", function () {
                $(Dom).attr("src", "/Img/Tree/middle_close.png");
                $(".div_left").css({ "overflow-y": "auto" });
            });
            //1220+x
            $(".div_bread,.div_right").animate({ left: 220, right: 0, width: 1220 + Correction }, "slow");
            //305+x/2
            $(".div_Paging").animate({ right: 305 + Correction / 2 }, "slow");
        }
    });
    //个人中心
    $(".PersonalCenter").click(function () {
        //移除上次点击
        $(".node_click").eq(0).attr({ "class": "node_leave" });
        $(".a_click").eq(0).attr({ "class": "a_leave" });
        MyAjax("/Home/PersonalCenter", null, CreatPersonalCenter, "Post", function () { alert("个人中心") });
    });
    //请求用户名
    MyAjax("/Home/GetUserName", null, CreateUserName, "Get", function () { alert("用户名") });
});
//个人中心创建
function CreatPersonalCenter(html) {
    //alert(html);
    $(".div_right").html(html);
}
//用户名创建
function CreateUserName(html) {
    //alert(html);
    $(".UserName").html(html);
}
//点击跳转
function Click_a(Dom, Url) {
    //移除上次点击
    $(".node_click").each(function () {
        $(this).removeClass("node_click");
        $(this).children("a").removeClass("a_click");
    });
    //添加这次点击
    $(Dom).addClass("a_click");
    $(Dom).parent().addClass("node_click");
    //存树节点
    //alert($(Dom).attr("id"));
    SeaveSelectTree($(Dom).attr("id"), $(Dom).text());
    CreateBreadUrl($(Dom).text());
    //发请求
    if (Url != "") {
        var Data = { "TreeId": $(Dom).attr("id") };
        MyAjax(Url, Data, CreateRightHtml, "Post", function () { alert("世界树") });
    } else {
        alert("请检查地址");
    }
}
//创建用户名
function CreateRightHtml(html) {
    $(".div_right").html(html);
}
//存选择的树
function SeaveSelectTree(Id, Name) {
    var Data = { "Id": Id, "Name": Name };
    MyAjax("/Base/SeaveSelectTree", Data, CreateSeaveSelectTree, "Get", function () { alert("选择树") });
}
//创建选择的树
function CreateSeaveSelectTree(rel) {
    IsToLogin(rel);
}
//创建面包地址
function CreateBreadUrl(Name) {
    $(".div_bread>ul>li").remove();
    $(".div_bread>ul").html("<li>" + Name + "</li>");
}