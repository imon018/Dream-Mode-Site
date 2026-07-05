export function suggestDiscount(price) {
  if (price > 5000) return 10;
  if (price > 2000) return 5;
  return 0;
}
