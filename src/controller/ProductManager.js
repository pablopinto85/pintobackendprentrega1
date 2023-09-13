import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import path from 'path';

class ProductManager {
  constructor() {
    this.filePath = new URL('productos.json', import.meta.url).pathname;
  }

  async readProducts() {
    try {
      let allProducts = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(allProducts);
    } catch (error) {
      throw error;
    }
  }

  async writeProducts(productos) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
    } catch (error) {
      throw error;
    }
  }

  async exist(id) {
    let productsAll = await this.readProducts();
    return productsAll.find((product) => product.id === id);
  }

  objectKeys(object) {
    if (
      !object.title ||
      !object.description ||
      !object.price ||
      !object.status ||
      !object.category ||
      !object.code ||
      !object.stock
    ) {
      throw new Error("Faltan campos obligatorios");
    }
  }

  async getProducts(limit) {
    let allBooks = await this.readProducts();
    if (!limit) return allBooks;
    let bookFilter = allBooks.slice(0, parseInt(limit));
    return bookFilter;
  }

  async getProductsById(id) {
    let bookById = await this.exist(id);
    if (!bookById) return 404;
    return bookById;
  }

  async addProduct(newProduct) {
    
    this.objectKeys(newProduct);
    let productsOld = await this.readProducts();
    newProduct.id = nanoid();
    let productsAll = [...productsOld, newProduct];
    await this.writeProducts(productsAll);
    return "Producto Agregado Correctamente";
  }

  async updateProduct(id, product) {
    
    let bookById = await this.exist(id);
    if (!bookById) return 404;
   
    this.objectKeys(product);
    
    await this.deleteProducts(id);
    
    let prod = await this.readProducts();
    let modifiedProducts = [
      ...prod,
      {
        ...product,
        id: id,
      },
    ];
    await this.writeProducts(modifiedProducts);
    return `Producto ${product.title} Modificado con Éxito`;
  }

  async deleteProducts(id) {
   
    let bookById = await this.exist(id);
    if (!bookById) return 404;
    let products = await this.readProducts();
    let filterProducts = products.filter((prod) => prod.id != id);
    await this.writeProducts(filterProducts);
    return "Producto Eliminado Exitosamente";
  }
}

export { ProductManager };
