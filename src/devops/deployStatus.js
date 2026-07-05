export function getDeployStatus() {
  return {
    deployed: true,
    platform: "Vercel",
    checkedAt: new Date().toISOString(),
  };
}
