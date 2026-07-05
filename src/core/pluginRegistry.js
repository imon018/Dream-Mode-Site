const registry = {};

export function register(name, plugin) {
  registry[name] = plugin;
}

export function getPlugin(name) {
  return registry[name];
}

export function getAllPlugins() {
  return registry;
}
