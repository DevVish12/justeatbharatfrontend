import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/UserAuthContext";
import MyOrders from "@/User/MyOrders";
import MyReservations from "@/User/MyReservations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UserDashboard = () => {
  const [searchParams] = useSearchParams();
  const { user, updateProfile } = useUserAuth();
  const [nameDraft, setNameDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const userDisplayName =
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    user?.phone ||
    "My Account";

  const tab = searchParams.get("tab") || "personal";
  const sectionTitle =
    tab === "orders"
      ? "My Orders"
      : tab === "reservations"
        ? "My Reservations"
        : "Personal Information";

  useEffect(() => {
    if (tab !== "personal") {
      return;
    }

    setSaveError("");
    setNameDraft(user?.name || "");
  }, [tab, user?.name]);

  const handleSave = async () => {
    if (isSaving) return;
    setSaveError("");

    const nextName = String(nameDraft || "").trim();
    if (nextName.length < 2) {
      setSaveError("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name: nextName });
    } catch (e) {
      setSaveError(e?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-foreground">
                {userDisplayName}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {sectionTitle}
              </p>
            </div>
          </div>

          {tab === "orders" ? (
            <div className="mt-4">
              <MyOrders />
            </div>
          ) : tab === "reservations" ? (
            <div className="mt-4">
              <MyReservations />
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-background p-3 sm:p-4">
              <form
                className="grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Name</label>
                  <input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <input
                    value={user?.phone || ""}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground opacity-90"
                  />
                </div>

                {saveError ? (
                  <p className="text-sm text-destructive">{saveError}</p>
                ) : null}

                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
