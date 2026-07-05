export function trackCartAdd(product) {
  const data = JSON.parse(localStorage.getItem("dm_cart_events")) || [];

  data.push({
    product,
    time: new Date().toISOString()
  });

  localStorage.setItem("dm_cart_events", JSON.stringify(data));
}
