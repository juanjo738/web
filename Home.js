import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage({ user }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="text-center">
        <h1>
          Bienvenido
          {!user && <span> a nuestra página de inicio</span>}
          {user && <span>, {user}, a nuestra página de inicio</span>}
        </h1>
        <p>¡Aquí puedes encontrar información sobre nuestros servicios y menú!</p>
      </div>
    </div>
  );
}

export default HomePage;
