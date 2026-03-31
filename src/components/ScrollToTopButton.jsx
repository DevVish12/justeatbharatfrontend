import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show on all screens, but position differently for mobile
  if (!show) return null;

  // Determine if mobile/small screen
  const isMobile = window.innerWidth < 1024;

  // Position higher on mobile to avoid CartBar overlap
  const buttonStyle = {
    position: "fixed",
    bottom: isMobile ? "82px" : "8px", // 72px to clear CartBar
    right: "8px",
    zIndex: 50,
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={buttonStyle}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 15 12 9 18 15" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
