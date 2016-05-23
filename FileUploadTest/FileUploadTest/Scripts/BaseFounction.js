//是否跳转登录
//function IsToLogin(rel) {
//    if (rel == "X") {
//        top.window.location = '/Home/Login';
//        return false;
//    } else {
//        return true;
//    }
//}
////获取当前显示区域Id
//function GetShowArea() {
//    var MarkId = "";
//    $(".Area").each(function () {
//        if ($(this).css("display") == "block")
//            MarkId = $(this).attr("id");
//    });
//    return MarkId;
//}
//灰模版
function OpenGrayTemp() {
    //alert($(document).height());
    $("#GrayTemp").css({ "display": "block", "height": $(document).height() + "px", "width": $(document).width() + "px" });
}
function CloseGrayTemp() { $("#GrayTemp").css({ "display": "none" }); }

var WaitingWin = new MyMessage('', '正在处理，请稍候。。。', null, -1);
//封装ajax提交
//url:请求地址 data:json格式请求参数 successFun:请求成功后回调函数 method：POST|GET
function MyAjax(url, data, successFun, method, errorFun, async, processData) {
    var Url = (url.indexOf('?') > -1 ? url : url + "?1=1") + "&t=" + new Date().getTime();
    WaitingWin.Show();
    $.ajax({
        async: async || false,
        url: Url,
        data: data,
        processData: processData || true,
        type: method || "POST",
        cache: false,
        success: function (res) {
            WaitingWin.Hide();
            if (res == "X") {//Sesson过期
                top.window.location = '/Home/Login';
                return false;
            } else {
                if (typeof (successFun) == "function")
                    successFun(res);
            }
        },
        error: function (err) {
            WaitingWin.Hide();
            if (typeof (errorFun) == "function")
                errorFun(err);
        }
    });
}

/******************
通用校验
*******************/
// 身份证号验证
function isIdCard(cardid) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(cardid)
}
//手机号码校验
function MyCheckMobile(mobleNum) {
    //return /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(mobleNum);
    return /^[0-9]{11}$/.test(mobleNum);
}
//固定电话校验
function MyCheckTel(tel) {
    return /^(\d{3,4}-)?\d{7,8}$/.test(tel);
}
//申请金额校验（数字小于100，且精确到小数点后四位）
function MyCheckMoney(money) {
    return /^[0-9]{1,2}(\.[0-9]{1,2})?$/.test(money);
}
//详细地址长度校验（不超过25个字符）
function MyCheckAddress(address) {
    return address.length <= 25;
}

//悬浮提示框
//obj:鼠标悬停对象 
//content:提示信息（可以是html） 
//css:样式(可以不传，可以为null，可以为{})，例如{'color':'#ff0000;','width':'100px'}
//调用方式：<a onmouserover="MyTooltip(this, 'hello', {'color':'red'})">xxxxx</a>
function MyTooltip(obj, content, css) {
    var tip = $(document.createElement("div"));
    var delay = 2000;//延迟时间ms
    $("body").append(tip);
    tip.html(content);
    tip.css({
        "width": "auto",
        "height": "auto",
        "background-color": "#e6f4ff",
        "position": "absolute",
        "color": '#0c3881',
        "border": '1px #7ecdf4 solid',
        "z-index": "999999999",
        "text-align": "left",
        "font-size": "12px",
        "padding": "5px"
    });
    tip.css(css || {});
    tip.css({
        "left": $(obj).offset().left,
        "top": $(obj).offset().top + $(obj).height() + 10,
    });
    $(obj).mouseenter(function () {
        tip.show();
    });
    $(obj).mouseout(function () {
        tip.hide();
    });
}

/*闪烁效果
调用：
    MyFlash($("#dom_id"),'0.8',300,3);
参数：
    obj:设置闪烁的dom对象;opacity：透明度;
*/
function MyFlash(obj, opacity, duration, times) {
    if ($(obj).attr("isFlash") != null)
        return;
    $(obj).attr("isFlash", "1");
    var current = $(obj).css('opacity');
    while (times-- > 0) {
        $(obj).animate({ 'opacity': opacity || '0.6' }, duration / 2);
        $(obj).animate({ 'opacity': current }, duration / 2);
    }
    $(obj).removeAttr("isFlash");
}

