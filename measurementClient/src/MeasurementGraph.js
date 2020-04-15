/*
 * MeasurementGraph.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MeasurementFilters from './MeasurementFilters';
import MeasurementChart from './MeasurementChart';
import dateHelpers from './dateHelpers';

const MeasurementGraph = () => {
  const [userData, setUserData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [startFilter, setStartFilter] = useState(
    dateHelpers.createDateObject(new Date(2019, 11, 1, 0, 0, 0))  // 01.12.2019 00:00:00
  );
  const [endFilter, setEndFilter] = useState(
    dateHelpers.createDateObject(new Date())  // current time
  );
  const [unitNameFilter, setUnitNameFilter] = useState('Valitse');

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
      url += '?start=' + startStr + '&end=' + endStr + '&unitName=' + unitNameFilter;

      const response = await fetch(url);
      const data = await response.json();
      const measurements = data.measurements;
      
      if (measurements.length > 0) {
        // convert a date string to the component form
        measurements.forEach(element => {
          element.time = dateHelpers.createDateObject(new Date(element.time));
        });
        // update data
        data.measurements = measurements;
      }
      
      setUserData(data);
    }

    // load metric names
    async function fetchUnitNames() {
      const response = await fetch('https://localhost:44389/api/persons/'
        + personId + '/measurements/metrics');

      const data = await response.json();
      setMetrics(['Valitse'].concat(data.metrics));
    }

    fetchUnitNames();
    fetchMeasurements();

  }, [personId, endFilter, startFilter, unitNameFilter]);

  const handleFilter = (start, end, unitName) => {
    // update states
    setStartFilter(start);
    setEndFilter(end);
    setUnitNameFilter(unitName);
  };
  
  return (
    <div>
      <Links id={personId} />
      {userData !== undefined ?
        <div>
          <h2>{userData.name}</h2>
          <MeasurementFilters data={metrics} start={startFilter} end={endFilter}
            unitName={unitNameFilter} filter={handleFilter} />
          {userData.measurements !== undefined && userData.measurements.length > 0 ?
            <MeasurementChart data={userData.measurements} unitName={unitNameFilter} /> :
            <div><h2>Valitse mittasuure</h2></div>
          }
        </div>
        : null
      }
    </div>
  );
};

const Links = props => {
  return (
    <div>
      <span id="back-button">
        <Link to='/'>Etusivulle</Link>
      </span>
      <span id="view-button">
        <Link to={`/view/${props.id}/`}>Mittaukset</Link>
      </span>
    </div>
  );
}

export default MeasurementGraph;