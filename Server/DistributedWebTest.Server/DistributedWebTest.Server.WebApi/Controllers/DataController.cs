using DistributedWebTest.Server.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DistributedWebTest.Server.WebApi.Controllers
{
    [RoutePrefix("api/data")]
    public class DataController : ApiController
    {
        // GET api/values
        [HttpPost]
        [Route("savetestresults")]
        public int SaveTestResult(PerformanceTestResult data)
        {
            return 1;
        }

    }
}