//可拖动对象
//sender:响应鼠标拖动事件的对象
//draggableObj：要拖动的对象
function MyDraggable(sender, draggableObj) {
    var needMove = false;
    var pageX = 0;
    var pageY = 0;

    //需要拖动的目标DIV  
    var element = $(draggableObj);
    var eWidth = element.width();
    var eHeight = element.height();
    var handller = $(sender);

    //在该DIV的范围内拖动  
    var pElement = $(top.window);
    var pWidth = pElement.width();
    var pHeight = pElement.height();

    $(draggableObj).css({
        "position": "absolute",
        "z-index": "999"
    });

    handller.mousedown(function (event) {
        needMove = true;
        var position = element.position();
        pageX = event.pageX - position.left; //鼠标和DIV的相对坐标  
        pageY = event.pageY - position.top;

        element.css('cursor', 'move');

    });

    handller.mouseup(function (event) {
        needMove = false;
        element.css('cursor', 'default');
    });

    handller.mousemove(function (event) {
        if (!needMove) { return; }

        //鼠标在页面的坐标 - 鼠标和DIV的相对坐标 = DIV在页面的坐标          
        var ePageX = event.pageX;
        var ePageY = event.pageY;

        var x = ePageX - pageX;
        var y = ePageY - pageY;
        if (ePageX <= eWidth / 2 || ePageX >= pWidth - eWidth / 2) {
            return;
        }

        if (ePageY < eHeight / 2 || ePageY >= pHeight - eHeight / 2) {
            return;
        }
        element.css("left", x);
        element.css("top", y);
    });
}

