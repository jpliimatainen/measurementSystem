/*
 * InsertMeasurementForm.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dateHelpers from './dateHelpers';
import SelectDate from './SelectDate';

const InsertMeasurementForm = props => {
  const [unitName, setUnitName] = useState('');
  const [value, setValue] = useState('');
  const [time, setTime] = useState(dateHelpers.createDateObject(props.date));
  const [validValue, setValidValue] = useState(true);

  const errorFlags = props.errors;

  const history = useHistory();
  const personId = useParams().id;

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'unitName') {
      setUnitName(value);
    }
    else if (name === 'value') {
      setValue(value);
    }
  }

  const submitForm = () => {
    if (isNaN(parseFloat(value))) { // not a numeric string
      // set error
      setValidValue(false);
    }
    else {
      // reset error
      setValidValue(true);

      props.insert(
        [
          {
            unitName: unitName,
            value: value,
            time: dateHelpers.dateObjToString(time),
            personId: personId,
          }
        ],
        personId, history);
    }
  };

  const cancelForm = () => {
    history.push('/view/' + personId);
    props.cancel();
  }

  const handleTimeChange = (value, type, component) => {
    setTime(time => ({ ...time, [component]: value }));
  };

  return (
    <form id="insert-form">
      <h4>Anna mittauksen tiedot:</h4>
      <div>
        <input className={errorFlags.emptyUnitName ? "error" : ""} type="text"
          name="unitName" placeholder="Mittasuure" value={unitName} onChange={handleChange} />
      </div>
      <div className={errorFlags.emptyUnitName ? "error visible" : "hidden"}>
        Mittasuure on pakollinen
      </div>
      <div>
        <input className={!validValue ? "error" : ""} type="text"
          name="value" placeholder="Arvo" value={value} onChange={handleChange} />
      </div>
      <div className={!validValue ? "error visible" : "hidden"}>
        Anna kelvollinen numeroarvo
      </div>
      <SelectDate id="new" legend="Mittausaika" date={time} returnValue={handleTimeChange} />
      <div className="buttons">
        <input className="button" id="save-button" type="button" value="Tallenna" onClick={submitForm} />
        <input className="button" id="cancel-button" type="button" value="Peruuta" onClick={cancelForm} />
      </div>
    </form>
  );
};

export default InsertMeasurementForm;