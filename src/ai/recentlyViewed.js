export function addViewed(product) {
  const items = JSON.parse(localStorage.getItem("viewed")) || [];

  items.unshift(product);

  localStorage.setItem("viewed", JSON.stringify(items.slice(0, 10)));
}

export function getViewed() {
  return JSON.parse(localStorage.getItem("viewed")) || [];
}