/*弹出窗体
调用：
var d = new MyDialog("dialog_01", "title", "hello", { "width": "300px", "height": "400px" });
d.contentAlign = "center"; d.contentValign = "middle"; d.Show();
参数：
id:窗体dom元素id属性 title:标题信息（可以是html）content:内容（可以是html）
css:窗体的样式（可缺省）closeCallback:窗体关闭后的执行函数*/
function MyDialog(id, title, content, css, beforeCloseFun, afterCloseFun) {
    this.dialogId = id;
    this.title = title || "";//标题内容
    this.content = content || "";//窗体内容
    this.css = css || {};//窗体样式
    this.parent = 'body';//窗体父节点对象
    this.okBtn = null;//确定按钮
    this.cancelBtn = null;//取消按钮
    this.closeBtn = null;//关闭按钮
    this.beforeCloseFun = beforeCloseFun;//关闭前执行函数
    this.afterCloseFun = afterCloseFun;//关闭后执行函数
    this.okBtnText = "保 存";
    this.cancelBtnText = "返 回";
    this.dialogDiv = null;//主窗体
    this.titleDiv = null;//标题栏
    this.contentTbl = null;//窗体主体部分table
    this.contentAlign = "left";//内容水平对齐方式
    this.contentValign = "top";//内容垂直对齐方式
    this.draggable = true;//是否可拖动
    this.mod = false;//是否模式窗体
    this.modDiv = null;
    this.Init = function () {
        if (this.mod) {
            if (this.modDiv == null) {
                this.modDiv = $(document.createElement("div"));
                this.modDiv.css({
                    "position": "absolute",
                    "left": "0",
                    "top": "0",
                    "width": $(document).width(),
                    "height": $(document).height(),
                    "opacity": "0.8",
                    "background": "#bfbfbf",
                    "z-index": "998"
                });
                $(this.parent).append(this.modDiv);
                this.modDiv.attr("id", "twc_mod_div01");

            }
            $(window).resize(this, function (e) {
                e.data.modDiv.css({
                    "width": $(document).width(),
                    "height": $(document).height()
                });
            });
        }
        if (this.dialogDiv == null) {
            this.dialogDiv = $(document.createElement("div"));

            $(this.parent).append(this.dialogDiv);
            this.dialogDiv.attr("id", this.dialogId);
            this.dialogDiv.css({
                "opacity": "1",
                "width": "400px",
                "height": "200px",
                "position": "absolute",
                "border": "1px #90c2e5 solid",
                "background": "#e0f2ff",
                "z-index": "999"
            });
            //标题栏
            this.titleDiv = $(document.createElement("div"));
            this.titleDiv.addClass("titleDiv");
            this.dialogDiv.append(this.titleDiv);
            this.titleDiv.css({
                //"position": "absolute",
                //"top": "0", "left": "0",
                "width": "100%",
                "height": "38px",
                "line-height": "38px",
                "text-align": "center",
                "color": "#ffffff",
                "font-weight": "bold",
                "font-size": "14px",
                'cursor': (this.draggable ? 'move' : 'default'),
                "background": "url('/Content/Image/person_bg.png') repeat-x"
            });
            this.titleDiv.html(this.title);

            //内容部分
            this.contentTbl = $(document.createElement("table"));
            this.dialogDiv.append(this.contentTbl);
            var tr_1 = $(document.createElement("tr"));
            this.contentTbl.append(tr_1);
            var td_1_1 = $(document.createElement("td"));
            tr_1.append(td_1_1);
            this.contentTbl.attr({
                "cellspacing": "0", "cellpadding": "0", "border": "0"
            });

            td_1_1.css({
                "width": "100%",
                "overflow": "hidden"
            });
            td_1_1.html(this.content);
            td_1_1.attr({
                "align": this.contentAlign,
                "valign": this.contentValign
            });

            //ok、cancel 按钮部分
            if (this.okBtn != null || this.cancelBtn != null) {
                var tr_2 = $(document.createElement("tr"));
                this.contentTbl.append(tr_2);
                var td_2_1 = $(document.createElement("td"));
                tr_2.append(td_2_1);
                td_2_1.css({
                    "width": "100%",
                    "height": "50px"
                });
                td_2_1.attr({ "align": "center", "valign": "middle" });
                if (this.okBtn != null) {
                    td_2_1.append(this.okBtn);
                }
                if (this.cancelBtn != null) {
                    td_2_1.append(this.cancelBtn);
                }
            }
            //设置窗体关闭按钮
            if (this.closeBtn == null) {
                this.closeBtn = $(document.createElement("img"));
                this.titleDiv.append(this.closeBtn);
                this.closeBtn.attr("src", "/Content/Image/wrong.png");
                this.closeBtn.css({
                    "vertical-align": "middle",
                    "cursor": "pointer",
                    "position": "absolute",
                    "right": "5px",
                    "top": "5px",
                    "margin": "5px"
                });
                this.closeBtn.click(this, function (e) {
                    e.data.Hide();
                });
            }

            //设置可拖动
            if (this.draggable)
                MyDraggable(this.titleDiv, this.dialogDiv);

            if (this.mod) {
                this.modDiv.click(this.dialogDiv, function (e) {
                    MyFlash(e.data, '0.5', 200, 3);
                });
            }
        }
        this.dialogDiv.append(this.contentTbl);
        this.dialogDiv.css(this.css);
        this.dialogDiv.css({
            "left": (window.screen.availWidth - this.dialogDiv.width()) / 2,
            "top": (window.screen.availHeight - this.dialogDiv.height()) / 2 + document.documentElement.scrollTop,
        });
        $(window).scroll(this, function (e) {
            e.data.dialogDiv.css({
                "left": (window.screen.availWidth - e.data.dialogDiv.width()) / 2,
                "top": (window.screen.availHeight - e.data.dialogDiv.height()) / 2 + document.documentElement.scrollTop,
            });
        });
        $(window).resize(this, function (e) {
            e.data.dialogDiv.css({
                "left": (window.screen.availWidth - e.data.dialogDiv.width()) / 2,
                "top": (window.screen.availHeight - e.data.dialogDiv.height()) / 2 + document.documentElement.scrollTop,
            });
        });
        this.contentTbl.css({
            "opacity": "1",
            "width": "100%",
            "height": this.dialogDiv.height() - this.titleDiv.height(),
            "padding": "5px",
            "overflow": "hidden"
        });
    }
    //显示窗体
    this.Show = function () {
        if (this.dialogDiv == null)
            this.Init();
        if (this.mod)
            this.modDiv.show();
        this.dialogDiv.show();
        return this;
    }
    //隐藏窗体
    this.Hide = function () {
        if (typeof (this.beforeCloseFun) == "function")
            this.beforeCloseFun();
        if (this.dialogDiv != null)
            this.dialogDiv.hide();
        if (this.modDiv != null)
            this.modDiv.hide();
        if (typeof (this.afterCloseFun) == "function")
            this.afterCloseFun();
        return this;
    }
    //移除窗体
    this.Remove = function () {
        if (this.dialogDiv != null)
            this.dialogDiv.remove();
        if (this.modDiv != null)
            this.modDiv.remove();
        return this;
    };

}

