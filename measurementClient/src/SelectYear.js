/*
 * SelectYear.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectYear = props => {
  const [selectedYear, setSelectedYear] = useState(props.year);

  const years = ['2019', '2020'];
  const id = props.id;

  const handleChange = event => {
    const value = event.target.value;
    setSelectedYear(value);
    props.returnValue(value, props.type, 'Year');
  };

  return (
    <span>
      <label htmlFor={id}>Vuosi</label>
      <select id={id} value={selectedYear} onChange={handleChange}>
        {years.map((y, i) => <OptionItem key={i} value={y} />)}
      </select>
    </span>
  );
};

export default SelectYear;