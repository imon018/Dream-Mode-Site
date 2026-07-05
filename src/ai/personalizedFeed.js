import products from "../data/products";

export function getFeed() {
  return products.sort(() => Math.random() - 0.3);
}