/*Alert消息弹出框
调用：
    var alt = new MyAlert('标题','<a>这是提示信息！</a>',{'width':'300','height':'180'}).Show();
参数：
    title:标题栏内容（可以是html）;message:提示信息内容（可以是html）;css:提示框的样式（格式与jQuery设置样式相同）;
    mod:是否模式窗体; closeCallback:窗体关闭后的执行函数
*/
function MyAlert(title, message, css, mod, beforeCloseFun, afterCloseFun) {
    this.dialog = new MyDialog("alert_dialog01", title, message, css || { "width": "300", "height": "180" });
    this.dialog.contentAlign = "center";
    this.dialog.contentValign = "middle";
    this.dialog.mod = mod || false;
    this.dialog.afterCloseFun = afterCloseFun;
    this.dialog.beforeCloseFun = beforeCloseFun;
    var okBtn = $(document.createElement("input"));
    okBtn.attr("type", "button");
    okBtn.attr("value", "确 定");
    this.dialog.okBtn = okBtn;
    this.dialog.okBtn.css({
        "border": "none",
        "background": "url('/Content/Image/person_an.png')",
        "width": "68px",
        "height": "27px",
        "cursor": "pointer",
        "margin": "10px"
    });
    this.dialog.okBtn.click(this, function (e) {
        e.data.Hide();
    });

    this.Show = function () {
        this.dialog.Show();
        this.dialog.okBtn.focus();
        return this;
    }
    this.Hide = function () {
        this.dialog.Hide();
        return this;
    }
    this.Remove = function () {
        this.dialog.Remove();
        return this;
    }
}

function MyMessage(title, content, css, duration) {
    this.dialogId = "twc_dialog_messageDialog";
    this.modId = "twc_dialog_messageDialog_modDiv";
    this.duration = duration || -1;
    this.dialog = null;
    this.Show = function () {
        this.dialog = new MyDialog(this.dialogId, title, content, css);
        this.dialog.closeBtn = true;
        this.dialog.mod = true;
        this.dialog.draggable = false;
        this.dialog.contentAlign = "center";
        this.dialog.contentValign = "middle";
        this.dialog.Show();
        this.dialog.modDiv.attr("id", this.modId);
        if (this.duration) {
            setTimeout(function () {
                $("#twc_dialog_messageDialog").remove();
                $("#twc_dialog_messageDialog_modDiv").remove();
            }, this.duration);
        }
        return this;
    };
    this.Hide = function () {
        this.dialog.Hide();
        return this;
    };
    this.Remove = function () {
        this.dialog.Remove();
        return this;
    }
}
/******************
上传
*******************/

