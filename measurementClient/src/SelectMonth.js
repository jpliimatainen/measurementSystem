/*
 * SelectMonth.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import OptionItem from './OptionItem';

const SelectMonth = props => {
  const [selectedMonth, setSelectedMonth] = useState(props.month);

  const months = [];
  const id = props.id;

  // init the months array
  for (let i = 0; i < 12; i++) {
    if (i < 9) { // add a leading zero
      months.push('0' + (i + 1));
    }
    else {
      months.push(i + 1);
    }
  }

  const handleChange = event => {
    const value = event.target.value;
    setSelectedMonth(value);
    props.returnValue(value, props.type, 'Month');
  };

  return (
    <span>
      <label htmlFor={id}>Kuukausi</label>
      <select id={id} value={selectedMonth} onChange={handleChange}>
        {months.map((m, i) => <OptionItem key={i} value={m} />)}
      </select>
    </span>
  );
};

export default SelectMonth;