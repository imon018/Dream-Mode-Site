const attempts = {};

export function rateLimit(key, limit = 5, time = 60000) {
  const now = Date.now();

  if (!attempts[key]) {
    attempts[key] = [];
  }

  attempts[key] = attempts[key].filter(t => now - t < time);

  if (attempts[key].length >= limit) {
    return false;
  }

  attempts[key].push(now);
  return true;
}
