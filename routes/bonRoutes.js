const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

const bonController = require('../controller/BonController');

//  Créer une nouvelle Bon
router.post(
  '/createBon',
  userController.authMiddleware,
  bonController.createBon
);

//  Obtenir toutes les Bons
router.get('/getAllBon', bonController.getAllBon);

//  Obtenir une Bons
router.get('/getBon/:id', bonController.getBon);

router.put('/updateBon/:id', bonController.updateBon);

//  Supprimer une Bon
router.delete('/deleteBon/:id', bonController.deleteBon);

module.exports = router;
