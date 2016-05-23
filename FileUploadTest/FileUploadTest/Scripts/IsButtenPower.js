
//检查按钮权限
var CountP = $("input[class='P']").length;
var HtmlPowerId = "P";
if (CountP * 1 > 0) {
    $("input[class='P']").each(function () {
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
