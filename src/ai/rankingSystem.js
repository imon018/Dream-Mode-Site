export function rankProduct(product) {
  let score = 0;

  if (product.price < 3000) score += 10;
  if (product.name.length > 5) score += 5;

  return score;
}
