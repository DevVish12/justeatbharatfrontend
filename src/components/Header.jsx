import logo from "@/assets/logo.png";
import OtpLoginModal from "@/components/OtpLoginModal";
import Sidebar from "@/components/Sidebar";
import { useUserAuth } from "@/context/UserAuthContext";
import { Menu, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useUserAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loginIntent = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const login = params.get("login");
    const redirect = params.get("redirect");
    const shouldOpen =
      login === "1" || String(login || "").toLowerCase() === "true";

    const safeRedirect =
      typeof redirect === "string" && redirect.startsWith("/")
        ? redirect
        : null;

    return { shouldOpen, redirectTo: safeRedirect };
  }, [location.search]);

  const userDisplayName =
    user?.name || user?.fullName || user?.displayName || "My Account";

  const closeProfileSidebar = () => setIsProfileSidebarOpen(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  const clearLoginQuery = () => {
    const params = new URLSearchParams(location.search);
    if (!params.has("login") && !params.has("redirect")) return;
    params.delete("login");
    params.delete("redirect");
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (!loginIntent.shouldOpen) return;
    if (user) return;

    // Avoid overlapping panels.
    closeProfileSidebar();
    closeMobileNav();
    setIsLoginModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginIntent.shouldOpen, user]);

  const handleMenuClick = () => {
    // If a page manages its own sidebar, delegate to it.
    if (typeof onMenuClick === "function") {
      onMenuClick();
    } else {
      setIsMobileNavOpen(true);
    }

    // Avoid overlapping panels.
    closeProfileSidebar();
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      closeProfileSidebar();
    }
  };

  const handleLoginClick = () => {
    closeMobileNav();
    if (user) {
      setIsProfileSidebarOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Job & Career", path: "/jobs-career" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: "#F97415",
          fontFamily: '"Open Sans", Arial, sans-serif',
        }}
      >
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-2 md:px-6 py-[11px] text-white text-[13px] font-normal">
          {/* Left */}
          <div className="flex items-center">
            {/* Mobile menu icon with symmetric margin */}
            <button
              type="button"
              onClick={handleMenuClick}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-[6px] text-white ml-1"
              style={{ marginLeft: "4px" }}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo + Brand */}
            <div className="hidden md:flex items-center" style={{ gap: "0px" }}>
              <img
                src={logo}
                alt="Just Eat Bharat"
                className="w-[58px] h-[58px] object-contain rounded-full -my-1"
              />

              <svg width="150" height="46" viewBox="0 0 220 60">
                <text
                  x="0"
                  y="36"
                  style={{
                    fontFamily: '"Baloo 2", cursive',
                    fontSize: "22px",
                    fill: "white",
                    fontWeight: "500",
                  }}
                >
                  Just Eat Bharat
                </text>
              </svg>
            </div>
          </div>

          {/* Navigation */}

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-white font-medium hover:underline underline-offset-4 transition duration-200"
                style={{ textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Mobile Brand */}
          <div
            className="md:hidden flex items-center justify-center w-full"
            style={{ gap: "0px" }}
          >
            <img
              src={logo}
              alt="Just Eat Bharat"
              className="w-[60px] h-[60px] rounded-full"
            />
            <span
              className="text-[17px] font-medium"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Just Eat Bharat
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center pr-1 md:pr-2">
            {/* Mobile user icon with symmetric margin */}
            <button
              type="button"
              onClick={handleLoginClick}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-[6px] text-white mr-1"
              style={{ marginRight: "4px" }}
            >
              <User size={24} />
            </button>
            {/* Desktop login button */}
            <button
              type="button"
              onClick={handleLoginClick}
              className="hidden md:flex items-center gap-2 hover:opacity-80 transition"
            >
              <User size={18} />
              <span className="hidden md:inline">
                {user ? "Profile" : "Login"}
              </span>
            </button>
          </div>
        </div>

        <OtpLoginModal
          open={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
            clearLoginQuery();
          }}
          onLoginSuccess={() => {
            setIsLoginModalOpen(false);
            const next = loginIntent.redirectTo;
            clearLoginQuery();
            if (next) {
              navigate(next, { replace: true });
            }
          }}
        />
      </header>

      {/* Fallback mobile nav sidebar for pages that don't pass onMenuClick */}
      <Sidebar isOpen={isMobileNavOpen} onClose={closeMobileNav} />

      {isProfileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeProfileSidebar}
          aria-label="Close profile sidebar"
        />
      ) : null}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[320px] max-w-[90vw] border-l border-border bg-card p-5 shadow-2xl transition-transform duration-200 ${
          isProfileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isProfileSidebarOpen}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-semibold text-foreground">
            My Profile
          </h3>
          <button
            type="button"
            onClick={closeProfileSidebar}
            className="rounded-md border border-border px-2 py-1 text-xs text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <p className="text-lg font-semibold text-foreground">
            {userDisplayName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.phone || "No phone"}
          </p>
        </div>

        <nav className="mt-4 space-y-2">
          <Link
            to="/user-dashboard?tab=personal"
            onClick={closeProfileSidebar}
            className="block rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Personal Information
          </Link>
          <Link
            to="/user-dashboard?tab=orders"
            onClick={closeProfileSidebar}
            className="block rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            My Orders
          </Link>
          <Link
            to="/user-dashboard?tab=reservations"
            onClick={closeProfileSidebar}
            className="block rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            My Reservations
          </Link>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default Header;
