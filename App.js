import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './components/Navbar';
import Home from './components/Home';
import Users from './components/Users';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    

    // Verificar si hay un token
    if (!token) {
      // Si no hay token, redirige al usuario al inicio de sesión
      //navigate('/');
      return;
    } 

    // Si la respuesta es exitosa, obtén los datos del usuario
    fetch('http://localhost:3000/api/validar-token', {
      method: 'POST',
      headers: {
        Authorization: token
      }
    })
    .then(response => {
      if (!response.ok) {
        console.error('Error al obtener los datos');
        //navigate('/');
        return;
      }
      // Si la respuesta es exitosa, convierte la respuesta a JSON
      return response.json();
    })
    .then(data => {
      console.log(data.user);
      setUser(data.user.nombre);
      setAvatar(data.user.avatar);
      setLoggedIn(true)
      return
    })
    .catch(error => {
      // Si hay un error, redirige al usuario al inicio de sesión
      console.error('Error:', error);
      //navigate('/');
      return;
    });
  }, []);

  return (
    <Router>
    <div>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} handleShowModal={handleShowModal} handleCloseModal={handleCloseModal} user={user} setUser={setUser} avatar={avatar} setAvatar={setAvatar}/>
      <Container className="d-flex justify-content-center align-items-center" >
          <Routes>
            <Route path="/" element={<Home showModal={showModal} handleCloseModal={handleCloseModal} user={user}/>} />
            <Route path="/usuarios" element={<Users loggedIn={loggedIn} token={token}/>} /> 
          </Routes>
      </Container>
    </div>
    </Router>
  );
}

export default App;
