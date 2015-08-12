using DistributedWebTest.Server.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DistributedWebTest.Server.WebApi
{
    /// <summary>
    /// Summary description for GetHarFile
    /// </summary>
    public class GetHarFile : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var id = Convert.ToInt32(context.Request.QueryString["id"]);
            TestResultRepository repo = new TestResultRepository();
            var file = repo.GetHarFile(id).File;
            context.Response.ContentType = "text/plain";
            context.Response.Write(file);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}