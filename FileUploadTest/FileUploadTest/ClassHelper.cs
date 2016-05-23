using log4net;
using log4net.Config;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
//using Aliyun.OSS;
//using Microsoft.Office.Interop.Word;
//using Microsoft.Office.Interop.Excel;

namespace YiYi.Examine.Common
{
    /// <summary>
    /// 徐梓翔
    /// 
    /// 通用类
    /// </summary>
    public class ClassHelper
    {
        /// <summary>
        /// 徐梓翔
        /// 
        /// 随机数
        /// </summary>
        /// <param name="size">个数</param>
        /// <returns></returns>
        public static string RandomCode(int size)
        {
            string code = "";
            var random = new Random();

            for (var i = 0; i < size; i++)
            {
                code += random.Next(1, 9).ToString();
            }

            return code;
        }


        /// <summary>
        /// 徐梓翔
        /// 
        /// 字符串MD5加密
        /// </summary>
        /// <param name="input">需要加密的字符串</param>
        /// <returns></returns>
        public static string MD5(string input)
        {

            System.Security.Cryptography.MD5 md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);
            bytes = md5.ComputeHash(bytes);
            md5.Clear();

            string ret = "";
            for (int i = 0; i < bytes.Length; i++)
            {
                ret += Convert.ToString(bytes[i], 16).PadLeft(2, '0');
            }

            return ret.PadLeft(32, '0');

        }

        /// <summary>
        /// 徐梓翔
        /// 
        /// 短信发送
        /// </summary>
        /// <param name="content">发送内容</param>
        /// <param name="mobile">电话号</param>
        /// <returns></returns>
        public static string Msm(string content, string mobile)
        {
            //短信收发机 帐号和密码
            var sendUserName = ConfigurationManager.AppSettings["SendUserName"].ToString();
            var sendUserPass = ConfigurationManager.AppSettings["SendUserPass"].ToString();


            string postString = "UserName=" + sendUserName + "&UserPass=" + sendUserPass + "&Mobile=" + mobile + "&Content=" + content;
            byte[] postData = System.Text.Encoding.GetEncoding("UTF-8").GetBytes(postString);

            string url = ConfigurationManager.AppSettings["SendUrl"].ToString();

            WebClient webClient = new WebClient();
            webClient.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            byte[] responseData = webClient.UploadData(url, "POST", postData);
            string srcString = Encoding.GetEncoding("UTF-8").GetString(responseData);
            Console.WriteLine(srcString);
            return srcString;
        }


        /// <summary>
        /// 徐梓翔
        /// 
        /// 邮件发送
        /// </summary>
        /// <param name="content">内容</param>
        /// <param name="toMail">发送地址</param>
        /// <param name="ccMail">抄送地址 多个地址以","分割</param>
        /// <returns></returns>
        public static void Email(string content,string title, string toMail, string ccMail)
        {
            var sendEmail = ConfigurationManager.AppSettings["SendEmail"].ToString();
            var sendEmailPass = ConfigurationManager.AppSettings["SendEmailPass"].ToString();

            SmtpClient smtp = new SmtpClient(); //实例化一个SmtpClient
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network; //将smtp的出站方式设为 Network
            smtp.EnableSsl = false;//smtp服务器是否启用SSL加密

            smtp.Host = ConfigurationManager.AppSettings["SendEmailHost"].ToString(); ; //指定 smtp 服务器地址
            //如果你的SMTP服务器不需要身份认证，则使用下面的方式，不过，目前基本没有不需要认证的了
            smtp.UseDefaultCredentials = true;
            //如果需要认证，则用下面的方式
            smtp.Credentials = new NetworkCredential(sendEmail, sendEmailPass);

            System.Net.Mail.MailMessage mm = new System.Net.Mail.MailMessage(); //实例化一个邮件类
            mm.Priority = MailPriority.High; //邮件的优先级，分为 Low, Normal, High，通常用 Normal即可

            mm.From = new MailAddress(sendEmail, "小微企业信贷审批管理系统", System.Text.Encoding.UTF8);
            mm.To.Add(new MailAddress(toMail, "", System.Text.Encoding.UTF8)); //发送

            if (ccMail != null && ccMail != "")
                mm.CC.Add(ccMail); //抄送


            mm.Subject =title; //邮件标题
            mm.SubjectEncoding = System.Text.Encoding.UTF8;
            mm.BodyEncoding = System.Text.Encoding.UTF8;//邮件内容编码 
            mm.IsBodyHtml = true;//是否是HTML邮件 

            mm.Body = content; //正文

            smtp.Send(mm);
        }

