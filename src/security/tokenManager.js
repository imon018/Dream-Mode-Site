export function setToken(token) {
  localStorage.setItem("dm_token", token);
}

export function getToken() {
  return localStorage.getItem("dm_token");
}

export function removeToken() {
  localStorage.removeItem("dm_token");
}
