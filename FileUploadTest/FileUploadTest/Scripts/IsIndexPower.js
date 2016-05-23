//检查按钮权限
var CountP = $("input[class='B']").length;
var HtmlPowerId = "B";
if (CountP * 1 > 0) {
    $("input[class='B']").each(function () {
        var PowerId = $(this).val();
        HtmlPowerId += PowerId;
        var Data = { "PowerId": PowerId }
        MyAjax("/Base/IsButtenPower/", Data, ShowPowerButten, "Post", function () { alert("按钮失败") });
    });
}
//展示权限按钮
function ShowPowerButten(rel) {
    if (rel != "1") {
        $("." + HtmlPowerId).css({ "display": "none" });
    }
}