/*
 * SelectMinutes.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectMinutes = props => {
  const [selectedMinutes, setSelectedMinutes] = useState(props.minutes);

  const minutes = [];
  const id = props.id;

  // init the minutes array
  for (let i = 0; i <= 59; i++) {
    if (i < 10) { // add a leading zero
      minutes.push('0' + i);
    }
    else {
      minutes.push(i);
    }
  }

  const handleChange = event => {
    const value = event.target.value;
    setSelectedMinutes(value);
    props.returnValue(value, props.type, 'Minutes');
  };

  return (
    <span>
      <label htmlFor={id}>Minuutit</label>
      <select id={id} value={selectedMinutes} onChange={handleChange}>
        {minutes.map((m, i) => <OptionItem key={i} value={m} />)}
      </select>
    </span>
  );
};

export default SelectMinutes;