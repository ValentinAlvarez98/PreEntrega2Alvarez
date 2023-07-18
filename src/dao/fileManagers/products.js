import fs from 'fs';

import path from 'path';

import {
      io
} from '../../app.js';

import Products from '../dbManagers/products.js';

const productsManager = new Products();

export default class ProductFsManager {

      constructor() {

            this.path = './data/products.json';
            this.products = [];
            this.loadProducts();

            const directory = path.dirname(this.path);
            const filename = path.basename(this.path);

            fs.watch(directory, (eventType, changedFilename) => {

                  if (eventType === 'change' && changedFilename === filename) {

                        this.loadProducts().then(() => {

                              io.emit('loadProducts', this.products);

                        });

                  };

            });

      };

      loadProducts = async () => {

            try {

                  if (!fs.existsSync(this.path)) {

                        console.log("No existe el archivo de productos");
                        this.products = [];

                  };

                  const jsonData = await fs.promises.readFile(this.path, 'utf-8');

                  this.products = JSON.parse(jsonData);

                  return this.products;

            } catch (error) {

                  console.log("Error en loadProducts: ", error);

            };

      };

      createFile = async () => {

            try {

                  let products = await productsManager.getAll();

                  if (!products) {

                        console.log("No hay productos en la base de datos");

                  };

                  const jsonData = JSON.stringify(products);

                  await fs.promises.writeFile(this.path, jsonData);


            } catch (error) {

                  console.log("Error en createFile: ", error);

            };

      };

      getAll = async () => {

            try {

                  await this.createFile();

                  io.emit('loadProducts', this.products);

                  await this.loadProducts();

                  return this.products;

            } catch (error) {

                  console.log("Error en getAll de productsFs: ", error);

            };

      };

};