/*
 * PersonTable.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React from 'react';
import { useHistory } from 'react-router-dom';

const PersonTable = props => {

  return (
    <table>
      <TableHeader />
      <TableBody data={props.data} delete={props.delete} action={props.action} />
    </table>
  );
};

const TableHeader = () => {
  const columnLabels = [
    'Id',
    'Hetu',
    'Nimi',
    'Osoite',
    'Puhelin',
    'Sähköposti',
    '',
  ];

  return (
    <thead>
      <tr>
        {columnLabels.map((label, i) => <th key={i}>{label}</th>)}
      </tr>
    </thead>
  );
};

const TableBody = props => {
  return (
    <tbody>
      {props.data.map((c, i) => <TableRow key={i} data={c} delete={props.delete} action={props.action} />)}
    </tbody>
  );
};

const TableRow = props => {
  const { personId, pin, name, address, phone, email } = props.data;
  const history = useHistory();

  const handleActionSelect = (id, event) => {
    // send a signal to reset the info text
    props.action();

    switch (event.target.value) {
      case '1': // show measurements
        history.push('/view/' + id);
        break;
      case '2': // show graph
        history.push('/graph/' + id);
        break;
      case '3': // show edit form
        history.push('/edit/' + id);
        break;
      case '4': // delete person
        if (window.confirm("Haluatko varmasti poistaa henkilön?")) {
          props.delete(id);
        }
        break;
      default:
        break;
    }
  };

  return (
    <tr>
      <td>{personId}</td>
      <td>{pin}</td>
      <td>{name}</td>
      <td>{address}</td>
      <td>{phone}</td>
      <td>{email}</td>
      <td>
        <select name="action" value="0" onChange={(e) => handleActionSelect(personId, e)}>
          <option value="0">Valitse</option>
          <option value="1">Tiedot</option>
          <option value="2">Kuvaaja</option>
          <option value="3">Muokkaa</option>
          <option value="4">Poista</option>
        </select>
      </td>
    </tr>
  );
};

export default PersonTable;