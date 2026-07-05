import products from "../data/products";

export function smartSearch(query) {
  return products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
}
