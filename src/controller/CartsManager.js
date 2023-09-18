import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import path from 'path';
import { readDataFromFile, writeDataToFile } from './fileutils.js';

class CartsManager {
  constructor(productos) { 
    this.productosData = productos; 
    this.filePath = path.join('./src/models/carrito.json');
  }

  async readCarts() {
    try {
      const allCarts = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(allCarts);
    } catch (error) {
      return [];
    }
  }

  async writeCarts(carts) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async exist(id) {
    const cartsAll = await this.readCarts();
    return cartsAll.find((cart) => cart.id === id);
  }

  async deleteCart(id) {
    let carts = await this.readCarts();
    let filterCarts = carts.filter((cart) => cart.id !== id);
    await this.writeCarts(filterCarts);
    return filterCarts;
  }

  async addCarts() {
    let id = nanoid();
    let cartsOld = await this.readCarts();
    let allCarts = [...cartsOld, { id: id, productosData: [] }];
    await this.writeCarts(allCarts);
    return `Carrito Creado Exitosamente.\n Carritos Existentes ${allCarts.length}`;
  }

  async getCartById(id) {
    let existCart = await this.exist(id);
    if (!existCart) return 404;
    return existCart.productosData;
  }

  async addProductToCart(cartId, productId) {
    const cartById = await this.getCartById(cartId);
  
    if (!cartById) {
      throw new Error('Carrito no encontrado');
    }
  
    const productToAdd = this.productosData.find((product) => product.id === productId);
  
    if (!productToAdd) {
      return "Producto no encontrado";
    }
  
    const { productosData } = cartById;
    const existingProduct = productosData.find((product) => product.id === productId);
  
    if (existingProduct) {
      existingProduct.quantity++;
      await this.writeCarts([...carts, cartById]); 
      return `Producto "${existingProduct.title}" agregado al carrito exitosamente: ${cartId}\n Cantidad: ${existingProduct.quantity} `;
    } else {
      cartById.productosData.push({ ...productToAdd, quantity: 1 });
      await this.writeCarts([...carts, cartById]); 
      return `Producto "${productToAdd.title}" agregado al carrito exitosamente: ${cartId}`;
    }
  }
}

export default CartsManager;

const productosPath = '../models/productos.json';
const carritosPath = '../models/carrito.json';
const productosData = readDataFromFile(productosPath);
const carritosData = readDataFromFile(carritosPath);
const carritosdelete = new CartsManager(productosData);
