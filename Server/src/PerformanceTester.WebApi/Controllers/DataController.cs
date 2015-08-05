using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using DistributedWebTest.Server.Data;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DistributedWebTest.Server.WebApi.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {

        [Route("[action]/{id:int}")]
        public string Test(int id)
        {
            return "Test" + id;
        }


        [HttpPost]
        public int SaveTestResult(PerformanceTestResult testResult)
        {
            throw new NotImplementedException();
        }


        [HttpPost]
        public void SaveHarData()
        {
            throw new NotImplementedException();
        }

    }
}
