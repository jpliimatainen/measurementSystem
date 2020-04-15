using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeasurementApi.Models;

namespace MeasurementApi.Controllers
{
    [Route("api/persons/{personId}/[controller]")]
    [ApiController]
    public class MeasurementsController : ControllerBase
    {
        private readonly MeasurementContext _context;

        public MeasurementsController(MeasurementContext context)
        {
            _context = context;
        }

        // GET: api/Persons/5/Measurements
        [HttpGet]
        public async Task<ActionResult<Person>> GetPersonMeasurements(
            int personId, [FromQuery] string unitName, [FromQuery] string start, [FromQuery] string end)
        {
            var person = await _context.Person.FindAsync(personId);
            
            if (person == null)
            {
                return NotFound();
            }

            // the default query if all the query parameters are missing
            var query = _context.Measurement.Where(m => m.PersonId == personId);

            // metric name
            if (unitName != null)
            {
                query = query.Where(m => m.UnitName == unitName);
            }

            // start time
            if (start != null)
            {
                query = query.Where(m => DateTime.Compare(m.Time, Convert.ToDateTime(start)) >= 0);
            }

            // end time
            if (end != null)
            {
                query = query.Where(m => DateTime.Compare(m.Time, Convert.ToDateTime(end)) <= 0);
            }

            // get measurements for this person ordered by time in ascending order
            List<Measurement> measurements = await query.OrderBy(m => m.Time).ToListAsync();
            person.Measurements = measurements;

            return person;
        }

        // GET: api/Persons/5/Measurements/Metrics
        [HttpGet("metrics")]
        public async Task<ActionResult<PersonMetrics>> GetPersonMetrics(int personId)
        {
            var person = await _context.Person.FindAsync(personId);

            if (person == null)
            {
                return NotFound();
            }

            // get distinct metric names for this person sorted alphabetically
            List<string> metrics = await _context.Measurement
                .Where(m => m.PersonId == personId)
                .Select(m => m.UnitName).Distinct()
                .OrderBy(x => x) // sort based on the distinct values
                .ToListAsync();

            // return metric names for this person
            return new PersonMetrics(personId, metrics);
        }

        // POST: api/persons/5/Measurements
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<List<Measurement>>> PostMeasurement([FromRoute] int personId, List<Measurement> measurements)
        {
            foreach(var measurement in measurements)
            {
                // check that person ids match
                if (personId != measurement.PersonId)
                {
                    return BadRequest();
                }
            }

            List<string> missingFields = new List<string>();

            foreach (var measurement in measurements)
            {
                if (measurement.UnitName == null || measurement.UnitName == "") // unit name missing
                {
                    if (!missingFields.Contains("UnitName"))
                    {
                        // add the field to the list if not yet exists
                        missingFields.Add("UnitName");
                    }
                }
            }

            if (missingFields.Count() > 0) // error(s) exist(s)
            {
                return BadRequest(new { Code = 1, Msg = "Missing or empty fields", Fields = missingFields.ToArray() });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Measurement.AddRange(measurements);
            await _context.SaveChangesAsync();

            return measurements;
        }

        // DELETE: api/persons/5/Measurements/7
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeasurement([FromRoute] int personId, int id)
        {
            Measurement measurement = await _context.Measurement.FindAsync(id);

            if (measurement == null) // no measurement for a given id
            {
                return NotFound();
            }

            if (personId != measurement.PersonId) // person ids not match
            {
                return BadRequest();
            }

            _context.Measurement.Remove(measurement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MeasurementExists(int id)
        {
            return _context.Measurement.Any(e => e.MeasurementId == id);
        }
    }
}
