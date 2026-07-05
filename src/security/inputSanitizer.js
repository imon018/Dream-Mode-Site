export function sanitizeInput(input) {
  if (!input) return "";

  return input
    .replace(/</g, "")
    .replace(/>/g, "")
    .trim();
}
