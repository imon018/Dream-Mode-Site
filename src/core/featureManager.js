const features = {
  wishlist: true,
  analytics: true,
  ai: true,
  payment: false
};

export function hasFeature(name) {
  return !!features[name];
}
