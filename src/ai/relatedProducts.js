import products from "../data/products";

export function getRelated(product) {
  return products
    .filter(p => p.id !== product.id)
    .slice(0, 4);
}
