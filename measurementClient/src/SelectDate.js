/*
 * SelectDate.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React from 'react';
import SelectDay from './SelectDay';
import SelectMonth from './SelectMonth';
import SelectYear from './SelectYear';
import SelectHours from './SelectHours';
import SelectMinutes from './SelectMinutes';
import SelectSeconds from './SelectSeconds';

const SelectDate = props => {
  const { id, legend, date, returnValue } = props;

  return (
    <div className="select-date">
      <fieldset id={id}>
        <legend>{legend}</legend>
        <SelectDay id={"select-day-" + id} day={date.Day}
          type={id} returnValue={returnValue} />
        <SelectMonth id={"select-month-" + id} month={date.Month}
          type={id} returnValue={returnValue} />
        <SelectYear id={"select-year-" + id} year={date.Year}
          type={id} returnValue={returnValue} />
        <SelectHours id={"select-hours-" + id} hours={date.Hours}
          type={id} returnValue={returnValue} />
        <SelectMinutes id={"select-minutes-" + id} minutes={date.Minutes}
          type={id} returnValue={returnValue} />
        <SelectSeconds id={"select-seconds-" + id} seconds={date.Seconds}
          type={id} returnValue={returnValue} />
      </fieldset>
    </div>
  );
};

export default SelectDate;