// src/UserPopup.js
import React from 'react';
import './App.css';

function UserPopup({ onClose, users }) {
    return (
        <div className="popup-container">
            <div className="popup">
                <h2>Lista de Usuarios</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Contraseña</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.nombre}</td>
                                <td>{user.edad}</td>
                                <td>{user.password}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

export default UserPopup;
