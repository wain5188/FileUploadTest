
//解绑，防止重复绑定
$("a[name*='.TDBG']").each(function () {
    $(this).unbind("click");
});
//同盾报告-生成
$("a[name*='.TDBG']").click(function () {   
    //alert("1");
    var Dom = $(this);
    if (Dom.text() == "生成报告") {
        $("input[name='TdClickMark']").val(Dom.attr("name"));
        var Url = "/Application/GetTDId";
        //打开，姓名，身份证，电话1 
        $("input[name$='.Customer']").removeAttr("disabled");
        $("input[name$='.Cardinfo']").removeAttr("disabled");
        $("input[name$='.MobileA']").removeAttr("disabled");
        var Data = $("#form_Paper").serialize();
        if ($("#Model_State").val() == "See") {
            //alert();
            $("input[name$='.Customer']").attr("disabled", "disabled");
            $("input[name$='.Cardinfo']").attr("disabled", "disabled");
            $("input[name$='.MobileA']").attr("disabled", "disabled");
        }
        MyAjax(Url, Data, function (Result) {
            if (Result.State == "1") {
                //改报告
                Dom.text(Result.Result);
                var Href = "/Application/GetTD/" + Result.Result;
                Dom.attr({ "href": Href, "target": "_blank" });
                Dom.prev().val(Result.Result);
            } else {
                alert(Result.Msg);
            }
        }, "Post", function () { alert("此人未申请同盾验证！") });
    } else {
        $(this).unbind("click");
    }
});
//借款人同上
function S_Ditto(Dom) {
    if (Dom.prop("checked") == true) {
        var Mark = "";
        var str = Dom.attr("name");
        if (str.indexOf(".") > 0) {
            Mark = str.substring(0, str.indexOf("."));
        }
        //
        var M1 = Mark + ".Ditto";
        var M2 = Mark + ".SpouseViewModel.DittoBase";
        //
        var Temp1 = $("select[name='" + Mark + ".Province'] option:selected").val();
        var Temp2 = $("select[name='" + Mark + ".City'] option:selected").val();
        var Temp3 = $("select[name='" + Mark + ".District'] option:selected").val();
        var Temp4 = $("input[name='" + Mark + ".Address']").val();
        //
        if (Dom.attr("name") == M1) {
            //省
            $("select[name='" + Mark + ".Domicileprovince']").val(Temp1);
            $("select[name='" + Mark + ".Domicileprovince']").trigger("change");
            //市
            $("select[name='" + Mark + ".Domicilecity']").val(Temp2);
            $("select[name='" + Mark + ".Domicilecity']").trigger("change");
            //区
            $("select[name='" + Mark + ".Domiciledistrict']").val(Temp3);
            //其他
            $("input[name='" + Mark + ".Domicileaddress']").val(Temp4);
        } else if (Dom.attr("name") == M2) {
            //省
            $("select[name='" + Mark + ".SpouseViewModel.Province']").val(Temp1);
            $("select[name='" + Mark + ".SpouseViewModel.Province']").trigger("change");
            //市
            $("select[name='" + Mark + ".SpouseViewModel.City']").val(Temp2);
            $("select[name='" + Mark + ".SpouseViewModel.City']").trigger("change");
            //区
            $("select[name='" + Mark + ".SpouseViewModel.District']").val(Temp3);
            //其他
            $("input[name='" + Mark + ".SpouseViewModel.Address']").val(Temp4);
            //alert(Temp1 + "-" + Temp2 + "-" + Temp3 + "-" + Temp4);
        }
    }
}
//绑定同上
$("input[name$='.Ditto']").each(function () {
    //alert(1);
    if ($(this).attr("type") == "checkbox") {
        //alert(2);
        $(this).click(function () {
            S_Ditto($(this));
        });
    }
});


//绑定同申请人
$("input[name$='.SpouseViewModel.DittoBase']").each(function () {
    //alert(1);
    if ($(this).attr("type") == "checkbox") {
        //alert(2);
        $(this).click(function () {
            S_Ditto($(this));
        });
    }
});
//详细地址
//.Domicileaddress
$("input[name$='.Address']").each(function () {
    var dom = $(this);
    var name = dom.attr("name");
    if ($.trim(dom.val()) == "") {
        dom.css({ "color": "gray" });
        dom.val("详细地址");
    }
    dom.focus(function () {
        //多次会绑定2遍
        if (dom.val() == "详细地址") {
            dom.val("");
        }
    });
});
$("input[name$='.Domicileaddress']").each(function () {
    var dom = $(this);
    var name = dom.attr("name");
    if ($.trim(dom.val()) == "") {
        dom.css({ "color": "gray" });
        dom.val("详细地址");
    }
    dom.focus(function () {
        //多次会绑定2遍
        if (dom.val() == "详细地址") {
            dom.val("");
        }
    });
});