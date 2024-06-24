import React, { useState, useEffect } from 'react';
import LoginForm from './Login';
import UserPopup from './UserPopup';
import AddressForm from './AddressForm';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; // Estilos principales

function App() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [addressAdded, setAddressAdded] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products?page=${page}`);
            const data = await response.json();
            setProducts(data.products);
            setFilteredProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/usuarios');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const handleLoginSuccess = (userName) => {
        setUser(userName); // Guardar el nombre del usuario logueado
    };

    const handleLogout = () => {
        setUser(null); // Limpiar el usuario logueado
    };

    const handleAddAddress = () => {
        setAddressAdded(true);
        setMenuOpen(false);
        setShowAddressForm(false);
        alert('Dirección agregada.');
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
        alert(`¡${product.name} agregado al carrito!`);
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        alert('Producto eliminado del carrito.');
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const handleBuy = (productId) => {
        if (addressAdded) {
            setShowPaymentForm(true);
            downloadPDF(productId);
        }
    };

    const downloadPDF = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}/download`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'product.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
        }
    };

    const handleSearch = () => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredProducts(results);
    };

    const handleCancelSearch = () => {
        setSearchInput('');
        setFilteredProducts(products);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            setProducts([...products, data]);
            alert('Producto agregado.');
            setNewProduct({ name: '', description: '', price: '', image: '' });
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="App">
            {user ? (
                <>
                    <header className="App-header">
                        <div className="navbar">
                            <h1 className="logo">
                                <span className="brand-name">GymBoosters</span>
                            </h1>
                            <div className="menu">
                                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                                    ☰
                                </div>
                                {menuOpen && (
                                    <div className="menu-dropdown">
                                        <button onClick={() => setShowAddressForm(true)}>Agregar dirección</button>
                                        <button onClick={handleLogout}>Cerrar sesión</button>
                                        <button onClick={() => setMenuOpen(false)}>Cerrar</button>
                                    </div>
                                )}
                            </div>
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button onClick={handleSearch}>Buscar</button>
                                <button onClick={handleCancelSearch}>Cancelar</button>
                            </div>
                            <div className="right-menu">
                                <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
                                    🛒 <span className="cart-count">{cart.length}</span>
                                </div>
                                {cartOpen && (
                                    <div className="cart-dropdown">
                                        <div className="cart-items">
                                            {cart.map(item => (
                                                <div key={item.id} className="cart-item">
                                                    <img src={process.env.PUBLIC_URL + '/' + item.image} alt={item.name} />
                                                    <div className="cart-item-details">
                                                        <p><strong>{item.name}</strong></p>
                                                        <p>{item.description}</p>
                                                        <p>Precio: ${item.price}</p>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="cart-total">
                                            Total: ${getTotalPrice()}
                                        </div>
                                        <button className="buy-button" onClick={() => handleBuy()}>Comprar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {showAddressForm && <AddressForm handleAddAddress={handleAddAddress} />}

                    <div className="add-product-form">
                        <h2>Agregar nuevo producto</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre del producto"
                            value={newProduct.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={newProduct.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Precio"
                            value={newProduct.price}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="image"
                            placeholder="Imagen (nombre del archivo)"
                            value={newProduct.image}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleAddProduct}>Agregar producto</button>
                    </div>

                    <div className="product-list">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product">
                                <img src={process.env.PUBLIC_URL + '/' + product.image} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Precio: ${product.price}</p>
                                <button className="buy-button" onClick={() => handleBuy(product.id)}>Comprar</button>
                                <button className="add-to-cart-button" onClick={() => addToCart(product)}>Agregar al carrito</button>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index + 1} onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="carousel">
                        <Slider {...carouselSettings}>
                            <div>
                                <img src={process.env.PUBLIC_URL + '/ad1.jpg'} alt="Anuncio 1" />
                            </div>
                            <div>
                                <img src={process.env.PUBLIC_URL + '/ad2.jpg'} alt="Anuncio 2" />
                            </div>
                            <div>
                                <img src={process.env.PUBLIC_URL + '/ad3.jpg'} alt="Anuncio 3" />
                            </div>
                        </Slider>
                    </div>

                    <footer>
                        {showPaymentForm && (
                            <div className="payment-form">
                                <h2>Elegir método de pago</h2>
                                <form>
                                    <label>
                                        Número de tarjeta de crédito:
                                        <input type="text" />
                                    </label>
                                    <label>
                                        Fecha de vencimiento:
                                        <input type="text" />
                                    </label>
                                    <label>
                                        CVV:
                                        <input type="text" />
                                    </label>
                                    <button type="submit">Pagar ahora</button>
                                </form>
                                <button onClick={() => setShowPaymentForm(false)}>Cancelar</button>
                            </div>
                        )}
                    </footer>

                    {showPopup && <UserPopup onClose={togglePopup} users={users} />}
                </>
            ) : (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
