using Microsoft.EntityFrameworkCore;

namespace MeasurementApi.Models
{
    public class MeasurementContext : DbContext
    {
        public DbSet<Person> Person { get; set; }
        public DbSet<Measurement> Measurement { get; set; }

        public MeasurementContext(DbContextOptions<MeasurementContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // required values for person
            modelBuilder.Entity<Person>()
                .Property(p => p.Pin)
                .IsRequired();
            modelBuilder.Entity<Person>()
                .Property(p => p.Name)
                .IsRequired();

            // set pin as a unique
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.Pin)
                .IsUnique();

            // required values for measurement
            modelBuilder.Entity<Measurement>()
               .Property(m => m.UnitName)
               .IsRequired();
            modelBuilder.Entity<Measurement>()
              .Property(m => m.Value)
              .IsRequired();
            modelBuilder.Entity<Measurement>()
              .Property(m => m.Time)
              .IsRequired();
            modelBuilder.Entity<Measurement>()
              .Property(m => m.PersonId)
              .IsRequired();
        }
    }
}
