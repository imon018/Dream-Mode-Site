export function isSessionValid() {
  const token = localStorage.getItem("dm_token");

  if (!token) return false;

  return token.length > 10;
}
