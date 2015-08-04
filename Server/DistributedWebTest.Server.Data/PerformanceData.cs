using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DistributedWebTest.Server
{
    public class PerformanceData
    {
        public Guid NodeId { get; set; }
        public String NodeName { get; set; }
        public DateTime TestTime { get; set; }
        public string IpAddress { get; set; }
        public string Dns { get; set; }
        public GeoLocation GeoFrom { get; set; }
        public GeoLocation GeoTo { get; set; }
        public int TestId { get; set; }
        public int Ping { get; set; }
        public int TotalTime { get; set; }
        public int AverageTime { get; set; }

    }
}
