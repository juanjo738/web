import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const AddUserForm = ({ user, onClose, token }) => {
  const [formData, setFormData] = useState({
    nombre: user ? user.nombre : '',
    edad: user ? user.edad : '',
    passwd: user ? user.passwd : '',
    avatar: user ? user.avatar : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevData => ({
      ...prevData,
      "avatar": file
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/agregar-usuario', {
        method: user ? 'PUT' : 'POST', // Si hay un usuario, es una edición; de lo contrario, es una adición
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: user ? JSON.stringify({...formData,"userId":user._id}) : JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Actualizar la lista de usuarios después de agregar/editar
      // Esto puede variar según la implementación
      // Aquí asumimos que se refrescará la lista de usuarios
      onClose(); // Cerrar el modal después de agregar/editar
    } catch (error) {
      console.error('Error adding/editing user:', error);
      // Manejar errores aquí
    }
  };


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formNombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control 
          type="text" 
          name="nombre" 
          value={formData.nombre} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formEdad">
        <Form.Label>Edad</Form.Label>
        <Form.Control 
          type="number" 
          name="edad" 
          value={formData.edad} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password" 
          name="passwd" 
          value={formData.passwd} 
          onChange={handleChange} 
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
        {user ? 'Guardar cambios' : 'Agregar usuario'}
      </Button>
      <Button variant="secondary" onClick={onClose} className="ml-2">
        Cancelar
      </Button>
    </Form>
  );
};

export default AddUserForm;
