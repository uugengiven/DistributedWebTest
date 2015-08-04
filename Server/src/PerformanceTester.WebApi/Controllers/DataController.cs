using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DistributedWebTest.Server.WebApi.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        [HttpPost]
        public int SendData()
        {
            throw new NotImplementedException();
        }


        [HttpPost]
        public void SendHarData()
        {
            throw new NotImplementedException();
        }

    }
}
