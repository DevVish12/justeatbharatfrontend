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
  deleteAdminContact,
  fetchAdminContacts,
} from "../../services/contactService";
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

const ManageContact = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
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
        const response = await fetchAdminContacts();
        if (!ignore) {
          setContacts(
            Array.isArray(response.contacts) ? response.contacts : [],
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
            title: "Failed to load contact messages",
            description: error.message,
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const sortedContacts = useMemo(() => {
    return [...contacts].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [contacts]);

  const pageSize = 8;
  const totalItems = sortedContacts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = useMemo(() => {
    return sortedContacts.slice(startIndex, endIndex);
  }, [sortedContacts, startIndex, endIndex]);

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
      await deleteAdminContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      toast({ title: "Contact message deleted" });
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
        <AdminSidebar activeItem="contacts" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Contact Messages</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  View messages submitted from the Contact Us form.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Showing {totalItems} message{totalItems === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[920px] text-sm">
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
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Subject
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">
                        Message
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
                    {pageItems.map((contact, index) => (
                      <tr
                        key={contact.id}
                        className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {contact.name || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {contact.email || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {contact.subject || "—"}
                        </td>
                        <td className="px-4 py-3 max-w-[360px] whitespace-pre-wrap break-words hidden md:table-cell">
                          {contact.message || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDateTime(contact.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => setActiveContact(contact)}
                            >
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => handleDelete(contact.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && sortedContacts.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-10 text-center text-muted-foreground"
                          colSpan={7}
                        >
                          No messages yet.
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
        open={Boolean(activeContact)}
        onOpenChange={(open) => !open && setActiveContact(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
            <DialogDescription>Full message details.</DialogDescription>
          </DialogHeader>

          {activeContact ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="mt-1 font-medium">
                    {activeContact.name || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-1 font-medium">
                    {activeContact.email || "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="mt-1 font-medium">
                  {activeContact.subject || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap break-words">
                  {activeContact.message || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="mt-1 font-medium">
                  {formatDateTime(activeContact.createdAt)}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageContact;
