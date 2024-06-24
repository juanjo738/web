import React, { useState } from 'react';


function CreditCardForm({ handleAddCreditCard }) {
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (creditCardNumber && expirationDate && cvv) {
      handleAddCreditCard();
    } else {
      alert('Por favor complete todos los campos.');
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Tarjeta de Crédito</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Número de Tarjeta de Crédito:
          <input
            type="text"
            value={creditCardNumber}
            onChange={(e) => setCreditCardNumber(e.target.value)}
          />
        </label>
        <label>
          Fecha de Vencimiento:
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </label>
        <label>
          CVV:
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCVV(e.target.value)}
          />
        </label>
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default CreditCardForm;
