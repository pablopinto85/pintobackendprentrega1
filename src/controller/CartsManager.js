import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

class CartsManager {
  constructor() {
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
    let allCarts = [...cartsOld, { id: id, productos: [] }];
    await this.writeCarts(allCarts);
    return `Carrito Creado Exitosamente.\n Carritos Existentes ${allCarts.length}`;
  }

  async getCartById(id) {
    let existCart = await this.exist(id);
    if (!existCart) return 404;
    return existCart.productos;
  }

  async addProductToCart(cartId, prodId) {
    let cartById = await this.exist(cartId);
    if (!cartById) return "error cart";
    
    
    let productById = await products.exist(prodId);
    if (!productById) return "error product";

    const { productos } = cartById;
    const existingProduct = productos.find((product) => product.id === prodId);

    if (existingProduct) {
      existingProduct.quantity++;
      await this.writeCarts([...carts, cartById]);
      return `Producto "${productById.title}" agregado al carrito: ${cartId}\n Cantidad: ${existingProduct.quantity} `;
    } else {
      cartById.productos.push({ id: prodId, quantity: 1 });
      await this.writeCarts([...carts, cartById]);
      return `Producto "${productById.title}" agregado al carrito: ${cartId}`;
    }
  }
}

export default CartsManager;
