using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DistributedWebTest.Server.Data
{
    public class GeoLocation
    {
        [JsonProperty("latitude", NullValueHandling = NullValueHandling.Ignore)]
        public decimal Latitude { get; set; }
        [JsonProperty("longitude", NullValueHandling = NullValueHandling.Ignore)]
        public decimal Longitude { get; set; }
    }
}