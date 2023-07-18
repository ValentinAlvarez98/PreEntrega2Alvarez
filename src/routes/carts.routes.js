import {
      Router
} from 'express';

import Carts from "../dao/dbManagers/carts.js";
import Products from "../dao/dbManagers/products.js";

const cartsRouter = Router();
const cartsManager = new Carts();

const productsManager = new Products();

cartsRouter.get('/', async (req, res) => {

      try {

            let carts = await cartsManager.getAll();

            if (!carts) return res.status(404).send({
                  status: "error",
                  payload: "No hay carritos en la base de datos"
            });

            res.send({
                  status: "success",
                  payload: carts
            });

      } catch (error) {

            console.log("Error en getAll de carts: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

cartsRouter.get('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            let cart = await cartsManager.getById(id);

            if (!cart) return res.status(404).send({
                  status: "error",
                  payload: "Carrito no encontrado"
            });

            res.send({
                  status: "success",
                  payload: cart
            });

      } catch (error) {

            console.log("Error en getById de carts: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

cartsRouter.post('/', async (req, res) => {

      try {

            let newCart = {
                  products: [],
                  id: Math.floor(Math.random() * 100) + 1,
            };

            let carts = await cartsManager.getAll();

            if (!carts) return res.status(404).send({
                  status: "error",
                  payload: "No hay carritos en la base de datos"
            });

            if (carts.some(cart => cart.id === newCart.id)) {

                  const maxAttempts = 100;
                  let attempts = 0;

                  newCart.id = Math.floor(Math.random() * 100) + 1;

                  while (carts.some(cart => cart.id === newCart.id) && attempts < maxAttempts) {

                        newCart.id = Math.floor(Math.random() * 100) + 1;
                        attempts++;

                  };

                  if (attempts === maxAttempts) return res.status(400).send({
                        status: "error",
                        payload: "Después de 100 intentos, no se pudo generar un id único"
                  });

            };

            let result = await cartsManager.saveCart(newCart);

            res.send({
                  status: "success",
                  payload: result
            });

      } catch (error) {

            console.log("Error en saveCart de carts: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

cartsRouter.put('/:id/product/:pid', async (req, res) => {
      try {
            const {
                  id,
                  pid
            } = req.params;

            const cart = await cartsManager.getById(id);

            if (!cart) {

                  return res.status(404).send({
                        status: "error",
                        payload: "No existe un carrito con ese id"
                  });

            };

            const product = await productsManager.getById(pid);

            if (!product) {

                  return res.status(404).send({
                        status: "error",
                        payload: "No existe un producto con ese id"
                  });

            };

            const result = await cartsManager.addProduct(cart, pid);

            if (!result) {

                  return res.status(404).send({
                        status: "error",
                        payload: "Error al agregar el producto al carrito"
                  });

            };

            res.send({
                  status: "success",
                  payload: `Producto con id: ${pid} agregado al carrito con id: ${id}`
            });

      } catch (error) {

            console.log("Error en addProduct de carts: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

cartsRouter.delete('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            let carts = await cartsManager.getAll();

            if (!carts) return res.status(404).send({
                  status: "error",
                  payload: "No hay carritos en la base de datos"
            });

            let cartToDelete = carts.find(cart => cart.id === parseInt(id));

            if (!cartToDelete) return res.status(404).send({
                  status: "error",
                  payload: "No existe un carrito con ese id"
            });

            let result = await cartsManager.deleteById(id);

            if (!result) return res.status(404).send({
                  status: "error",
                  payload: "Error al eliminar el carrito"
            });

            res.send({
                  status: "success",
                  payload: `Carrito con id: ${id} eliminado correctamente`
            });

      } catch (error) {

            console.log("Error en delete de carts: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

export default cartsRouter;