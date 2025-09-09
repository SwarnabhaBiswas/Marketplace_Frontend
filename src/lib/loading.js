// Simple global loading store (framework-agnostic)
// Tracks pending network requests and route/form operations

let count = 0;
let routeLoading = false;
const listeners = new Set();
let visibilityTimer = null; // debounce timer for spinner visibility

function notify() {
  listeners.forEach((cb) => {
    try { cb(getState()); } catch {}
  });
}

export function getState() {
  return { count, routeLoading };
}

export function subscribe(cb) {
  listeners.add(cb);
  cb(getState());
  return () => listeners.delete(cb);
}

export function beginNetwork() { count++; scheduleNotify(); }
export function endNetwork() { count = Math.max(0, count - 1); scheduleNotify(); }

export function beginRoute() { routeLoading = true; scheduleNotify(); }
export function endRoute() { routeLoading = false; scheduleNotify(); }

// Debounce visibility change to avoid flicker (<150-200ms)
function scheduleNotify() {
  if (visibilityTimer) return; // batch multiple changes
  visibilityTimer = setTimeout(() => {
    visibilityTimer = null;
    notify();
  }, 160);
}

