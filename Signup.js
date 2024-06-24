import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setLoggedIn, handleCloseModalRegister, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null); // Nuevo estado para la imagen
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', username);
    formData.append('edad', edad);
    formData.append('passwd', password);
    formData.append('avatar', avatar); // Agregar la imagen al FormData

    try {
      const response = await fetch('http://localhost:3000/api/registrar-usuario', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        setUser(data.usuario.nombre);
        handleCloseModalRegister();
        navigate('/');
      } else {
        setError(data.mensaje);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error del servidor');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEdad">
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicAvatar">
          <Form.Label>Imagen de Perfil</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrarse
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
