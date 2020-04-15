using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MeasurementApi.Models
{
    public class Person
    {
        public int PersonId { get; set; }
        public string Pin { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();
    }
}
