const mongoose = require('mongoose');

const bonSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Autre',
        'Carreaux',
        'Décoration',
        'Mecanique',
        'Plomberie',
        'Electricité',
        'Construction',
      ],
    },
    fournisseur: {
      type: String,
      required: true,
      trim: true,
    },
    adresse: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: Number,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    qtyType: {
      type: String,
      enum: [
        'm²',
        'Tonne',
        'm',
        'Rouleau',
        'Boite',
        'Seau',
        'Sac',
        'Pièces',
        'Barre',
      ],
      required: true,
    },
    cartons: {
      type: Number,
      default: 0,
    },
    piecesSup: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      trim: true,
    },
    bonDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true }
);

const Bon = mongoose.model('Bon', bonSchema);
module.exports = Bon;
