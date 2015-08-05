using DistributedWebTest.Server.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DistributedWebTest.Server.EntityFramework
{
    public class TestResultRepository
    {
        public TestResultRepository()
        {

        }

        public void SaveTestResult(PerformanceTestResult result)
        {
            TestResultContext context = new TestResultContext(ConfigurationManager);
        }

    }
}
