//去添加页
function ToAdd(Url) {
    $(".Area").each(function () {
        $(this).css({ "display": "none" })
    });
    //清除之前页
    $("#Add").html("");
    //显示增加
    $("#Add").css({ "display": "block" });
    //请求页面
    MyAjax(Url, {}, function (result) {
        //刷新数据
        $("#Add").html(result);
        //添加面包地址
        AddBreadUrl();
    }, "POST");
}
//去修改页
function ToUpdate(Url, id) {
    $(".Area").each(function () {
        $(this).css({ "display": "none" })
    });
    //清除之前页
    $("#Add").html("");
    //显示增加
    $("#Add").css({ "display": "block" });
    //请求页面
    MyAjax(Url, { id: id }, function (result) {
        //刷新数据
        $("#Add").html(result);
        //添加面包地址
        AddBreadUrl();
    }, "POST");
}
//去详情页
function ToInfo(Url, id) {
    $(".Area").each(function () {
        $(this).css({ "display": "none" })
    });
    $("#Add").html("");
    //显示增加
    $("#Add").css({ "display": "block" });
    //请求页面
    MyAjax(Url, { id: id }, function (result) {
        //刷新数据
        $("#Add").html(result);
        //添加面包地址
        AddBreadUrl();
    }, "POST");
}
//返回列表页
function AddReturn() {
    //隐藏其他
    $(".Area").each(function () {
        $(this).css({ "display": "none" })
    });
    //显示列表
    $("#List").css({ "display": "block" });
    //添加面包地址
    AddBreadUrl();
    //执行查询
    PagingQuery();
}
//删除操作
function del(Url, id) {
    if (!confirm("确定删除吗？"))
        return;
    MyAjax(Url, { id: id }, function (res) {
        if (res.result == 1) {
            new MyAlert('', '删除成功！', null, true).Show();
            PagingQuery('List', 'All');
        }
        else if (res.result == 2) {
            new MyAlert('提交', res.msg, null, true).Show();
        } else {
            new MyAlert('', res.msg, null, true).Show();
        }
    }, "POST", function (err) {
        new MyAlert('', err, null, true).Show();
    });
}