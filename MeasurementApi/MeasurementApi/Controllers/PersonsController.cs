using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeasurementApi.Models;
using System.Linq.Expressions;

namespace MeasurementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly MeasurementContext _context;

        public PersonsController(MeasurementContext context)
        {
            _context = context;
        }

        // GET: api/Persons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPersons([FromQuery] bool? havingMeasurements)
        {
            List<Person> persons = null;

            if (havingMeasurements != null)
            {
                if ((bool)havingMeasurements)
                {
                    // get customers that have at least one measurement
                    persons = await _context.Person.Where(p => p.Measurements.Count > 0).ToListAsync();
                }
                else
                {
                    // get customers that have no measurements
                    persons = await _context.Person.Where(p => p.Measurements.Count == 0).ToListAsync();
                }
            }
            else
            {
                // get all customers
                persons = await _context.Person.ToListAsync();
            }

            return persons;
        }

        // GET: api/Persons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _context.Person.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/Persons/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<ActionResult<Person>> PutPerson(int id, Person person)
        {
            if (id != person.PersonId)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbPerson = await _context.Person.Where(p => p.Pin == person.Pin && p.PersonId != id).ToListAsync();

            if (dbPerson.Count != 0) // another person with the same pin exists
            {
                return BadRequest(new { Code = 1, Msg = "Given pin already exists" });
            }

            List<string> missingFields = new List<string>();

            if (person.Pin == null || person.Pin == "") // pin misses
            {
                missingFields.Add("Pin");
            }
            if (person.Name == null || person.Name == "") // name misses
            {
                missingFields.Add("Name");
            }

            if (missingFields.Count() > 0) // error(s) exist(s)
            {
                return BadRequest(new { Code = 2, Msg = "Missing or empty fields", Fields = missingFields.ToArray() });
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return person;
        }

        // POST: api/Persons
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbPerson = await _context.Person.Where(p => p.Pin == person.Pin).ToListAsync();

            if (dbPerson.Count != 0) // person with the same pin exists
            {
                return BadRequest(new { Code = 1, Msg = "Given pin already exists" });
            }

            List<string> missingFields = new List<string>();

            if (person.Pin == null || person.Pin == "") // pin misses
            {
                missingFields.Add("Pin");
            }
            if (person.Name == null || person.Name == "") // name misses
            {
                missingFields.Add("Name");
            }

            if (missingFields.Count() > 0) // error(s) exist(s)
            {
                return BadRequest(new { Code = 2, Msg = "Missing or empty fields", Fields = missingFields.ToArray() });
            }

            _context.Person.Add(person);
            await _context.SaveChangesAsync();

            return person;
        }

        // DELETE: api/Persons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Person.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.Person.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int id)
        {
            return _context.Person.Any(e => e.PersonId == id);
        }
    }
}
