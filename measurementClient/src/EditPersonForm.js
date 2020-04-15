/*
 * EditPersonForm.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const EditPersonForm = props => {
  const [data, setData] = useState({
    pin: '',
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const id = useParams().id;
  const errorFlags = props.errors;
  const history = useHistory();

  // load person data
  useEffect(() => {
    async function fetchPerson() {
      const response = await fetch('https://localhost:44389/api/persons/' + id);
      const data = await response.json();
      // populate initial values for the fields
      setData({
        personId: id,
        pin: data.pin,
        name: data.name,
        address: data.address !== null ? data.address : '',
        phone: data.phone !== null ? data.phone : '',
        email: data.email !== null ? data.email : '',
      });
    }

    fetchPerson();
  }, [id]);

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;

    setData(data => ({ ...data, [name]: value }));
  }

  const submitForm = () => {
    props.edit(data, history, "edit");
  };

  const cancelForm = () => {
    history.push('/');
    props.cancel();
  }

  return (
    <form id="insert-form">
      <h4>Muokkaa henkilön tietoja:</h4>
      <div>
        <input className={errorFlags.emptyPin || errorFlags.duplicatePin ?
          "error" : ""} type="text" name="pin" placeholder="Hetu" value={data.pin}
          onChange={handleChange} />
      </div>
      <div className={errorFlags.emptyPin ? "error visible" : "hidden"}>
        Hetu on pakollinen
      </div>
      <div className={errorFlags.duplicatePin ? "error visible" : "hidden"}>
        Hetu on jo käytössä
      </div>
      <div>
        <input className={errorFlags.emptyName ? "error" : ""} type="text"
          name="name" placeholder="Nimi" value={data.name} onChange={handleChange} />
      </div>
      <div className={errorFlags.emptyName ? "error visible" : "hidden"}>
        Nimi on pakollinen
      </div>
      <div>
        <input type="text" name="address" placeholder="Osoite"
          value={data.address} onChange={handleChange} />
      </div>
      <div>
        <input type="text" name="phone" placeholder="Puhelin"
          value={data.phone} onChange={handleChange} />
      </div>
      <div>
        <input type="text" name="email" placeholder="Sähköposti"
          value={data.email} onChange={handleChange} />
      </div>
      <input className="button" id="save-button" type="button" value="Tallenna" onClick={submitForm} />
      <input className="button" id="cancel-button" type="button" value="Peruuta" onClick={cancelForm} />
    </form>
  );
};

export default EditPersonForm;