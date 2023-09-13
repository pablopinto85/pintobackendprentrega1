import { Router } from "express";
import CartsManager from "../controller/CartsManager.js";
import { ProductManager } from "../controller/ProductManager.js"; 

const products = new ProductManager(); 


const cartsRouter = Router();


const carts = new CartsManager(); 


cartsRouter.post("/", async (req, res) => {
  let newCart = await carts.addCarts();
  res.send(newCart);
});

cartsRouter.get('/', async (req, res) => {
  try {
   
    const cartsData = await carts.readCarts(); 
    
 
    res.json(cartsData);
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener los carritos' });
  }
});


cartsRouter.get("/:id", async (req, res) => {
  let cartById = await carts.getCartById(req.params.id);
  if (cartById === 404)
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El Carrito solicitado no existe",
    });
  res.send(cartById);
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  let productInCart = await carts.addProductToCart(
    req.params.cid,
    req.params.pid,
    products 
  );
  if (productInCart === "error cart")
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El Carrito Seleccionado no existe",
    });
  if (productInCart === "error product")
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El producto Seleccionado no existe",
    });
  return res.send(productInCart);
});

export default cartsRouter;