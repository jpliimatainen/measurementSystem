/*
 * SelectSeconds.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectSeconds = props => {
  const [selectedSeconds, setSelectedSeconds] = useState(props.seconds);

  const seconds = [];
  const id = props.id;

  // init the seconds array
  for (let i = 0; i <= 59; i++) {
    if (i < 10) { // add a leading zero
      seconds.push('0' + i);
    }
    else {
      seconds.push(i);
    }
  }

  const handleChange = event => {
    const value = event.target.value;
    setSelectedSeconds(value);
    props.returnValue(value, props.type, 'Seconds');
  };

  return (
    <span>
      <label htmlFor={id}>Sekunnit</label>
      <select id={id} value={selectedSeconds} onChange={handleChange}>
        {seconds.map((s, i) => <OptionItem key={i} value={s} />)}
      </select>
    </span>
  );
};

export default SelectSeconds;