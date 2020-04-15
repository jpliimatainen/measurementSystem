/*
 * SelectHours.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectHours = props => {
  const [selectedHours, setSelectedHours] = useState(props.hours);

  const hours = [];
  const id = props.id;

  // init the hours array
  for (let i = 0; i <= 23; i++) {
    if (i < 10) { // add a leading zero
      hours.push('0' + i);
    }
    else {
      hours.push(i);
    }
  }

  const handleChange = event => {
    const value = event.target.value;
    setSelectedHours(value);
    props.returnValue(value, props.type, 'Hours');
  };

  return (
    <span className="clear">
      <label htmlFor={id}>Tunnit</label>
      <select id={id} value={selectedHours} onChange={handleChange}>
        {hours.map((h, i) => <OptionItem key={i} value={h} />)}
      </select>
    </span>
  );
};

export default SelectHours;