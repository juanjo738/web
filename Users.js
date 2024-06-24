import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal, Image } from 'react-bootstrap';
import AddUserForm from './AddUserForm';
import { useNavigate } from 'react-router-dom';

const Users = ({ loggedIn, token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [perPage, setPerPage] = useState(10); // Número de registros por página
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);

        const token = localStorage.getItem('token');

        // Verificar si hay un token
        if (!token) {
          // Si no hay token, redirige al usuario al inicio de sesión
          if (!loggedIn)
            navigate('/')
          else
            setError('Error de autenticación - token')
          return;
        } 
        fetch(`http://localhost:3000/api/usuarios?page=${page}&limit=${perPage}`, {
          method: 'GET',
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          if (!response.ok) {
            console.error('Error al obtener los datos');
            if (!loggedIn)
              navigate('/');
            return;
          }
          const totalPages = Math.ceil(parseInt(response.headers.get('X-Total-Count')) / perPage);
          setTotalPages(totalPages);
          // Si la respuesta es exitosa, convierte la respuesta a JSON
          return response.json();
        })
        .then(data => {
          setUsers(data);
        })
        .catch(error => {
          // Si hay un error, redirige al usuario al inicio de sesión
          console.error('Error:', error);
          if (!loggedIn)
          navigate('/');
        });
    };

    fetchData();
    setLoading(false);

  }, [page, perPage]);

  const handlePerPageChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setPerPage(value);
      setPage(1); // Resetear la página cuando se cambia el número de registros por página
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleOpenModal = () => {
    setSelectedUser(null); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuario`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Actualizar la lista de usuarios después de eliminar el usuario
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      // Manejar errores aquí
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user); // Guardar el usuario seleccionado para editar
    setShowModal(true); // Abrir el modal de edición
  };

  return (
    <div className="container mt-1" style={{ height: '80vh' }}>
      <h1>Usuarios</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button className="btn btn-primary" onClick={handleOpenModal} >
              <FontAwesomeIcon icon={faPlus} /> Agregar Usuario
            </button>
          </div>
          <div> 
          Registros :
          <input
            type="number"
            value={perPage}
            onChange={handlePerPageChange}
            style={{ width: "60px", marginLeft: "10px" }}
          />&nbsp;&nbsp;&nbsp;
          Página {page} de {totalPages} &nbsp;&nbsp;&nbsp;
          {page > 1 && (
            <button className="btn btn-primary ml-2" onClick={handlePreviousPage}>
             <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          {page < totalPages && (
            <button className="btn btn-primary ml-2" onClick={handleNextPage}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
          </div>
        </div>

      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Password</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>
                {user.avatar && (
                  <Image src={user.avatar} roundedCircle style={{ width: '30px', height: '30px' }} />
                )}
              </td>
              <td>{user.nombre}</td>
              <td>{user.edad}</td>
              <td>{user.passwd}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEditUser(user)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
      {/* Aquí se renderiza el modal */}
      {showModal && (
      <div className="modal-bg">
      {/* Modal de agregar usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUserForm user={selectedUser} onClose={handleCloseModal} token={token}/>
        </Modal.Body>
      </Modal>
      </div>
      )}
    </div>
  );
};

export default Users;