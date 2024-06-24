import React, { useState } from 'react';


function AddressForm({ handleAddAddress }) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (street && city && state && zipCode) {
      handleAddAddress();
    } else {
      alert('Por favor complete todos los campos.');
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Dirección</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Calle:
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </label>
        <label>
          Ciudad:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          Estado:
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Código Postal:
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </label>
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default AddressForm;
