import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import cartsRouter from '../routes/carts.routes.js';
import CartsManager from "../controller/CartsManager.js";

const app = express();
const PORT = 8080;


app.use(bodyParser.json());

const productsRouter = express.Router();
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const currentDirectory = dirname(currentFilePath);

const productosPath = join(currentDirectory, 'productos.json'); 
const carritosPath = join(currentDirectory, 'carrito.json'); 

function readDataFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}


function writeDataToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}




const carritosdelete = new CartsManager(); 


let productos = [
  { id: 1, title: 'Producto 1', description: "descripcion producto1", code: "121", price: 1000, stock: 100, category: "categoria 1", thumbnails: "/img/image1", status: true },
  { id: 2, title: 'Producto 2', description: "descripcion producto2", code: "122", price: 2000, stock: 200, category: "categoria 1", thumbnails: "/img/image2", status: true },
  { id: 3, title: 'Producto 3', description: "descripcion producto3", code: "123", price: 3000, stock: 300, category: "categoria 1", thumbnails: "/img/image3", status: true },
  { id: 4, title: 'Producto 4', description: "descripcion producto4", code: "124", price: 4000, stock: 400, category: "categoria 1", thumbnails: "/img/image4", status: true },
  { id: 5, title: 'Producto 5', description: "descripcion producto5", code: "125", price: 5000, stock: 500, category: "categoria 2", thumbnails: "/img/image5", status: true },
  { id: 6, title: 'Producto 6', description: "descripcion producto6", code: "126", price: 6000, stock: 600, category: "categoria 2", thumbnails: "/img/image6", status: true },
  { id: 7, title: 'Producto 7', description: "descripcion producto7", code: "127", price: 7000, stock: 700, category: "categoria 2", thumbnails: "/img/image7", status: true },
  { id: 8, title: 'Producto 8', description: "descripcion producto8", code: "128", price: 8000, stock: 800, category: "categoria 2", thumbnails: "/img/image8", status: true },
];





function generateUniqueId() {
  return new Date().getTime();
}


productsRouter.get('/', (req, res) => {

  const limit = req.query.limit || productos.length;
  const limitedProducts = productos.slice(0, limit);
  res.json(limitedProducts);
});


productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productos.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


productsRouter.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }


  const newProduct = {
    id: generateUniqueId(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  productos.push(newProduct);
  writeDataToFile(productosPath, productos); 
  res.status(201).json(newProduct);
});

app.delete('/api/carts/:id', async (req, res) => {
  const cartId = req.params.id;

  try {
    await carritosdelete.deleteCart(cartId);
    console.log(`Carrito con ID ${cartId} eliminado correctamente`);
    res.status(204).send();
  } catch (error) {
    console.error('Hubo un error al eliminar el carrito:', error);
    res.status(500).json({ error: 'Hubo un error al eliminar el carrito' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando y activo en el puerto ${PORT}`);
});