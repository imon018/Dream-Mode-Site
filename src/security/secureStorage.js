export function secureSet(key, value) {
  const encoded = btoa(JSON.stringify(value));
  localStorage.setItem(key, encoded);
}

export function secureGet(key) {
  const data = localStorage.getItem(key);
  if (!data) return null;

  return JSON.parse(atob(data));
}
