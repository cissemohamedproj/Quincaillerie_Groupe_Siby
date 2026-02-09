function calculerCarreaux(quantityM2, produit) {
  const { surfaceParPiece, piecesParCarton, surfaceParCarton } = produit;

  // 1️⃣ Cartons complets
  const cartons = Math.floor(quantityM2 / surfaceParCarton);

  // 2️⃣ Surface restante
  const resteM2 = quantityM2 - cartons * surfaceParCarton;

  // 3️⃣ Pièces supplémentaires
  const piecesSupplementaires = Math.ceil(resteM2 / surfaceParPiece);

  // 4️⃣ Total pièces
  const pieces = cartons * piecesParCarton + piecesSupplementaires;

  return {
    cartons,
    pieces,
    piecesSupplementaires,
  };
}

module.exports = calculerCarreaux;
