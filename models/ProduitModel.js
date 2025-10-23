const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Ex: Nom de produit

    price: {
      type: Number,
      required: true,
      trim: true,
    },
    achatPrice: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
    lastPrice: {
      type: Number,
      default: 0,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },

    imageUrl: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
