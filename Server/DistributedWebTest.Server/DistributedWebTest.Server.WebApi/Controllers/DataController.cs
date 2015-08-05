using DistributedWebTest.Server.Data;
using DistributedWebTest.Server.DocumentDB;
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
        public String SaveTestResult(PerformanceTestResult data)
        {
            //
            var repo =  new DocumentDBRepository<PerformanceTestResult>("DistributedTestResults");
            data.Id = Guid.NewGuid().ToString();
            TestResultsRepository.SaveTestResults(data).Wait();
            return data.Id;
        }

    }
}
