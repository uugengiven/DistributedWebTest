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

        public void SaveHarFile(HarResult result)
        {
            int id;
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                context.HarResults.Add(result);
                context.SaveChanges();

            }
        }



        public List<PerformanceTestResult> GetLatestTestResults()
        {

            List<PerformanceTestResult> results = new List<PerformanceTestResult>();
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                var x = context.PerformanceTestResults.Where(r => r.TestTime > DateTime.UtcNow - TimeSpan.FromDays(1));
                results = x.ToList();
            }
            return results;
        }

        public HarResult GetHarFile(int id)
        {
            HarResult result = new HarResult();
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                var x = context.HarResults.FirstOrDefault(f => f.Id == id);
                result = x;
            }
            return result;
        }

        public List<PerformanceTestResult> GetAllTestResults()
        {
            List<PerformanceTestResult> results = new List<PerformanceTestResult>();
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                var x = context.PerformanceTestResults;
                results = x.ToList();
            }
            return results;
        }
    }
}
