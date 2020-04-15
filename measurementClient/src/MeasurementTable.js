/*
 * MeasurementTable.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MeasurementFilters from './MeasurementFilters';
import dateHelpers from './dateHelpers';

// helper function - test if argument item equals 204
const check204 = item => { return item === 204; }

const MeasurementTable = props => {
  const [userData, setUserData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [reloadMeasurements, setReloadMeasurements] = useState(0);
  const [startFilter, setStartFilter] = useState(
    dateHelpers.createDateObject(new Date(2019, 11, 1, 0, 0, 0))  // 01.12.2019 00:00:00
  );
  const [endFilter, setEndFilter] = useState(
    dateHelpers.createDateObject(new Date())  // current time
  );
  const [unitNameFilter, setUnitNameFilter] = useState('Kaikki');
  const [infoText, setInfoText] = useState('');

  const personId = useParams().id;

  useEffect(() => {
    // load measurement data
    async function fetchMeasurements() {
      let url = new URL('https://localhost:44389/api/persons/'
        + personId + '/measurements/');

      // create date strings for query
      const startStr = dateHelpers.dateObjToString(startFilter);
      const endStr = dateHelpers.dateObjToString(endFilter);

      // append the query to the url
      url += '?start=' + startStr + '&end=' + endStr;

      if (unitNameFilter !== 'Kaikki') { // unit name selected
        url += '&unitName=' + unitNameFilter;
      }

      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    }

    // load metric names
    async function fetchUnitNames() {
      const response = await fetch('https://localhost:44389/api/persons/'
        + personId + '/measurements/metrics');

      const data = await response.json();
      setMetrics(['Kaikki'].concat(data.metrics));
    }

    fetchMeasurements();
    fetchUnitNames();
    // reset checked items
    setCheckedItems([]);
  }, [personId, reloadMeasurements, endFilter, startFilter, unitNameFilter]);

  const handleToggle = (measurementId, checked) => {
    if (checked && !checkedItems.includes(measurementId)) { // insert id if not yet exists
      setCheckedItems(checkedItems => [...checkedItems, measurementId]);
    }
    else if (!checked) {
      // select all but this element
      const newChecked = checkedItems.filter(element => {
        return element !== measurementId;
      });
      // update checked items
      setCheckedItems(newChecked);
    }
  };

  const handleMeasurementDelete = async () => {
    const ids = checkedItems;
    let success = false;

    if (ids.length === 0) {
      window.alert("Valitse ensin mittaus/mittaukset");
    }
    else if (window.confirm("Haluatko varmasti poistaa valitut mittaukset?")) {
      const statuses = await deleteMeasurements(ids);

      if (statuses.every(check204)) { // all items successfully deleted
        success = true;
      }
      if (success) {
        setInfoText('Valitut mittaukset poistettu.');
      }
      else {
        setInfoText('Virhe mittausten poistossa.');
      }

      // triggers measurements to be reloaded
      setReloadMeasurements(reloadMeasurements === 0 ? 1 : 0);
    }
  };

  const handleFilter = (start, end, unitName) => {
    // update states
    setStartFilter(start);
    setEndFilter(end);
    setUnitNameFilter(unitName);
    // reset info text
    setInfoText('');
  };

  const deleteMeasurements = async ids => {
    try {
      // remove selected measurments
      return await Promise.all(
        ids.map(id =>
          deleteMeasurement(id)
            .then(response => Promise.resolve(response.status)) // get status code
            .catch(err => console.error(err))
        )
      );
    }
    catch (error) {
      console.log(error);
    }
  };

  const deleteMeasurement = async id => {
    const response = await fetch('https://localhost:44389/api/persons/'
      + personId + '/measurements/' + id, 
      { method: 'DELETE' }
    );

    return { status: response.status };
  };
  
  return (
    <div>
      <InfoTextMeas text={infoText} />
      <Links id={personId} reload={props.reload} />
      {userData !== undefined ?
        <div>
          <h2>{userData.name}</h2>
          <MeasurementFilters data={metrics} start={startFilter} end={endFilter}
            unitName={unitNameFilter} filter={handleFilter} />
          {userData.measurements !== undefined ?
            <div>
              <DeleteButton delete={handleMeasurementDelete} />
              <table>
                <TableHeader />
                <TableBody data={userData.measurements} checked={checkedItems} toggle={handleToggle} />
              </table>
            </div>
            : null
          }
        </div>
        : null
      }
    </div>
  );
};

const TableHeader = () => {
  const columnLabels = [
    'Poista',
    'Id',
    'Arvo',
    'Mittasuure',
    'Aika',
    'HenkilöId',
  ];

  return (
    <thead>
      <tr>
        {columnLabels.map((label, i) => <th key={i}>{label}</th>)}
      </tr>
    </thead>
  );
};

const TableBody = props => {
  return (
    <tbody>
      {props.data.map((c, i) => <TableRow key={i} data={c} checked={props.checked} toggle={props.toggle} />)}
    </tbody>
  );
};

const TableRow = props => {
  const { measurementId, value, unitName, time, personId } = props.data;
  const checked = props.checked;
  
  const selectId = "select-" + measurementId;

  const dateTime = new Date(time);
  const day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
  const month = dateTime.getMonth() < 9 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1;
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
  const minutes = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
  const seconds = dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds();

  const [rowChecked, setRowChecked] = useState(false);
  
  useEffect(() => {
    if (checked.length > 0 && checked.includes(measurementId)) {
      setRowChecked(true);
    }
    else {
      setRowChecked(false);
    }
  }, [measurementId, checked]);
  
  const toggleChecked = e => {
    const checked = e.target.checked;
    setRowChecked(checked);
    props.toggle(measurementId, checked);
  };
  
  return (
    <tr>
      <td>
        <input type="checkbox" id={selectId} checked={rowChecked} onChange={toggleChecked} />
      </td>
      <td>{measurementId}</td>
      <td>{value}</td>
      <td>{unitName}</td>
      <td>
        {day}.{month}.{year} &nbsp;{hours}:{minutes}:{seconds}
      </td>
      <td>{personId}</td>
    </tr>
  );
};

const Links = props => {
  return (
    <div>
      <span id="back-button">
        <Link to='/' onClick={props.reload}>Etusivulle</Link>
      </span>
      <span id="graph-button">
        <Link to={`/graph/${props.id}`}>Kuvaaja</Link>
      </span>
      <span id="insert-button">
        <Link to={`/measurement/${props.id}/add`}>Lisää mittaus</Link>
      </span>
    </div>
  );
};

const DeleteButton = props => {
  return (
    <div>
      <button type="button" className="delete-button" onClick={props.delete}>Poista valitut</button>
    </div>
  );
};

const InfoTextMeas = (props) => {
  const text = props.text;

  return (
    <div className={text !== '' ? "visible info-text" : "hidden"}>
      {text}
    </div>
  );
};

export default MeasurementTable;