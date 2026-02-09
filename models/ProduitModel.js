const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Ex: Nom de produit
    category: {
      type: String,
      enum: [
        'Carreaux',
        'Electronique',
        'Promberie',
        'Construction',
        'Décoration',
        'Autre',
      ],
      // required: true,
    },

    // --- Spécifique aux carreaux ---
    surfaceParPiece: {
      type: Number, // ex: 0.36 pour un 60x60
    },

    piecesParCarton: {
      type: Number, // ex: 4
    },

    surfaceParCarton: {
      type: Number, // ex: 1.44
    },

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
