import cartsModel from '../models/carts.js';

export default class CartsManager {

      constructor() {

            console.log("Trabajando con base de datos MongoDB");

      };

      getAll = async () => {

            try {

                  let carts = await cartsModel.find().lean();

                  if (!carts) {

                        console.log("No hay carritos en la base de datos");

                  };

                  return carts;

            } catch (error) {

                  console.log("Error en getAll de carts: ", error);

            };

      };

      saveCart = async (cart) => {

            try {

                  const existingCart = await cartsModel.findOne({
                        id: cart.id
                  });

                  if (existingCart) {

                        existingCart.products = cart.products;
                        return await existingCart.save();

                  } else {

                        return await cartsModel.create(cart);

                  };

            } catch (error) {

                  console.log("Error en saveCart: ", error);
                  return null;

            };

      };

      getById = async id => {

            try {

                  const cart = await cartsModel.findOne({
                        id
                  });

                  if (!cart) {
                        console.log("No existe un carrito con ese id");
                  }

                  return cart;

            } catch (error) {

                  console.log("Error en getById: ", error);

            };

      };

      addProduct = async (cart, productId) => {

            try {
                  const existingProduct = cart.products.find(product => parseInt(product.product) === parseInt(productId));

                  if (existingProduct) {

                        existingProduct.quantity += 1;

                        await cartsModel.updateOne({
                              id: cart.id,
                              "products.product": productId
                        }, {
                              $set: {
                                    "products.$.quantity": existingProduct.quantity
                              }
                        });


                  } else {

                        const newProduct = {
                              product: productId,
                              quantity: 1
                        };

                        cart.products.push(newProduct);

                  };

                  const result = await cart.save();

                  if (result) {

                        console.log("Producto agregado al carrito en la base de datos");

                  };

                  return result;

            } catch (error) {

                  console.log("Error en addProduct: ", error);

            };

      };

      deleteById = async id => {

            try {

                  let result = await cartsModel.deleteOne({
                        id: id
                  });

                  if (result) {

                        console.log("Carrito eliminado de la base de datos");

                  };

                  return result;


            } catch (error) {

                  console.log("Error en deleteById: ", error);

            };

      };

};