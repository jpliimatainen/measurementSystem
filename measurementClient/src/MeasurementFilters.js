/*
 * MeasurementFilters.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import SelectDate from './SelectDate';
import OptionItem from './OptionItem';
import dateHelpers from './dateHelpers';

const MeasurementFilters = props => {
  const [startDate, setStartDate] = useState(props.start);
  const [endDate, setEndDate] = useState(props.end);
  const [unitName, setUnitName] = useState(props.unitName);

  const handleSubmit = () => {
    if (!dateHelpers.isValidDate(startDate)) {
      window.alert("Virheellinen alkupvm");
    }
    else if (!dateHelpers.isValidDate(endDate)) {
      window.alert("Virheellinen loppupvm");
    }
    else {
      props.filter(startDate, endDate, unitName);
    }
  };

  const handleTimeChange = (value, type, component) => {
    if (type === 'start') {
      // edit component value
      setStartDate(startDate => ({ ...startDate, [component]: value }));
    }
    else if (type === 'end') {
      // edit component value
      setEndDate(endDate => ({ ...endDate, [component]: value }));
    }
  };

  const handleUnitNameChange = value => {
    setUnitName(value);
  };

  return (
    <div>
      <form id="measurement-filters">
        <SelectDate id="start" legend="Alkaen:" date={startDate} returnValue={handleTimeChange} />
        <SelectDate id="end" legend="Päättyen:" date={endDate} returnValue={handleTimeChange} />
        <fieldset id="unit-name">
          <legend>Mittasuure:</legend>
          <SelectUnitName data={props.data} unitName={unitName} returnValue={handleUnitNameChange} />
        </fieldset>
        <div id="submit-form">
          <button type="button" onClick={handleSubmit}>Valitse</button>
        </div>
      </form>
    </div >
  );
};

const SelectUnitName = props => {
  const [selectedUnitName, setSelectedUnitName] = useState(props.unitName);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedUnitName(value);
    props.returnValue(value);
  };

  return (
    <span>
      <select id="select-unit-name" value={selectedUnitName} onChange={handleChange}>
        {props.data.map((m, i) => <OptionItem key={i} value={m} />)}
      </select>
    </span>
  );
};

export default MeasurementFilters;