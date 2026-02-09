const mongoose = require('mongoose');
const Approvisonement = require('../models/ApprovisonementModel');
const Produit = require('../models/ProduitModel');

// Create a new approvisonement
exports.createApprovisonement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { produit, quantity, price, ...restOfData } = req.body;
    const formatQuantity = Number(quantity);
    const formatPrice = Number(price);

    // 1. Mise à jour du stock produit
    const prod = await Produit.findById(produit).session(session);

    if (!prod) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Produit introuvable en base' });
    }

    await Produit.findByIdAndUpdate(
      prod._id,
      {
        $inc: { stock: formatQuantity },
        achatPrice: formatPrice,
        lastPrice: prod.achatPrice,
      },
      { new: true, session }
    );

    // 2. Création de l’approvisionnement
    const approvisonement = await Approvisonement.create(
      [
        {
          produit,
          quantity: formatQuantity,
          price: formatPrice,
          user: req.user.id,
          ...restOfData,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(approvisonement[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get all approvisonements
exports.getAllApprovisonements = async (req, res) => {
  try {
    const approvisonements = await Approvisonement.find()
      // Trie par date de création, du plus récent au plus ancien
      .sort({ createdAt: -1 })
      .populate('produit')
      .populate('user')
      .populate('fournisseur');
    return res.status(200).json(approvisonements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPagignationApprovisonements = async (req, res) => {
  try {
    // 1️⃣ Récupération des paramètres
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 35;
    const skip = (page - 1) * limit;

    const approvisonements = await Approvisonement.find()
      .skip(skip)
      .limit(limit)
      .populate('produit')
      .populate('user')
      .populate('fournisseur')
      .sort({ createdAt: -1 });

    const totalPages = await Approvisonement.countDocuments();

    return res.status(200).json({
      results: {
        data: approvisonements,
        limit,
        page,
        total: totalPages,
        totalPages: Math.ceil(totalPages / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single approvisonement by ID
exports.getApprovisonementById = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findById(req.params.id)
      .populate('Produit')
      .populate('user')
      .populate('fournisseur');

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res.status(200).json(approvisonement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an approvisonement by ID
exports.cancelApprovisonement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const approvisonement = await Approvisonement.findByIdAndDelete(
      req.params.id,
      { session }
    );

    if (!approvisonement) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    // 1. Mise à jour du stock produit
    const prod = await Produit.findById(approvisonement.produit).session(
      session
    );

    if (!prod) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Produit introuvable en base' });
    }

    // On décrémente le stock du PRODUIT associé
    await Produit.findByIdAndUpdate(
      prod._id,
      {
        $inc: { stock: -approvisonement.quantity },
        achatPrice: prod.lastPrice,
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: 'Approvisonement deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une APPROVISONNEMENT
exports.deleteApprovisonement = async (req, res) => {
  try {
    const approvisonement = await Approvisonement.findByIdAndDelete(
      req.params.id
    );

    if (!approvisonement) {
      return res.status(404).json({ message: 'Approvisonement not found' });
    }

    return res
      .status(200)
      .json({ message: 'Approvisonement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
