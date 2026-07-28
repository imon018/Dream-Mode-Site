// __APP_VERSION__ is injected by vite.config.js at build time from
// package.json's "version" field. Previously this was a hardcoded
// string ("1.0.0") that never got updated when package.json's version
// changed, so the app always thought it was out of date and re-downloaded
// + reinstalled the update package on every single launch and resume -
// that was the cause of the app hanging on open and occasionally
// showing a blank white screen.
export const APP_VERSION = __APP_VERSION__;
