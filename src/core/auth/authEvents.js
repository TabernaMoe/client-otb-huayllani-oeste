const listeners = {
  unauthorized: new Set(),
  sessionChanged: new Set(),
};

export const authEvents = {
  on(eventName, handler) {
    const bucket = listeners[eventName];
    if (!bucket) return () => {};
    bucket.add(handler);
    return () => bucket.delete(handler);
  },

  emit(eventName, payload) {
    const bucket = listeners[eventName];
    if (!bucket) return;
    for (const handler of bucket) {
      try {
        handler(payload);
      } catch {
        // Isolate subscriber errors from emitter flow
      }
    }
  },
};
