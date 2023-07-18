import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({

      products: {
            type: Array,
            required: true,
            default: []
      },

      id: {
            type: Number,
            required: true,
      },

});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;