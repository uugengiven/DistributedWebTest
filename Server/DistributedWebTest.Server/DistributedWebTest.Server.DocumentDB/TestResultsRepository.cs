using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Newtonsoft.Json;
using DistributedWebTest.Server.Data;

namespace DistributedWebTest.Server.DocumentDB
{
    public class TestResultsRepository
    {
        private static string EndpointUrl = "https://distributedwebtest.documents.azure.com:443/";
        private static string AuthorizationKey = "KGAjKPiUbeyMes/2xI59BJc9J31Z+Jl3yYJNThIEbHtZFPBOzJaAFNdM2gfn3x29ZnTrNEIeq58EOwIiNFgdRA==";



        public static async Task SaveTestResults(PerformanceTestResult testResults)
        {
            
            // Make sure to call client.Dispose() once you've finished all DocumentDB interactions
            // Create a new instance of the DocumentClient
            var client = new DocumentClient(new Uri(EndpointUrl), AuthorizationKey);

            // Check to verify a database with the id=FamilyRegistry does not exist
            Database database = client.CreateDatabaseQuery().Where(db => db.Id == "DistributedWebTest").AsEnumerable().FirstOrDefault();

            if (database == null)
            {
                // Create a database
                database = await client.CreateDatabaseAsync(
                    new Database
                    {
                        Id = "DistributedWebTest"
                    });
            }
           
            // Check to verify a document collection with the id=FamilyCollection does not exist
            DocumentCollection documentCollection = client.CreateDocumentCollectionQuery(database.CollectionsLink).Where(c => c.Id == "DistributedTestResults").AsEnumerable().FirstOrDefault();

            if (documentCollection == null)
            {
                // Create a document collection using the lowest performance tier available (currently, S1)
                documentCollection = await client.CreateDocumentCollectionAsync(database.CollectionsLink,
                    new DocumentCollection { Id = "DistributedTestResults" },
                    new RequestOptions { OfferType = "S1" });
            }

            await client.CreateDocumentAsync(documentCollection.DocumentsLink, testResults);

  

        }

    }
}
