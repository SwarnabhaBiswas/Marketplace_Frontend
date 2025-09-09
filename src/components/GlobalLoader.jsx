import React from "react";
import { subscribe, getState } from "../lib/loading";
import { PropagateLoader } from "react-spinners";

export default function GlobalLoader() {
  const [, setTick] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const showTimer = React.useRef(null);

  React.useEffect(() => {
    function onChange() {
      const { count, routeLoading } = getState();
      const shouldShow = count > 0 || routeLoading;
      clearTimeout(showTimer.current);
      if (shouldShow) {
        setVisible(true); // show immediately
      } else {
        // delay hiding slightly to prevent flicker
        showTimer.current = setTimeout(() => setVisible(false), 120);
      }
      setTick((v) => v + 1); // force re-render
    }
    const unsub = subscribe(onChange);
    return () => {
      unsub();
      clearTimeout(showTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="pointer-events-none fixed inset-0 z-[1000] grid place-items-center"
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Loader */}
      <PropagateLoader color="#57cdffff" margin={4} size={20} />
    </div>
  );
}
