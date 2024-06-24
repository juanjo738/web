import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Modal, Container, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';

function NavBar({ loggedIn, setLoggedIn, user, setUser, avatar, setAvatar }) {
  const [showModal, setShowModal] = React.useState(false);
  const [showModalRegister, setShowModalRegister] = React.useState(false);
  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModalRegister = () => setShowModalRegister(true);
  const handleCloseModalRegister = () => setShowModalRegister(false);

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    setLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Mi Sitio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          {loggedIn && (
          <Nav className="mr-auto">
            <NavDropdown title="Configuración" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/usuarios">Usuarios</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/users" >Otra opción</NavDropdown.Item>
            </NavDropdown>
          </Nav>)}
          <Nav className="ml-auto">
            {!loggedIn ? (
              <>
              <Button variant="outline-light" onClick={handleShowModal}>Iniciar Sesión</Button>
              <Button variant="outline-light" onClick={handleShowModalRegister}>Registrarse</Button>
              </>
              ) : (
              <NavDropdown title={<span>
                <Image src={avatar} roundedCircle style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                {user}
              </span>} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* Modal para el formulario de inicio de sesión */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login setLoggedIn={setLoggedIn} handleCloseModal={handleCloseModal} setUser={setUser}/>
        </Modal.Body>
      </Modal>
      {/* Modal para el formulario de Registro */}
      <Modal show={showModalRegister} onHide={handleCloseModalRegister} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registro de usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Signup setLoggedIn={setLoggedIn} handleCloseModalRegister={handleCloseModalRegister} setUser={setUser}/>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}

export default NavBar;
