import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useGlobalLoader } from "@/context/GlobalLoaderContext";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { apiRequest } from "@/services/api";
import { fetchAdminContacts } from "@/services/contactService";
import { fetchHeroBanners } from "@/services/heroService";
import { fetchAdminJobApplications } from "@/services/jobService";
import { getProcessedMenu } from "@/services/menuService";
import { listOrders } from "@/services/orderService";
import { updateStoreStatus } from "@/services/storeService";
import {
  BriefcaseBusiness,
  Image,
  Images,
  Mail,
  ShoppingBag,
  Table2,
  TicketPercent,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminProfile,
  isAdminLoggedIn,
  logoutAdmin,
  syncPetpoojaMenu,
} from "../services/adminService";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const StatTile = ({ title, description, to, icon: Icon, value, meta }) => {
  return (
    <Link
      to={to}
      className={
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors hover:bg-accent"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground/80">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-3xl font-semibold tracking-tight">
            {value ?? "—"}
          </p>
          {meta ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {meta}
            </p>
          ) : null}
        </div>

        <span className="text-sm font-medium text-primary opacity-90 group-hover:underline">
          Open
        </span>
      </div>
    </Link>
  );
};

const safeLen = (arr) => (Array.isArray(arr) ? arr.length : 0);

const Dashboard = () => {
  const navigate = useNavigate();
  // Instant redirect if not logged in (token expired or missing)
  if (!isAdminLoggedIn()) {
    navigate(getAdminUrl("login"), { replace: true });
    return null;
  }
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showLoader, hideLoader } = useGlobalLoader();
  const { storeOpen, setStoreOpen } = useStoreStatus();
  const [syncingMenu, setSyncingMenu] = useState(false);
  const [togglingStore, setTogglingStore] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState({
    contacts: null,
    jobApplications: null,
    orders: null,
    tables: null,
    tablesFree: null,
    tablesBooked: null,
    tablesOccupied: null,
    coupons: null,
    heroBanners: null,
    heroBannersActive: null,
    menuItems: null,
    menuItemsMissingImage: null,
  });

  useEffect(() => {
    const loadAdmin = async () => {
      if (!isAdminLoggedIn()) {
        navigate(getAdminUrl("login"), { replace: true });
        return;
      }

      showLoader("Loading admin dashboard…");
      try {
        const [profileRes] = await Promise.all([getAdminProfile()]);
        setAdmin(profileRes.admin);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    loadAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (!isAdminLoggedIn()) return;

    let ignore = false;

    const loadStats = async () => {
      try {
        setStatsLoading(true);

        const results = await Promise.allSettled([
          fetchAdminContacts(),
          fetchAdminJobApplications(),
          listOrders(),
          apiRequest("/tables", { method: "GET" }),
          apiRequest("/coupons", { method: "GET" }),
          fetchHeroBanners(),
          getProcessedMenu(),
        ]);

        if (ignore) return;

        const [
          contactsRes,
          jobsRes,
          ordersRes,
          tablesRes,
          couponsRes,
          heroRes,
          menuRes,
        ] = results;

        const contacts =
          contactsRes.status === "fulfilled"
            ? safeLen(contactsRes.value?.contacts)
            : null;
        const jobApplications =
          jobsRes.status === "fulfilled"
            ? safeLen(jobsRes.value?.applications)
            : null;
        const orders =
          ordersRes.status === "fulfilled"
            ? safeLen(ordersRes.value?.orders)
            : null;

        const tablesList =
          tablesRes.status === "fulfilled" ? tablesRes.value?.tables : null;
        const tables = tablesList ? safeLen(tablesList) : null;
        const tablesFree = tablesList
          ? tablesList.filter((t) => (t?.status || "free") === "free").length
          : null;
        const tablesBooked = tablesList
          ? tablesList.filter((t) => t?.status === "booked").length
          : null;
        const tablesOccupied = tablesList
          ? tablesList.filter((t) => t?.status === "occupied").length
          : null;

        const coupons =
          couponsRes.status === "fulfilled"
            ? safeLen(couponsRes.value?.coupons)
            : null;

        const banners =
          heroRes.status === "fulfilled" ? heroRes.value?.banners : null;
        const heroBanners = banners ? safeLen(banners) : null;
        const heroBannersActive = banners
          ? banners.filter((b) => Boolean(b?.status)).length
          : null;

        const items =
          menuRes.status === "fulfilled" ? menuRes.value?.items : null;
        const menuItems = items ? safeLen(items) : null;
        const menuItemsMissingImage = items
          ? items.filter((it) => {
              const image = String(it?.image || "").trim();
              return !image || image.includes("food-placeholder");
            }).length
          : null;

        setStats({
          contacts,
          jobApplications,
          orders,
          tables,
          tablesFree,
          tablesBooked,
          tablesOccupied,
          coupons,
          heroBanners,
          heroBannersActive,
          menuItems,
          menuItemsMissingImage,
        });
      } catch {
        // Keep dashboard functional even if some stats fail.
      } finally {
        if (!ignore) setStatsLoading(false);
      }
    };

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleSyncMenu = async () => {
    try {
      setSyncingMenu(true);
      await syncPetpoojaMenu();
      toast.success("Petpooja menu synced successfully");
    } catch (syncError) {
      toast.error(syncError.message || "Petpooja menu sync failed");
    } finally {
      setSyncingMenu(false);
    }
  };

  const handleToggleStore = async () => {
    try {
      setTogglingStore(true);
      const next = !storeOpen;
      const res = await updateStoreStatus({ store_open: next });
      const updated = Boolean(res?.store_open);
      setStoreOpen(updated);
      toast.success(updated ? "Store opened" : "Store closed");
    } catch (toggleError) {
      toast.error(toggleError?.message || "Failed to update store status");
    } finally {
      setTogglingStore(false);
    }
  };

  const featureTiles = useMemo(
    () => [
      {
        key: "contacts",
        title: "Contacts",
        description: "Messages from Contact Us.",
        to: getAdminUrl("contacts"),
        icon: Mail,
        value: stats.contacts,
      },
      {
        key: "jobInfo",
        title: "Job Applications",
        description: "Career applications inbox.",
        to: getAdminUrl("jobInfo"),
        icon: BriefcaseBusiness,
        value: stats.jobApplications,
      },
      {
        key: "orders",
        title: "Orders",
        description: "Placed orders and statuses.",
        to: getAdminUrl("orders"),
        icon: ShoppingBag,
        value: stats.orders,
      },
      {
        key: "tables",
        title: "Tables",
        description: "Manage table availability.",
        to: getAdminUrl("tables"),
        icon: Table2,
        value: stats.tables,
        meta:
          stats.tablesFree === null && stats.tablesBooked === null
            ? null
            : `Free ${stats.tablesFree ?? "—"} · Booked ${
                stats.tablesBooked ?? "—"
              } · Occupied ${stats.tablesOccupied ?? "—"}`,
      },
      {
        key: "coupons",
        title: "Coupons",
        description: "Promo codes and discounts.",
        to: getAdminUrl("coupons"),
        icon: TicketPercent,
        value: stats.coupons,
      },
      {
        key: "heroManage",
        title: "Hero Banners",
        description: "Homepage hero sliders.",
        to: getAdminUrl("heroManage"),
        icon: Images,
        value: stats.heroBanners,
        meta:
          stats.heroBannersActive === null
            ? null
            : `Active ${stats.heroBannersActive}`,
      },
      {
        key: "dishImages",
        title: "Dish Images",
        description: "Upload/replace menu item images.",
        to: getAdminUrl("dishImages"),
        icon: Image,
        value: stats.menuItems,
        meta:
          stats.menuItemsMissingImage === null
            ? null
            : `Missing images ${stats.menuItemsMissingImage}`,
      },
    ],
    [stats],
  );

  // Loader is now global, no need for local loading text
  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-lg border border-border bg-card p-6 max-w-md w-full">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={handleLogout}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar
          activeItem="dashboard"
          onLogout={handleLogout}
          admin={admin}
        />

        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={logo}
                      alt="Just Eat Bharat Logo"
                      className="h-12 w-12 rounded-xl border border-border bg-background object-contain"
                    />
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Just Eat Bharat
                      </h1>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {admin?.createdAt
                        ? new Date(admin.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-medium">Stats:</span>{" "}
                      {statsLoading ? "Loading…" : "Updated"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={
                        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold"
                      }
                    >
                      Status:
                      <span
                        className={
                          storeOpen
                            ? "ml-1 text-green-700"
                            : "ml-1 text-red-600"
                        }
                      >
                        {storeOpen ? "OPEN" : "CLOSED"}
                      </span>
                    </span>

                    <Button
                      type="button"
                      variant={storeOpen ? "destructive" : "default"}
                      onClick={handleToggleStore}
                      disabled={togglingStore}
                    >
                      {togglingStore
                        ? "Updating…"
                        : storeOpen
                          ? "Close Store"
                          : "Open Store"}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSyncMenu}
                    disabled={syncingMenu}
                  >
                    {syncingMenu ? "Syncing…" : "Sync Petpooja Menu"}
                  </Button>
                  <p className="text-xs text-muted-foreground sm:max-w-[240px] sm:text-right">
                    Triggers an instant Petpooja → MySQL sync.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">Overview</h2>
                <p className="text-sm text-muted-foreground">
                  Quick access to all admin features.
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featureTiles.map((tile) => (
                  <StatTile key={tile.key} {...tile} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold">Admin Access</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a new admin account for staff.
                  </p>
                </div>

                <Link to={getAdminUrl("register")} className="inline-flex">
                  <Button type="button" variant="secondary">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register New Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
