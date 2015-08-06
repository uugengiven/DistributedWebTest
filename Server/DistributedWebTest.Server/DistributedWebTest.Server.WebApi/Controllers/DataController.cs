using DistributedWebTest.Server.Data;
using DistributedWebTest.Server.DocumentDB;
using DistributedWebTest.Server.EntityFramework;
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
            //
            //var repo =  new DocumentDBRepository<PerformanceTestResult>("DistributedTestResults");

            //repo.CreateItemAsync(data).Wait();
            //TestResultsRepository.SaveTestResults(data).Wait();
            TestResultRepository repo = new TestResultRepository();
            int id = repo.SaveTestResult(data);
            return id;
        }

        [HttpPost]
        [Route("savehar")]
        public void SaveHarResult(HarResult data)
        {
        }


    }
}
