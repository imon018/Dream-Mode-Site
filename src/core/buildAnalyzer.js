export function getBuildInfo() {
  return {
    mode: import.meta.env.MODE,
    production: import.meta.env.PROD,
    version: "1.0.0"
  };
}
