import products from "../data/products";

export function getRecommendations(userCart = []) {
  if (!userCart.length) {
    return products.slice(0, 4);
  }

  const categories = userCart.map(p => p.category);

  return products
    .filter(p => categories.includes(p.category))
    .slice(0, 6);
}
