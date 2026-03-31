import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  Image,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  Table2,
  TicketPercent,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAdminUrl } from "./adminPaths";

const menuItems = [
  {
    label: "Dashboard",
    to: getAdminUrl("dashboard"),
    key: "dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Contacts",
    to: getAdminUrl("contacts"),
    key: "contacts",
    icon: Mail,
  },
  {
    label: "Job Info",
    to: getAdminUrl("jobInfo"),
    key: "jobInfo",
    icon: BriefcaseBusiness,
  },
  {
    label: "Orders",
    to: getAdminUrl("orders"),
    key: "orders",
    icon: ShoppingBag,
  },
  {
    label: "Tables",
    to: getAdminUrl("tables"),
    key: "tables",
    icon: Table2,
  },
  {
    label: "Coupons",
    to: getAdminUrl("coupons"),
    key: "coupons",
    icon: TicketPercent,
  },
  {
    label: "Hero Banners",
    to: getAdminUrl("heroManage"),
    key: "heroManage",
    icon: Images,
  },
  {
    label: "Dish Images",
    to: getAdminUrl("dishImages"),
    key: "dishImages",
    icon: Image,
  },
];

const resolveActiveKey = ({ explicitKey, pathname }) => {
  if (explicitKey) return explicitKey;
  const match = menuItems.find((it) => it.to && pathname?.startsWith(it.to));
  return match?.key;
};

const AdminNavItem = ({ item, isActive, collapsed, onNavigate, className }) => {
  const Icon = item.icon;

  const content = (
    <>
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border",
          isActive
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-sidebar-border bg-sidebar-accent text-sidebar-foreground/70",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          collapsed && "hidden",
        )}
      >
        {item.label}
      </span>
    </>
  );

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl border px-2 py-2",
        "border-sidebar-border bg-sidebar text-sidebar-foreground",
        "hover:border-primary/20 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "border-primary/25 bg-sidebar-accent text-sidebar-accent-foreground",
        isActive &&
          "before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary",
        collapsed && "justify-center px-2",
        className,
      )}
    >
      {content}
    </Link>
  );
};

const AdminSidebar = ({ activeItem, onLogout, admin }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const adminEmail = String(admin?.email || "").trim();

  const resolvedActiveKey = useMemo(() => {
    return resolveActiveKey({
      explicitKey: activeItem,
      pathname: location?.pathname,
    });
  }, [activeItem, location?.pathname]);

  const activeLabel = useMemo(() => {
    return menuItems.find((it) => it.key === resolvedActiveKey)?.label;
  }, [resolvedActiveKey]);

  const wrapperClassName = cn(
    "w-full md:flex-shrink-0 md:h-screen",
    collapsed ? "md:w-[84px]" : "md:w-72",
  );

  return (
    <div className={wrapperClassName}>
      {/* Mobile: compact top bar (toggle opens drawer) */}
      <div className="md:hidden rounded-xl border border-sidebar-border bg-sidebar p-2.5 text-sidebar-foreground">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
              <LayoutDashboard className="h-5 w-5 opacity-80" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Admin Panel
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {activeLabel || "Menu"}
              </p>
              {adminEmail ? (
                <p className="truncate text-[11px] text-muted-foreground">
                  {adminEmail}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop: collapsible fixed sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:fixed md:left-0 md:top-0 md:z-40 md:h-screen",
          collapsed ? "md:w-[84px]" : "md:w-72",
          "rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground",
          "md:rounded-none md:border-y-0 md:border-l-0 md:border-r",
          collapsed ? "p-2" : "p-3.5",
        )}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className={cn(
              "flex items-center justify-between",
              collapsed ? "px-1" : "px-1.5",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                collapsed && "justify-center",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border",
                  "border-sidebar-border bg-sidebar-accent text-sidebar-foreground",
                  collapsed && "hidden",
                )}
              >
                <LayoutDashboard className="h-5 w-5 opacity-80" />
              </span>
              <div className={cn("leading-tight", collapsed && "hidden")}>
                <p className="text-sm font-semibold tracking-tight">
                  Admin Panel
                </p>
                <p className="text-xs text-muted-foreground">Taste Trekker</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-xl border",
                "border-sidebar-border bg-sidebar text-sidebar-foreground",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>

          {adminEmail ? (
            <div
              className={cn(
                "mt-3 rounded-xl border border-sidebar-border bg-sidebar-accent",
                collapsed ? "p-2" : "p-3",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  collapsed && "justify-center",
                )}
              >
                <span className="h-2 w-2 rounded-full bg-primary" />
                <p
                  className={cn(
                    "text-xs font-medium text-sidebar-foreground/80",
                    collapsed && "hidden",
                  )}
                >
                  Online
                </p>
              </div>
              <p
                className={cn(
                  "mt-1 truncate text-xs text-muted-foreground",
                  collapsed && "hidden",
                )}
                title={adminEmail}
              >
                {adminEmail}
              </p>
            </div>
          ) : null}

          <nav className={cn("mt-4 flex-1 space-y-2 overflow-y-auto pr-0.5")}>
            {menuItems.map((item) => (
              <AdminNavItem
                key={item.key}
                item={item}
                collapsed={collapsed}
                isActive={resolvedActiveKey === item.key}
              />
            ))}
          </nav>

          <div className={cn("mt-4", collapsed ? "pt-2" : "pt-3")}>
            <button
              type="button"
              onClick={onLogout}
              title={collapsed ? "Logout" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2",
                "border-sidebar-border bg-sidebar text-sidebar-foreground",
                "hover:bg-destructive hover:text-destructive-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg border",
                  "border-sidebar-border bg-sidebar-accent text-sidebar-foreground/70",
                )}
              >
                <LogOut className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm font-medium",
                  collapsed && "hidden",
                )}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50",
          mobileOpen ? "" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/40",
            mobileOpen ? "" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[18rem] max-w-[85vw]",
            "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
            mobileOpen ? "" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-sidebar-border bg-primary px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary-foreground">
                Admin Menu
              </p>
              <p className="truncate text-xs text-primary-foreground/80">
                {activeLabel || "Navigate"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-[calc(100%-56px)] flex-col p-3">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <AdminNavItem
                  key={item.key}
                  item={item}
                  collapsed={false}
                  isActive={resolvedActiveKey === item.key}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto pt-3">
              <button
                type="button"
                onClick={async () => {
                  setMobileOpen(false);
                  await onLogout?.();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2",
                  "border-sidebar-border bg-sidebar text-sidebar-foreground",
                  "hover:bg-destructive hover:text-destructive-foreground",
                )}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-foreground/70">
                  <LogOut className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
