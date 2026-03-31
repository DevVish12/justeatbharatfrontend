import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import { isAdminLoggedIn, logoutAdmin } from "../services/adminService";
import { apiRequest } from "../services/api";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
};

const fetchTables = async () => apiRequest("/tables", { method: "GET" });
const createTable = async (table_number) =>
  apiRequest("/tables", {
    method: "POST",
    body: { table_number },
  });
const updateTable = async (id, body) =>
  apiRequest(`/tables/${id}`, {
    method: "PUT",
    body,
  });
const deleteTable = async (id) =>
  apiRequest(`/tables/${id}`, {
    method: "DELETE",
  });

const AdminTables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [activeTable, setActiveTable] = useState(null);

  const isAuthError = (error) => {
    const message = String(error?.message || "").toLowerCase();
    return (
      message.includes("token expired") ||
      message.includes("expired token") ||
      message.includes("invalid token") ||
      message.includes("unauthorized") ||
      message.includes("jwt")
    );
  };

  const handleAuthExpired = async () => {
    toast({
      variant: "destructive",
      title: "Session expired",
      description: "Please login again.",
    });
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate(getAdminUrl("login"), { replace: true });
      return;
    }

    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTables();
        if (!ignore) {
          setTables(Array.isArray(response?.tables) ? response.tables : []);
        }
      } catch (error) {
        if (!ignore) {
          if (isAuthError(error)) {
            await handleAuthExpired();
            return;
          }
          toast({
            variant: "destructive",
            title: "Failed to load tables",
            description: error?.message || "Request failed",
          });
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const sorted = useMemo(() => {
    return [...tables].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [tables]);

  const stats = useMemo(() => {
    const list = Array.isArray(sorted) ? sorted : [];
    const total = list.length;
    const free = list.filter(
      (t) => String(t?.status || "").toLowerCase() === "free",
    ).length;
    const occupied = list.filter(
      (t) => String(t?.status || "").toLowerCase() === "occupied",
    ).length;
    const booked = list.filter(
      (t) => String(t?.status || "").toLowerCase() === "booked",
    ).length;
    return { total, free, occupied, booked };
  }, [sorted]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleAdd = async () => {
    const table_number = String(newTableNumber || "").trim();
    if (!table_number) {
      toast({
        variant: "destructive",
        title: "Table number required",
        description: "Please enter a table number",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTable(table_number);
      const created = response?.table;
      if (created) {
        setTables((prev) => [created, ...prev]);
      }
      setNewTableNumber("");
      toast({ title: "Table added" });
    } catch (error) {
      if (isAuthError(error)) {
        await handleAuthExpired();
        return;
      }
      toast({
        variant: "destructive",
        title: "Add failed",
        description: error?.message || "Request failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setIsSubmitting(true);
    try {
      const response = await updateTable(id, { status });
      const updated = response?.table;
      if (updated) {
        setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
      toast({ title: "Status updated" });
    } catch (error) {
      if (isAuthError(error)) {
        await handleAuthExpired();
        return;
      }
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Request failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteTable(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Table deleted" });
    } catch (error) {
      if (isAuthError(error)) {
        await handleAuthExpired();
        return;
      }
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error?.message || "Request failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="tables" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Tables</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add, delete, and update table status.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Total: {stats.total} · Free: {stats.free} · Occupied:{" "}
                  {stats.occupied} · Booked: {stats.booked}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="Table number (e.g. 4)"
                    className="h-10 w-full sm:w-[240px] rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    disabled={isSubmitting || isLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={isSubmitting || isLoading}
                  >
                    Add Table
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Use “View” to see booking details.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left bg-muted/30">
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden sm:table-cell">
                        #
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Table
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">
                        Booked Until
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">
                        Booked By
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Created
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sorted.map((t, index) => (
                      <tr
                        key={t.id}
                        className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          {t.tableNumber || "—"}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={t.status || "free"}
                            onChange={(e) =>
                              handleStatusChange(t.id, e.target.value)
                            }
                            disabled={isSubmitting || isLoading}
                            className="h-9 rounded-md border border-border bg-card px-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            aria-label={`Status for table ${t.tableNumber || t.id}`}
                          >
                            <option value="free">free</option>
                            <option value="occupied">occupied</option>
                            <option value="booked">booked</option>
                          </select>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          {t.bookedUntil ? formatDateTime(t.bookedUntil) : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          {t.bookedByPhone || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {t.createdAt ? formatDateTime(t.createdAt) : "—"}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => setActiveTable(t)}
                            >
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && sorted.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-10 text-center text-muted-foreground"
                          colSpan={7}
                        >
                          No tables yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {isLoading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading...</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(activeTable)}
        onOpenChange={(open) => !open && setActiveTable(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Table Details</DialogTitle>
            <DialogDescription>Booking info and timestamps.</DialogDescription>
          </DialogHeader>

          {activeTable ? (
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Table</p>
                <p className="mt-1 font-semibold">
                  {activeTable.tableNumber || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="mt-1 font-medium">
                    {String(activeTable.status || "free")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Booked By</p>
                  <p className="mt-1 font-medium">
                    {activeTable.bookedByPhone || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Booked Until</p>
                  <p className="mt-1 font-medium">
                    {activeTable.bookedUntil
                      ? formatDateTime(activeTable.bookedUntil)
                      : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">
                    {activeTable.createdAt
                      ? formatDateTime(activeTable.createdAt)
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTables;
