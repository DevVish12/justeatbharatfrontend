import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "../../hooks/use-toast";
import { isAdminLoggedIn, logoutAdmin } from "../../services/adminService";
import {
  deleteAdminJobApplication,
  fetchAdminJobApplications,
} from "../../services/jobService";
import AdminSidebar from "../AdminSidebar";
import { getAdminUrl } from "../adminPaths";

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
    return date.toLocaleString();
  }
};

const ManageJobInfo = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeApplication, setActiveApplication] = useState(null);
  const [page, setPage] = useState(1);

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
        const response = await fetchAdminJobApplications();
        if (!ignore) {
          setApplications(
            Array.isArray(response?.applications) ? response.applications : [],
          );
        }
      } catch (error) {
        if (!ignore) {
          if (isAuthError(error)) {
            await handleAuthExpired();
            return;
          }
          toast({
            variant: "destructive",
            title: "Failed to load job applications",
            description: error.message,
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
    return [...applications].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [applications]);

  const pageSize = 8;
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = useMemo(() => {
    return sorted.slice(startIndex, endIndex);
  }, [sorted, startIndex, endIndex]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteAdminJobApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      toast({ title: "Job application deleted" });
    } catch (error) {
      if (isAuthError(error)) {
        await handleAuthExpired();
        return;
      }
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="jobInfo" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Job Applications</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  View submissions from the Jobs & Career form.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Showing {totalItems} application{totalItems === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left bg-muted/30">
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden sm:table-cell">
                        #
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Email
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Phone
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Position
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">
                        Resume
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Submitted
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((app, index) => (
                      <tr
                        key={app.id}
                        className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {app.name || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {app.email || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {app.phone || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {app.position || "—"}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline underline-offset-2"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDateTime(app.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => setActiveApplication(app)}
                            >
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => handleDelete(app.id)}
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
                          colSpan={8}
                        >
                          No applications yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {isLoading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading...</p>
              ) : null}

              {!isLoading && totalItems > 0 ? (
                <div className="flex flex-col gap-3 p-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {startIndex + 1}-{endIndex} of {totalItems}.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-muted-foreground mr-1">
                      Page {safePage} / {totalPages}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        safePage <= 1 ||
                        totalItems === 0
                      }
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        safePage >= totalPages ||
                        totalItems === 0
                      }
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(activeApplication)}
        onOpenChange={(open) => !open && setActiveApplication(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Application</DialogTitle>
            <DialogDescription>Full applicant details.</DialogDescription>
          </DialogHeader>

          {activeApplication ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="mt-1 font-medium">
                    {activeApplication.name || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="mt-1 font-medium">
                    {activeApplication.position || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-1 font-medium">
                    {activeApplication.email || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-1 font-medium">
                    {activeApplication.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="mt-1 font-medium">
                    {formatDateTime(activeApplication.createdAt)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Resume</p>
                  <div className="mt-1">
                    {activeApplication.resumeUrl ? (
                      <a
                        href={activeApplication.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobInfo;
