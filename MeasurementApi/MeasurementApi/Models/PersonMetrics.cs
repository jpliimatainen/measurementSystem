using System.Collections.Generic;

namespace MeasurementApi.Models
{
    // model distinct metric names of a person
    public class PersonMetrics
    {
        public int PersonId { get; set; }
        public List<string> Metrics { get; set; }

        public PersonMetrics(int PersonId, List<string> Metrics)
        {
            this.PersonId = PersonId;
            this.Metrics = Metrics;
        }
    }
}
