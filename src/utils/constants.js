export const CURRENCY = "৳";

export const MAX_UPLOAD_SIZE = 5;

// Used as the starting delivery charge in Checkout, AddOrder, and
// PublicLandingPage — kept in one place so it only needs to change
// here instead of in three separate files.
export const DEFAULT_DELIVERY_CHARGE = 80;

// Fallback product image — via.placeholder.com is dead (403), so this
// is a self-contained inline SVG that never depends on the network.
export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">' +
      '<rect width="70" height="70" fill="#f3f4f6"/>' +
      '<path d="M20 46 L30 34 L38 42 L46 30 L54 46 Z" fill="#d1d5db"/>' +
      '<circle cx="26" cy="26" r="5" fill="#d1d5db"/>' +
      "</svg>"
  );
