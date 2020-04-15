/*
 * SelectDay.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectDay = props => {
  const [selectedDay, setSelectedDay] = useState(props.day);

  const days = [];
  const id = props.id;

  // init the days array
  for (let i = 0; i < 31; i++) {
    if (i < 9) { // add a leading zero
      days.push('0' + (i + 1));
    }
    else {
      days.push(i + 1);
    }
  }

  const handleChange = event => {
    const value = event.target.value;
    setSelectedDay(value);
    props.returnValue(value, props.type, 'Day');
  };

  return (
    <span>
      <label htmlFor={id}>Päivä</label>
      <select id={id} value={selectedDay} onChange={handleChange}>
        {days.map((d, i) => <OptionItem key={i} value={d} />)}
      </select>
    </span>
  );
};

export default SelectDay;