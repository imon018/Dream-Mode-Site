export function formatPrice(price) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0
  }).format(price);
}

// Returns the offer price when a valid offer price exists (0 < offerPrice < price),
// otherwise falls back to the regular price. Use this everywhere a product's
// price is shown/calculated (Cart, Checkout, Wishlist, Orders, Returns, etc.)
// so offer pricing stays consistent across the whole app.
export function getEffectivePrice(item) {
  if (!item) return 0;

  const price = Number(item.price) || 0;
  const offerPrice = Number(item.offerPrice) || 0;

  return offerPrice > 0 && offerPrice < price ? offerPrice : price;
}
