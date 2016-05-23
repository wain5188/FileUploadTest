using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YiYi.Examine.ViewModel
{
    /// <summary>
    /// 临时附件表
    /// </summary>
    public class TemplFilesViewModel
    {

        /// <summary>
        /// 唯一标识
        /// </summary>
        public System.Int32 Id
        {
            get;
            set;
        }

        /// <summary>
        /// 申请id
        /// </summary>
        public System.String GroupId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public System.String Filename
        {
            get;
            set;
        }

        /// <summary>
        /// 下载地址
        /// </summary>
        public System.String Dowpath
        {
            get;
            set;
        }

        /// <summary>
        /// 浏览地址
        /// </summary>
        public System.String Showpath
        {
            get;
            set;
        }

        /// <summary>
        /// 创建时间
        /// </summary>
        public System.DateTime Createtime
        {
            get;
            set;
        }
    }
}
