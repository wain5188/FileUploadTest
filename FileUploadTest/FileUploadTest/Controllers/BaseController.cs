using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using YiYi.Examine.ViewModel;

namespace WebApplication1.Controllers
{
    public class BaseController : Controller
    {
       [HttpPost]
        public ActionResult Upload(string groupId = "")
        {

            HttpFileCollection fileToUploads = System.Web.HttpContext.Current.Request.Files;

            if (fileToUploads.Count < 1)
                return Json(new { result = 0, msg = "无文件上传,请上传文件!" });

            string resultstr = "";
            //文件名校验
            var specialChar = new string[] { "_", ":", ";" };
            //扩展名校验
            var extension = new string[] { ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx", ".zip" };

            #region 校验文件

            int size = 0;
            for (int i = 0; i < fileToUploads.Count; i++)
            {
                var file = fileToUploads[i];

                string extName = System.IO.Path.GetExtension(file.FileName).ToLower(); //获取扩展名
                string finame = System.IO.Path.GetFileNameWithoutExtension(file.FileName); //获取文件名
                string filePath = file.FileName; //获取文件名

                //校验名
                foreach (string ch in specialChar)
                {
                    if (finame.IndexOf(ch) != -1)
                    {
                        resultstr += finame + ":文件路径或文件名中不能出现特殊字符; \r\n";
                    }
                }
                //校验文件格式
                var p = false;
                foreach (string ext in extension)
                {
                    if (ext.Equals(extName))
                    {
                        p = true;
                    }
                }
                if (!p)
                    resultstr += finame + ":文件格式不匹配目前只支持jpg、jpeg、png、zip、doc、docx、xls、xlsx格式; \r\n";

                //计算文件总和大小
                size += file.ContentLength;
            }

            if (size > 20 * 1024 * 1024)
            {
                resultstr += "文件合计大小不可超过20MB; \r\n";
            }

            if (resultstr != "") //校验不通过
            {
                return Json(new { result = 0, msg = resultstr });
            }
            #endregion

            try
            {
                #region 文件上传
                using (TransactionScope ts = new TransactionScope())
                {
                    //临时文件
                    List<TemplFilesViewModel> files = new List<TemplFilesViewModel>();
                    for (int i = 0; i < fileToUploads.Count; i++)
                    {
                        var file = fileToUploads[i];

                        string extName = System.IO.Path.GetExtension(file.FileName).ToLower(); //获取扩展名
                        string finame = System.IO.Path.GetFileNameWithoutExtension(file.FileName); //获取文件名
                        string filePath = file.FileName; //获取文件名

                        groupId = (groupId == "") ? Guid.NewGuid().ToString() : groupId; //文件命名规则;

                        string rule = "/Temporary/" + groupId + "/"; //创建临时文件路径
                        var tempPath = AddTempPath(rule, Server); //创建临时文件夹 返回真实路径

                        string @fileTempPath = tempPath + "file/";
                        string @fileNetworkPath = rule + "file/";

                        //文件名格式化
                        string name = DateTime.Now.ToString("yyyyMMddHHmmssfff") + i;
                        string fileName = name + extName;

                        string dowpath = fileTempPath + fileName; //原文件地址

                        file.SaveAs(dowpath); //上传文件

                        //上传文件
                        files.Add(new TemplFilesViewModel()
                        {
                            GroupId = groupId,
                            Filename = finame, //获取文件名,
                                               //Showpath = networkPath,
                            Dowpath = fileNetworkPath + fileName,
                            Createtime = DateTime.Now
                        });
                    }

                    //数据库添加
                    //var data = TemplFilesManagerApp.Instance.Add(groupId, files);

                    ts.Complete();
                    return Json(new { result = 1, msg = new object[] { groupId, files } });
                }
                #endregion
            }
            catch (Exception e)
            {
                return Json(new { result = 0, msg = e.Message });
            }
        }


        /// <summary>
        /// 徐梓翔
        /// 
        /// 创建临时路径
        /// </summary>
        /// <param name="rule">命名</param>
        /// <returns></returns>
        private string AddTempPath(string rule, HttpServerUtilityBase Server)
        {
            string tempPath = Server.MapPath(rule);

            if (!System.IO.Directory.Exists(tempPath)) //判断当前临时路径是否存在
            {
                System.IO.Directory.CreateDirectory(@tempPath + "file/"); //创建文件夹
                System.IO.Directory.CreateDirectory(@tempPath + "pdf/"); //创建文件夹
            }
            return tempPath;
        }
    }
}