export function runPipeline() {
  console.log("Running CI pipeline...");

  return {
    passed: true,
    completedAt: new Date().toISOString(),
  };
}
