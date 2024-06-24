import React, { useState } from 'react';
import './App.css';

function LoginForm({ onLoginSuccess }) {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [registerNombre, setRegisterNombre] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerEdad, setRegisterEdad] = useState('');
    const [error, setError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpiar errores anteriores

        try {
            const response = await fetch('http://localhost:3001/api/login', { // Asegúrate de que el puerto es 3001
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, password }),
            });
            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(nombre);  // Llamar a la función del padre para manejar el éxito
            } else {
                setError(data.message || 'Error de inicio de sesión');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setRegisterError('');
        setRegisterSuccess('');

        try {
            const response = await fetch('http://localhost:3001/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: registerNombre, edad: registerEdad, password: registerPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setRegisterSuccess('Registro exitoso. Ahora puede iniciar sesión.');
                setShowRegisterForm(false); // Ocultar el formulario de registro después de un registro exitoso
            } else {
                setRegisterError(data.message || 'Error de registro');
            }
        } catch (error) {
            setRegisterError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container">
            <h1>Bienvenidos a GymBoosters</h1>
            <h2>Construye tu mejor versión con GymBoosters</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">Iniciar sesión</button>
                <button type="button" onClick={() => setShowRegisterForm(!showRegisterForm)}>
                    {showRegisterForm ? 'Cancelar' : 'Registrar'}
                </button>
                {error && <p>{error}</p>}
            </form>

            {showRegisterForm && (
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Nombre:</label>
                        <input type="text" value={registerNombre} onChange={e => setRegisterNombre(e.target.value)} />
                    </div>
                    <div>
                        <label>Edad:</label>
                        <input type="number" value={registerEdad} onChange={e => setRegisterEdad(e.target.value)} />
                    </div>
                    <div>
                        <label>Contraseña:</label>
                        <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                    </div>
                    <button type="submit">Registrar</button>
                    {registerError && <p>{registerError}</p>}
                    {registerSuccess && <p className="register-success">{registerSuccess}</p>}
                </form>
            )}
        </div>
    );
}

export default LoginForm;
