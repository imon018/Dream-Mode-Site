import products from "../data/products";

export function getTrending() {
  return products
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
}