        /// <summary>
        /// 徐梓翔
        /// 
        /// log4net 日志
        /// </summary>
        /// <param name="type">操作类</param>
        /// <param name="input">日志内容</param>
        /// <returns></returns>
        public static void Log4Net(Type type,string input)
        {
            var logCfg = new FileInfo(AppDomain.CurrentDomain.BaseDirectory + "log4net.config");
            XmlConfigurator.ConfigureAndWatch(logCfg);

            LogManager.GetLogger(type).Info(input);
        }

        /// <summary>
        /// 徐梓翔
        /// 
        /// word 在线转 pdf
        /// </summary>
        /// <param name="path">文件路径绝对路径</param>
        /// <param name="topath">转换路径绝对路径</param>
        //public static void WordToPdf(object path, string topath)
        //{
        //    WdExportFormat exportFormat = WdExportFormat.wdExportFormatPDF;
        //    object paramMissing = Type.Missing;
        //    Microsoft.Office.Interop.Word.ApplicationClass wordApplication = new Microsoft.Office.Interop.Word.ApplicationClass();
        //    Document wordDocument = null;
        //    try
        //    {
        //        object paramSourceDocPath = path;
        //        string paramExportFilePath = topath;

        //        WdExportFormat paramExportFormat = exportFormat;
        //        bool paramOpenAfterExport = false;
        //        WdExportOptimizeFor paramExportOptimizeFor = WdExportOptimizeFor.wdExportOptimizeForPrint;
        //        WdExportRange paramExportRange = WdExportRange.wdExportAllDocument;
        //        int paramStartPage = 0;
        //        int paramEndPage = 0;
        //        WdExportItem paramExportItem = WdExportItem.wdExportDocumentContent;
        //        bool paramIncludeDocProps = true;
        //        bool paramKeepIRM = true;
        //        WdExportCreateBookmarks paramCreateBookmarks = WdExportCreateBookmarks.wdExportCreateWordBookmarks;
        //        bool paramDocStructureTags = true;
        //        bool paramBitmapMissingFonts = true;
        //        bool paramUseISO19005_1 = false;

        //        wordDocument = wordApplication.Documents.Open(
        //                        ref paramSourceDocPath, ref paramMissing, ref paramMissing,
        //                        ref paramMissing, ref paramMissing, ref paramMissing,
        //                        ref paramMissing, ref paramMissing, ref paramMissing,
        //                        ref paramMissing, ref paramMissing, ref paramMissing,
        //                        ref paramMissing, ref paramMissing, ref paramMissing,
        //                        ref paramMissing);

        //        if (wordDocument != null)
        //            wordDocument.ExportAsFixedFormat(paramExportFilePath,
        //            paramExportFormat, paramOpenAfterExport,
        //            paramExportOptimizeFor, paramExportRange, paramStartPage,
        //            paramEndPage, paramExportItem, paramIncludeDocProps,
        //            paramKeepIRM, paramCreateBookmarks, paramDocStructureTags,
        //            paramBitmapMissingFonts, paramUseISO19005_1,
        //            ref paramMissing);
        //    }
        //    catch(Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (wordDocument != null)
        //        {
        //            wordDocument.Close(ref paramMissing, ref paramMissing, ref paramMissing);
        //            wordDocument = null;
        //        }
        //        if (wordApplication != null)
        //        {
        //            wordApplication.Quit(ref paramMissing, ref paramMissing, ref paramMissing);
        //            wordApplication = null;
        //        }
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //    }
        //}

        /// <summary>
        /// 徐梓翔
        /// 
        /// excel 在线转 pdf
        /// </summary>
        /// <param name="path">文件路径绝对路径</param>
        /// <param name="topath">转换路径绝对路径</param>
        //public static void ExcelToPdf(string path, object topath)
        //{
        //    XlFixedFormatType targetType = XlFixedFormatType.xlTypePDF;
        //    object missing = Type.Missing;
        //    Microsoft.Office.Interop.Excel.ApplicationClass application = null;
        //    Workbook workBook = null;
        //    try
        //    {
        //        application = new Microsoft.Office.Interop.Excel.ApplicationClass();
        //        object target = topath;
        //        object type = targetType;
        //        workBook = application.Workbooks.Open(path, missing, missing, missing, missing, missing,
        //                missing, missing, missing, missing, missing, missing, missing, missing, missing);

        //        workBook.ExportAsFixedFormat(targetType, target, XlFixedFormatQuality.xlQualityStandard, true, false, missing, missing, missing, missing);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (workBook != null)
        //        {
        //            workBook.Close(true, missing, missing);
        //            workBook = null;
        //        }
        //        if (application != null)
        //        {
        //            application.Quit();
        //            application = null;
        //        }
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //    }
        //}


