export function validateAddress(address) {
  return (
    address &&
    address.name &&
    address.phone &&
    address.city &&
    address.area &&
    address.address
  );
}
