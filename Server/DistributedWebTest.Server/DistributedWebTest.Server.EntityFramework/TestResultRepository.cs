using DistributedWebTest.Server.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
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

        public int SaveTestResult(PerformanceTestResult result)
        {
            int id;
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                context.PerformanceTestResults.Add(result);
                context.SaveChanges();
                id = result.Id;
            }
            return id;
        }
    }
}
