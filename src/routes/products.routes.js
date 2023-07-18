import {
      Router
} from 'express';

import Products from "../dao/dbManagers/products.js";
import ProductsFs from "../dao/fileManagers/products.js";

const productsRouter = Router();
const productsManager = new Products();
const productsFsManager = new ProductsFs();

productsRouter.get('/', async (req, res) => {

      try {

            let products = await productsManager.getAll();

            res.send({
                  status: "success",
                  payload: products
            });

      } catch (error) {

            console.log("Error en getAll de products: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

productsRouter.get('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            let product = await productsManager.getById(id);

            if (!product) return res.status(404).send({
                  status: "error",
                  payload: "Producto no encontrado"
            });

            res.send({
                  status: "success",
                  payload: product
            });

      } catch (error) {

            console.log("Error en getById de products: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

productsRouter.post('/', async (req, res) => {

      try {

            const {
                  title,
                  description,
                  code,
                  price,
                  status,
                  stock,
                  category,
                  thumbnails,
            } = req.body;

            if (!title || !description || !code || !price || !status.toString() || !stock || !category) return res.status(400).send({
                  status: "error",
                  payload: "Faltan datos obligatorios"
            });

            let newProduct = {

                  title,
                  description,
                  code,
                  price,
                  status,
                  stock,
                  category,
                  thumbnails,
                  id: Math.floor(Math.random() * 100) + 1,

            };

            let products = await productsManager.getAll();

            if (products.some(product => product.code === newProduct.code)) return res.status(400).send({
                  status: "error",
                  payload: "Ya existe un producto con ese código"
            });

            if (products.some(product => product.id === newProduct.id)) {

                  const maxAttempts = 100;
                  let attempts = 0;

                  newProduct.id = Math.floor(Math.random() * 100) + 1;

                  while (products.some(product => product.id === newProduct.id) && attempts < maxAttempts) {

                        newProduct.id = Math.floor(Math.random() * 100) + 1;
                        attempts++;

                  };

                  if (attempts === maxAttempts) return res.status(400).send({
                        status: "error",
                        payload: "Después de 100 intentos, no se pudo generar un id único"
                  });

            };

            let result = await productsManager.saveProduct(newProduct);
            await productsFsManager.getAll();

            res.send({
                  status: "success",
                  payload: result
            });

      } catch (error) {

            console.log("Error en saveProduct: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

productsRouter.put('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            const {
                  title,
                  description,
                  code,
                  price,
                  status,
                  stock,
                  category,
                  thumbnails,
            } = req.body;

            if (!title || !description || !code || !price || !status.toString() || !stock || !category) return res.status(400).send({
                  status: "error",
                  payload: "Faltan datos obligatorios"
            });

            let productToUpdate = await productsManager.getById(id);

            if (!productToUpdate) return res.status(404).send({
                  status: "error",
                  payload: "Producto no encontrado"
            });

            const productUpdated = {
                  ...productToUpdate,
                  title,
                  description,
                  code,
                  price,
                  status,
                  stock,
                  category,
                  thumbnails,
            };

            let result = await productsManager.updateById(id, productUpdated);

            await productsFsManager.getAll();

            if (!result) return res.status(400).send({
                  status: "error",
                  payload: "No se pudo actualizar el producto"
            });

            res.send({
                  status: "success",
                  payload: `Producto con id: ${id}, actualizado correctamente en la base de datos`
            });

      } catch (error) {

            console.log("Error en updateById: ", error);

      };

});

productsRouter.delete('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            let productToDelete = await productsManager.getById(id);

            if (!productToDelete) return res.status(404).send({
                  status: "error",
                  payload: "Producto no encontrado"
            });

            let result = await productsManager.deleteById(id);

            await productsFsManager.getAll();

            if (!result) return res.status(400).send({
                  status: "error",
                  payload: "No se pudo eliminar el producto"
            });

            res.send({
                  status: "success",
                  payload: `Producto con id: ${id}, eliminado correctamente de la base de datos`
            });

      } catch (error) {

            console.log("Error en deleteById: ", error);

      };

});

export default productsRouter;