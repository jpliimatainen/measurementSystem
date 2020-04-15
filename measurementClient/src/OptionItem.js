/*
 * SelectDate.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React from 'react';

const OptionItem = props => {
  const item = props.value;

  return <option value={item}>{item}</option>;
};

export default OptionItem;