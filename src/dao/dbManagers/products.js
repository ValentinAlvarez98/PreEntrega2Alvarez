import productsModel from "../models/products.js";

export default class ProductsManager {

      constructor() {

            console.log("Trabajando con base de datos MongoDB");

      };

      getAll = async () => {

            try {

                  let products = await productsModel.find().lean();

                  if (!products) {

                        console.log("No hay productos en la base de datos");

                  };

                  return products;

            } catch (error) {

                  console.log("Error en getAll de products: ", error);

            };

      };

      saveProduct = async product => {

            try {

                  let result = await productsModel.create(product);

                  if (result) {

                        console.log("Producto guardado en la base de datos");

                  };

                  return result;

            } catch (error) {

                  console.log("Error en saveProduct: ", error);

            };

      };

      getById = async id => {

            try {

                  let product = await productsModel.find({
                        id: id
                  }).lean();

                  if (!product) {

                        console.log("No existe un producto con el id ingresado");

                  };

                  return product;

            } catch (error) {

                  console.log("Error en getById: ", error);

            };

      };

      updateById = async (id, product) => {

            try {

                  let result = await productsModel.updateOne({
                        id: id
                  }, product);

                  if (result) {

                        console.log("Producto actualizado en la base de datos");

                  };

                  return result;

            } catch (error) {

                  console.log("Error en updateById: ", error);

            };

      };

      deleteById = async id => {

            try {

                  let result = await productsModel.deleteOne({
                        id: id
                  });

                  if (result) {

                        console.log("Producto eliminado de la base de datos");

                  };

                  return result;

            } catch (error) {

                  console.log("Error en deleteById: ", error);

            };

      };

};