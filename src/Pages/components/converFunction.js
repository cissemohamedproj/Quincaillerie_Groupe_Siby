export const calculerCarreaux = (quantityM2, produit) => {
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
};

export const calculerConversionM2 = (
  quantityM2,
  surfaceParPiece,
  piecesParCarton
) => {
  const surfaceParCarton = surfaceParPiece * piecesParCarton;

  const cartons = Math.floor(quantityM2 / surfaceParCarton);

  const resteM2 = quantityM2 - cartons * surfaceParCarton;

  const piecesSupplementaires =
    resteM2 > 0 ? Math.ceil(resteM2 / surfaceParPiece) : 0;

  return {
    cartons,
    piecesSupplementaires,
  };
};
