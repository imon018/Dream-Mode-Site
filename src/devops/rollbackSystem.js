export function saveRollbackVersion(version) {
  localStorage.setItem("dm_last_version", version);
}

export function getRollbackVersion() {
  return localStorage.getItem("dm_last_version");
}