        /// <summary>
        /// 上传一个新文件
        /// </summary>
        /// <param name="key">逻辑路径("/"开头)</param>
        public static void UploadFile(string key)
        { 
            string accessKeyId = ConfigurationManager.AppSettings["AccessKeyId"].ToString();
            string accessKeySecret = ConfigurationManager.AppSettings["AccessKeySecret"].ToString();
            string endpoint = ConfigurationManager.AppSettings["Endpoint"].ToString();
            string bucketName = ConfigurationManager.AppSettings["BucketName"].ToString();
            string root = ConfigurationManager.AppSettings["Root"].ToString();
            string localRoot = ConfigurationManager.AppSettings["LocalRoot"].ToString();
            string path = localRoot + key.Replace("/", "\\");
           // OssClient ossClient = new OssClient(endpoint, accessKeyId, accessKeySecret);
           // ossClient.PutObject(bucketName, root + key, path);
        }

        /// <summary>
        /// 下载文件
        /// </summary>
        /// <param name="key">逻辑路径("/"开头)</param>
        //public static Stream DownloadFile(string key,out string contentType)
        //{
        //    string accessKeyId = ConfigurationManager.AppSettings["AccessKeyId"].ToString();
        //    string accessKeySecret = ConfigurationManager.AppSettings["AccessKeySecret"].ToString();
        //    string endpoint = ConfigurationManager.AppSettings["Endpoint"].ToString();
        //    string bucketName = ConfigurationManager.AppSettings["BucketName"].ToString();
        //    string root = ConfigurationManager.AppSettings["Root"].ToString();

        //    OssClient ossClient = new OssClient(endpoint, accessKeyId, accessKeySecret);
        //    OssObject result = ossClient.GetObject(bucketName, root + key);

        //    var ext = key.Substring(key.LastIndexOf('.') + 1);

        //    switch (ext.ToLower())
        //    {
        //        case "doc":
        //        case "docx":
        //            contentType = "application/msword";
        //            break;
        //        case "xls":
        //        case "xlsx":
        //            contentType = "application/x-xls";
        //            break;
        //        case "png":
        //            contentType = "application/x-png";
        //            break;
        //        case "jpg":
        //        case "jpge":
        //            contentType = "application/x-jpg";
        //            break;
        //        default:
        //            contentType = result.Metadata.ContentType;
        //            break;
        //    }

        //    return result.Content;
        //}

        /// <summary>
        /// 徐梓翔
        /// 
        /// 获取文件服务器访问地址
        /// </summary>
        /// <param name="key">文件key</param>
        /// <returns></returns>
        //public static Uri Viewer(string key)
        //{
        //    string accessKeyId = ConfigurationManager.AppSettings["AccessKeyId"].ToString();
        //    string accessKeySecret = ConfigurationManager.AppSettings["AccessKeySecret"].ToString();
        //    string endpoint = ConfigurationManager.AppSettings["Endpoint"].ToString();
        //    string bucketName = ConfigurationManager.AppSettings["BucketName"].ToString();
        //    string root = ConfigurationManager.AppSettings["Root"].ToString();

        //    OssClient ossClient = new OssClient(endpoint, accessKeyId, accessKeySecret);
        //    //生成PUT方法的URL
        //    var req = new GeneratePresignedUriRequest(bucketName, root + key, SignHttpMethod.Get);
        //    req.Expiration = DateTime.Now.AddHours(1);

        //    var uri = ossClient.GeneratePresignedUri(req);

        //    return uri;
        //}

        /// <summary>
        /// 徐梓翔
        /// 
        /// 文件复制
        /// </summary>
        /// <param name="sPath">源文件夹路径</param>
        /// <param name="dFileName">要保存的文件名带扩展名</param>
        /// <param name="folderName">目的文件夹名</param>
        /// <returns></returns>
        public static void CopyFile(string sPath, string dFileName,string folderName)
        {
            string localRoot = ConfigurationManager.AppSettings["LocalRoot"].ToString(); //存储路径
            string root = localRoot + "\\" + folderName;
            if (!System.IO.Directory.Exists(root))
            {
                // 目录不存在，建立目录
                System.IO.Directory.CreateDirectory(root);
            }

            bool isrewrite = true; // true=覆盖已存在的同名文件,false则反之
            System.IO.File.Copy(sPath, root + "\\" + dFileName, isrewrite); //复制文件
        }
    }
}
