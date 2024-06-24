import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './Login.css'; // Importa el archivo CSS para el estilo
import { useNavigate } from 'react-router-dom';

const Login = ({setLoggedIn, handleCloseModal, setUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verificar que tanto el nombre de usuario como la contraseña no estén vacíos
    if (!username || !password) {
      setError('Por favor, ingrese nombre de usuario y contraseña.');
      return;
    }

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: username, passwd: password })
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject('Error en la solicitud: ' + response.statusText);
        } else {
          // Log successful login
          console.log('Usuario', username, 'ha iniciado sesión.');
          // Redirect to home page
          return response.json();
        }
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setLoggedIn(true)
        setUser(data.usuario.nombre)
        handleCloseModal()
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error del servidor: ' + error);
      });
  };

  return (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Iniciar Sesión
              </Button>
            </Form>
            </>
  );
};

export default Login;
