import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import cartsRouter from '../routes/carts.routes.js';
import CartsManager from "../controller/CartsManager.js";
import { readDataFromFile, writeDataToFile } from '../controller/fileutils.js';
import productosPath from '../models/productos.json' assert { type: 'json' };
import carritosPath from '../models/carrito.json' assert { type: 'json' };


const app = express();
const PORT = 8080;

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const currentDirectory = dirname(currentFilePath);


const productosData = readDataFromFile(productosPath);
const carritosData = readDataFromFile(carritosPath);

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

const carritosdelete = new CartsManager(productosData);

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid, 10);

  try {
    const result = await carritosdelete.addProductToCart(cartId, productId);
    
    if (result === 'Carrito no encontrado') {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(201).json({ message: result });
  } catch (error) {
    console.error('Hubo un error al agregar el producto al carrito:', error);
    res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito' });
  }
});




app.listen(PORT, () => {
  console.log(`Servidor escuchando y activo en el puerto ${PORT}`);
});