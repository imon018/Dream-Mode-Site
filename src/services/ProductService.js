const API_URL = "/api/products";

// temporary mock (later Firestore connect হবে)
let products = [];

export const getProducts = () => {
  return products;
};

export const addProduct = (product) => {
  products.push({
    id: Date.now(),
    ...product
  });
};

export const deleteProduct = (id) => {
  products = products.filter((p) => p.id !== id);
};
