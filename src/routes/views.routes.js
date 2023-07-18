import {
      Router
} from 'express';

import Products from "../dao/dbManagers/products.js";
import ProductsFs from "../dao/fileManagers/products.js";

const productsManager = new Products();
const productsFsManager = new ProductsFs();

const router = Router();

router.get('/', async (req, res) => {

      try {

            res.render('index');

      } catch {

            console.log("Error en endpoint /: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

router.get('/home', async (req, res) => {

      try {

            let products = await productsManager.getAll();

            if (!products) return res.status(404).send({
                  status: "error",
                  payload: "No hay productos en la base de datos"
            });

            res.render('home', {
                  products
            });

      } catch (error) {

            console.log("Error en getAll de products: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

router.get('/realtimeproducts', async (req, res) => {

      try {

            let products = await productsFsManager.getAll();

            if (!products) return res.status(404).send({
                  status: "error",
                  payload: "No hay productos en la base de datos"
            });

            res.render('realtimeproducts', {
                  products
            });

      } catch (error) {

            console.log("Error en getAll de products: ", error);

            res.send({
                  status: "error",
                  payload: error
            });

      };

});

export default router;