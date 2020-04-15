/*
 * MeasurementApp.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import PersonTable from './PersonTable';
import MeasurementTable from './MeasurementTable';
import MeasurementGraph from './MeasurementGraph';
import InsertPersonForm from './InsertPersonForm';
import InsertMeasurementForm from './InsertMeasurementForm';
import EditPersonForm from './EditPersonForm';
import './custom.css';

const MeasurementApp = () => {
  const [persons, setPersons] = useState([]);
  const [query, setQuery] = useState(null);
  const [reloadPersons, setReloadPersons] = useState(0);
  const [infoText, setInfoText] = useState('');
  const [personFieldErrors, setPersonFieldErrors] = useState({
    emptyPin: false,
    duplicatePin: false,
    emptyName: false,
  });
  const [measurementFieldErrors, setMeasurementFieldErrors] = useState({
    emptyUnitName: false
  });

  useEffect(() => {
    async function fetchPersons() {
      let url = new URL('https://localhost:44389/api/persons');

      if (query !== null) {
        // Set query paramaters, reference: https://fetch.spec.whatwg.org/#fetch-api
        Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data === null) { // an error occured
        console.log("An error occured while fetching persons");
      }
      else {
        setPersons(data);
      }
    }

    fetchPersons();
  }, [query, reloadPersons]);

  const handlePersonSave = (inputData, history, op) => {
    // reset error flags
    setPersonFieldErrors({
      emptyPin: false,
      duplicatePin: false,
      emptyName: false,
    });

    try {
      let promise = null;

      switch (op) {
        case 'insert':
          promise = createPerson(inputData);
          break;
        case 'edit':
          promise = editPerson(inputData);
          break;
        default:
          break;
      }
      if (promise !== null) {
        promise.then(function (result) {
          if (result.code === undefined) { // insert/update successfully completed
            // reroutes to the home page
            history.push('/');
            // set info message
            switch (op) {
              case 'insert':
                setInfoText('Henkilö ' + result.name + ' lisätty.');
                break;
              case 'edit':
                setInfoText('Henkilö ' + result.name + ' päivitetty.');
                break;
              default:
                setInfoText('');
                break;
            }

            // triggers persons to be reloaded
            setReloadPersons(reloadPersons === 0 ? 1 : 0);
          }
          else { // an error occured
            switch (result.code) {
              case 1: // duplicate pin
                setPersonFieldErrors({
                  emptyPin: false,
                  duplicatePin: true,
                  emptyName: false,
                });
                break;
              case 2: // empty fields
                setPersonFieldErrors({
                  emptyPin: result.fields.indexOf('Pin') !== -1 ? true : false,
                  duplicatePin: false,
                  emptyName: result.fields.indexOf('Name') !== -1 ? true : false,
                });
                break;
              default:
                break;
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMeasurementSave = (inputData, personId, history) => {
    // reset error flags
    setMeasurementFieldErrors({
      emptyUnitName: false,
    });

    try {
      const promise = createMeasurement(inputData, personId);

      promise.then(function (result) {
        if (result.code === undefined) { // insert successfully completed
          // reroutes to the measurement view page of the person
          history.push('/view/' + personId);
        }
        else { // an error occured
          switch (result.code) {
            case 1: // empty fields
              setMeasurementFieldErrors({
                emptyUnitName: result.fields.indexOf('UnitName') !== -1 ? true : false,
              });
              break;
            default:
              break;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePersonDelete = (id) => {
    try {
      const promise = deletePerson(id);

      promise.then(function (result) {
        if (result.status === 204) { // success
          // triggers persons to be reloaded
          setReloadPersons(reloadPersons === 0 ? 1 : 0);
          // set info text
          setInfoText('Valittu henkilö poistettu.')
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // clears info text
    setInfoText('');
  };

  const handleFilter = option => {
    if (option === "having-meas") {
      // filter persons that have measurement(s)
      setQuery({ "havingMeasurements": true });
    }
    else {
      setQuery(null);
    }
    // clears info text
    setInfoText('');
  };

  const updatePersons = () => {
    // triggers persons to be reloaded
    setReloadPersons(reloadPersons === 0 ? 1 : 0);
  };

  async function createPerson(data) {
    const url = 'https://localhost:44389/api/persons';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async function createMeasurement(data, personId) {
    const url = 'https://localhost:44389/api/persons/' + personId + '/measurements';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async function editPerson(data) {
    const url = 'https://localhost:44389/api/persons/' + data.personId;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async function deletePerson(id) {
    const url = 'https://localhost:44389/api/persons/' + id;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    return { status: response.status };
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <InfoText text={infoText} />
          <InsertNew />
          {persons.length > 0 ?
            <PersonTable data={persons} delete={handlePersonDelete} action={handleCancel} /> :
            <div></div>
          }
          <PersonFilters filter={handleFilter} showAll={query === null} />
        </Route>
        <Route path="/add">
          <InsertPersonForm insert={handlePersonSave} cancel={handleCancel} errors={personFieldErrors} />
        </Route>
        <Route path="/edit/:id">
          <EditPersonForm edit={handlePersonSave} cancel={handleCancel} errors={personFieldErrors} />
        </Route>
        <Route path="/view/:id">
          <MeasurementTable reload={updatePersons} />
        </Route>
        <Route path="/graph/:id">
          <MeasurementGraph />
        </Route>
        <Route path="/measurement/:id/add">
          <InsertMeasurementForm date={new Date()} insert={handleMeasurementSave}
            cancel={handleCancel} errors={measurementFieldErrors} />
        </Route>
      </Switch>
    </Router>
  );
};

const InfoText = (props) => {
  const text = props.text;

  return (
    <div className={text !== '' ? "visible info-text" : "hidden"}>
      {text}
    </div>
  );
};

const InsertNew = () => {
  return (
    <div id="insert-button">
      <Link to='/add'>Lisää henkilö</Link>
    </div>
  );
};

const PersonFilters = (props) => {

  const handleOptionChange = (changeEvent) => {
    props.filter(changeEvent.target.value);
  };

  return (
    <form id="filter-users">
      <div>
        <input type="radio" id="all" name="filterUsers" value="all"
          checked={props.showAll} onChange={handleOptionChange} />
        <label htmlFor="all">Kaikki</label>
      </div>
      <div>
        <input type="radio" id="having-meas" name="filterUsers" value="having-meas"
          checked={!props.showAll} onChange={handleOptionChange} />
        <label htmlFor="having-meas">Henkilöt, joilla on mittauksia</label>
      </div>
    </form>
  );
};

export default MeasurementApp;