//附件操作
function GetArea() {
    var ShowArea = null;
    $(".Area").each(function () {
        if ($(this).css("display") == "block") {
            ShowArea = this;
            return false;
        }
    });
    return ShowArea;
}
//上传文件
function MyUpload(url, fileFieldId, groupId, successFun, errorFun) {

    var formData = new FormData();
    var fileObj = $(GetArea()).find('input[id=' + fileFieldId + ']')[0].files;
    for (var i = 0; i < fileObj.length; i++) {
        formData.append('file' + i, fileObj[i]);
    }

    var groupId = $(GetArea()).find('input[id=' + groupId + ']').val();
    formData.append('groupId', groupId);

    var Url = (url.indexOf('?') > -1 ? url : url + "?1=1") + "&t=" + new Date().getTime();
    $.ajax({
        cache: false,
        url: Url,
        data: formData,
        type: "POST",
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success: function (res) {
            if (res == "X") {//Sesson过期
                top.window.location = '/Home/Login';
                return false;
            } else {
                if (typeof (successFun) == "function")
                    successFun(res);
            }
        },
        error: function (err) {
            if (typeof (errorFun) == "function")
                errorFun(err);
        }
    });
}
var uploadWait = new MyAlert('', '正在上传，请稍候。。。', null, true);
//上传
function upload(obj, subLen, width) {


    var files = $(GetArea()).find("input[id=fileToUploads]")[0].files;
    if (files == undefined)
        files = $(obj).parent().find("input[id=fileToUploads]")[0].files;
    var size = 0;
    for (var i = 0; i < files.length; i++) {
        size += files[i].size;
    }

    if (files.length < 1) {
        new MyAlert('上传失败', "请上传文件", null, true).Show();
        return;
    }
    if (size > 20 * 1024 * 1024) {
        new MyAlert('上传失败', "文件合计大小不可超过20MB", null, true).Show();
        return;
    }

    uploadWait.Show();
    MyUpload("/Base/Upload", 'fileToUploads', "groupId", function (res) {
        uploadWait.Hide();
        if (res.result == 1) {
            new MyAlert('文件', '上传成功！', null, true).Show();
            $(GetArea()).find("input[id=fileToUploads]").val("");
            $(GetArea()).find("input[id=groupId]").val(res.msg[0]);
            loadFile(res.msg[1], width);
            if (subLen)
                subFileName(subLen);
        }
        else {
            new MyAlert('上传出错', res.msg, null, true).Show();
        }
    });
}

function delFile(id) {
    MyAjax("/Base/delFile", { fileid: id }, function (res) {
        uploadWait.Hide();
        if (res.result == 1) {
            new MyAlert('文件', '删除成功！', null, true).Show();
            loadFile(res.msg);
        }
        else {
            new MyAlert('删除文件', res.msg, null, true).Show();
        }
    });
}

//徐梓翔
//批量下载
function DownloadFile() {

    var checkbox = $("input:checkbox[name='down_checkbox']:checked");
    var files = "";
    for (var i = 0; i < checkbox.length; i++) {
        files += ";" + checkbox.eq(i).val();
    }
    if (files == "") {
        new MyAlert('文件', '请选择文件下载！', null, true).Show();
        return;
    }

    files = files.substring(1);
    $("#downFile").val(files);
    $("#DownForm").submit();
}

//徐梓翔
//选取
function DownloadCheck() {

    var r = $("#AllCheck")[0].checked;
    var checkboxs = $("input:checkbox[name='down_checkbox']");

    if (r == true) {
        checkboxs.prop("checked", true);
    } else {
        checkboxs.removeAttr("checked");
    }
}

//加载文件列表
function loadFile(files, width) {
    var divHtml = "";
    if (files.length == 0)
        $(GetArea()).find('input[id=groupId]').val("");
    for (var i = 0; i < files.length; i++) {

        //var showpath = files[i].Showpath.substring(files[i].Showpath.lastIndexOf("."));
        //if (showpath == "doc" || showpath == "docx" || showpath == "xls" || showpath == "xlsx")
        //    showpath = "/generic/web/viewer.html?file=" + files[i].Showpath;
        //else
        //    showpath = files[i].Showpath;

        divHtml += "<div class='fileItem'>" +
        //"<img src='/Content/Image/link.png' style='float:left;' /><div class='fileName' title='" + files[i].Filename + "'><a href='" + showpath + "' target='_blank'>" + files[i].Filename + "</a>" +
        "<img src='/Content/Image/link.png' style='float:left;' /><div class='fileName' title='" + files[i].Filename + "'"
        //alert(width);
        if (width != undefined)
            divHtml += " style='width:100px;'";
        divHtml += ">" + files[i].Filename +
        "</div><img src='/Content/Image/trash.png' title='删除' style='cursor:pointer;' onclick='delFile(\"" + files[i].Id + "\")' /></div>";
    }
    //$(obj).parent().parent().parent().find("div[id=fileListDiv]").html(divHtml);
    $(GetArea()).find("div[id=fileListDiv]").html(divHtml);
}
//截断文件名
function subFileName(len) {
    $(".fileName").each(function () {
        if ($(this).text().length > len) {
            $(this).text($(this).text().substring(0, len - 2) + "...");
        }
    });
}