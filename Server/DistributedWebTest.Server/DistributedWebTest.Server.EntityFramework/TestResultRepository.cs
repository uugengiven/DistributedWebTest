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
            var dateTime = DateTime.UtcNow - TimeSpan.FromDays(1);
            List<PerformanceTestResult> results = new List<PerformanceTestResult>();
            using (TestResultContext context = new TestResultContext(ConfigurationManager.ConnectionStrings["TestResultDb"].ConnectionString))
            {
                var last24HoursResults = context.PerformanceTestResults.Where(r => r.TestTime > dateTime);

                var resultsGroupedByNode = last24HoursResults.GroupBy(r => r.NodeId);

                foreach (var resultGroup in resultsGroupedByNode)
                {
                    var averageTime = resultGroup.Average(r => r.TotalTime);
                    var result = resultGroup.OrderByDescending(r => r.TestTime).First();
                    result.AverageTime = (int)averageTime;
                    results.Add(result);
                }
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
