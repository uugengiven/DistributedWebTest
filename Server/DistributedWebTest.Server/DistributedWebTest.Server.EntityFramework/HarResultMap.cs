using DistributedWebTest.Server.Data;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DistributedWebTest.Server.EntityFramework
{
    public class HarResultMap : EntityTypeConfiguration<HarResult>
    {
        public HarResultMap()
        {
            this.ToTable("HarResult");
            this.HasKey(t => t.Id);
            this.Property(t => t.Id).HasColumnName("TestResultId").HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            this.Property(t => t.File).HasColumnName("HarFile");

          
        }
    }
}
