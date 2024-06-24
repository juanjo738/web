const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pdf = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Sirve archivos estáticos desde el directorio "public"

let products = [
    { id: 1, name: 'TITANIUM BEEF', description: 'SAN NUTRITION 100% PURE TITANIUM BEEF 4 LBS :: SUPLEMENTOS DEPORTIVOS', price: 999.00, image: 'product1.jpg' },
    { id: 2, name: 'AMP 2000', description: 'Total Fitness Supplements AMP 2000 Pre Workout Powder', price: 1199.00, image: 'product2.jpg' },
    { id: 3, name: 'WHEY PROTEIN', description: '100% WHEY PROTEIN 2 LIBRAS MUSCLETECH (PAQUETE DE 2 PIEZAS)', price: 1299.00, image: 'product3.jpg' },
    { id: 4, name: 'CREATINE', description: 'MuscleTech Platinum Creatine Monohydrate Powder, 100% Pure', price: 799.00, image: 'product4.jpg' },
    { id: 5, name: 'VENOM INFERNO', description: 'PRE ENTRENO,VENOM,DRAGON PHARMA, SUPLEMENTO', price: 675.00, image: 'product5.jpg' },
    { id: 6, name: 'Best Protein', description: 'Best Protein 5 Libras Bpi Proteina Suplemento Fitness Gym', price: 1250.00, image: 'product6.jpg' },
    { id: 7, name: 'Iso Pure', description: 'Iso Pure Protein Powder', price: 1500.00, image: 'product7.jpg' },
    { id: 8, name: 'Mass Gainer', description: 'Serious Mass Weight Gainer', price: 2000.00, image: 'product8.jpg' },
    { id: 9, name: 'Glutamine', description: 'Optimum Nutrition Glutamine Powder', price: 500.00, image: 'product9.jpg' },
    { id: 10, name: 'Nitro Tech', description: 'Nitro Tech Whey Gold Protein Powder', price: 1800.00, image: 'product10.jpg' },
    { id: 11, name: 'Casein Protein', description: 'Gold Standard Casein Protein Powder', price: 2200.00, image: 'product11.jpg' },
    { id: 12, name: 'BCAA', description: 'Scivation Xtend BCAA Powder', price: 1200.00, image: 'product12.jpg' },
];

// Paginación
app.get('/api/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    res.json({
        totalProducts: products.length,
        totalPages: Math.ceil(products.length / limit),
        currentPage: page,
        products: paginatedProducts
    });
});

// Endpoint para agregar un nuevo producto
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Endpoint para descargar PDF del producto comprado
app.get('/api/products/:id/download', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Producto no encontrado');

    const doc = new pdf();
    const filePath = `./public/${product.name}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text(`Product Name: ${product.name}`);
    doc.fontSize(20).text(`Description: ${product.description}`);
    doc.fontSize(20).text(`Price: $${product.price}`);
    doc.end();

    doc.on('finish', () => {
        res.download(filePath, `${product.name}.pdf`, (err) => {
            if (err) {
                res.status(500).send('Error al descargar el PDF');
            } else {
                fs.unlinkSync(filePath); // Borra el archivo después de descargar
            }
        });
    });
});

// Conexión a MongoDB
mongoose.connect('mongodb+srv://admin:19020133@atlascluster.autkgss.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB...'))
.catch(err => console.error('No se pudo conectar a MongoDB...', err));

// Definir un esquema y modelo de Mongoose para una entidad, por ejemplo, 'Usuario'
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    edad: Number,
    password: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para el login
app.post('/api/login', async (req, res) => {
    try {
        const { nombre, password } = req.body;
        const usuario = await Usuario.findOne({ nombre, password });
        if (usuario) {
            res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
        } else {
            res.status(400).json({ message: 'Nombre o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// Ruta para obtener usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});

// Ruta para agregar un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    try {
        let usuario = new Usuario({
            nombre: req.body.nombre,
            edad: req.body.edad,
            password: req.body.password
        });
        usuario = await usuario.save();
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar usuario', error });
    }
});

// Establecer el puerto y escuchar las solicitudes
const port = process.env.PORT || 3001; // Asegúrate de que el puerto es 3001
app.listen(port, () => console.log(`Escuchando en el puerto ${port}...`));
