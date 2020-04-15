using System;
using System.ComponentModel.DataAnnotations;

namespace MeasurementApi.Models
{
    public class Measurement
    {
        public int MeasurementId { get; set; }
        public string UnitName { get; set; }
        public double Value { get; set; } = 0;
        public DateTime Time { get; set; } = DateTime.Now;

        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
