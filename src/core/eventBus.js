const listeners = {};

export function on(event, callback) {
  listeners[event] ??= [];
  listeners[event].push(callback);
}

export function emit(event, payload) {
  (listeners[event] || []).forEach((cb) => cb(payload));
}
