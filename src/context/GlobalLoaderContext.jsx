import { createContext, useCallback, useContext, useState } from "react";

const GlobalLoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
  message: "Loading…",
});

export const GlobalLoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Loading…");

  const showLoader = useCallback((msg = "Loading…") => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage("Loading…");
  }, []);

  return (
    <GlobalLoaderContext.Provider
      value={{ showLoader, hideLoader, isLoading, message }}
    >
      {children}
      {/* ── message prop restored — same as old working code ── */}
      {isLoading && <GlobalLoader message={message} />}
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => useContext(GlobalLoaderContext);

// ── Visual: exact match to loader.html (dark overlay, small circular logo) ──
const LOGO_SIZE = 42; // px — circular logo
const RING_SIZE = 56; // px — 7px gap each side

const GlobalLoader = ({ message = "Loading…" }) => (
  <>
    <style>{`
      @keyframes gl-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes gl-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .gl-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(74, 74, 74, 0.96);
        display: flex; align-items: center; justify-content: center;
        animation: gl-fade-in 0.2s ease both;
      }
      .gl-ring-wrap {
        position: relative;
        width: ${RING_SIZE}px;
        height: ${RING_SIZE}px;
        display: flex; align-items: center; justify-content: center;
      }
      .gl-track {
        position: absolute; inset: 0;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.15);
      }
      .gl-spinner {
        position: absolute; inset: 0;
        border-radius: 50%;
        border: 2px solid transparent;
        border-top-color: rgba(255, 255, 255, 0.85);
        border-right-color: rgba(255, 255, 255, 0.35);
        animation: gl-spin 1s linear infinite;
      }
      .gl-logo {
        width: ${LOGO_SIZE}px;
        height: ${LOGO_SIZE}px;
        border-radius: 50%;
        object-fit: contain;
        display: block;
        background: #fff;
      }
    `}</style>

    <div className="gl-overlay">
      <div className="gl-ring-wrap">
        <div className="gl-track" />
        <div className="gl-spinner" />
        <img
          src="/logo.png"
          alt="Loading"
          className="gl-logo"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    </div>
  </>
);