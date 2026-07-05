export const globalState = {
  appName: "Dream Mode",
  version: "1.0.0",
  initialized: false,
};

export function setInitialized(value) {
  globalState.initialized = value;
}
