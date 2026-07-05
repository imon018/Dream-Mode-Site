export function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}
