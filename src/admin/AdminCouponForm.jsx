import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";
import { isAdminLoggedIn, logoutAdmin } from "../services/adminService";
import { apiRequest } from "../services/api";
import { getProcessedMenu } from "../services/menuService";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const emptyForm = {
  code: "",
  title: "",
  description: "",
  discountType: "flat",
  discountValue: "",
  minOrder: "",
  dishId: "",
  freeItemId: "",
  maxDiscount: "",
  usageLimit: "",
  perUserLimit: "",
  expiryDate: "",
  newUserOnly: false,
  status: "active",
};

const formatDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toApiNumberOrNull = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const toApiIntOrNull = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
};

const isAuthError = (message) => {
  const m = String(message || "").toLowerCase();
  return (
    m.includes("token expired") ||
    m.includes("expired token") ||
    m.includes("invalid token") ||
    m.includes("unauthorized") ||
    m.includes("jwt")
  );
};

export default function AdminCouponForm() {
  const navigate = useNavigate();
  const params = useParams();

  const couponId = params?.id ? Number(params.id) : null;
  const isEdit = Number.isInteger(couponId) && couponId > 0;

  const [coupons, setCoupons] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleAuthFailure = async () => {
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
        const [couponRes, menuRes] = await Promise.all([
          apiRequest("/coupons", { method: "GET" }),
          getProcessedMenu(),
        ]);

        if (ignore) return;

        const couponList = Array.isArray(couponRes?.coupons)
          ? couponRes.coupons
          : [];
        setCoupons(couponList);

        const list = Array.isArray(menuRes?.items)
          ? menuRes.items
          : Array.isArray(menuRes?.bestsellers)
            ? menuRes.bestsellers
            : [];
        setMenuItems(list);

        if (!isEdit) {
          setForm(emptyForm);
          return;
        }

        const existing = couponList.find((c) => Number(c?.id) === couponId);
        if (!existing) {
          toast({
            variant: "destructive",
            title: "Coupon not found",
            description: "This coupon may have been deleted.",
          });
          navigate(getAdminUrl("coupons"), { replace: true });
          return;
        }

        setForm({
          code: existing.code || "",
          title: existing.title || "",
          description: existing.description || "",
          discountType: existing.discountType || "flat",
          discountValue:
            existing.discountValue === null ||
            existing.discountValue === undefined
              ? ""
              : String(existing.discountValue),
          minOrder:
            existing.minOrder === null || existing.minOrder === undefined
              ? ""
              : String(existing.minOrder),
          dishId: existing.dishId || "",
          freeItemId: existing.freeItemId || "",
          maxDiscount:
            existing.maxDiscount === null || existing.maxDiscount === undefined
              ? ""
              : String(existing.maxDiscount),
          usageLimit:
            existing.usageLimit === null || existing.usageLimit === undefined
              ? ""
              : String(existing.usageLimit),
          perUserLimit:
            existing.perUserLimit === null ||
            existing.perUserLimit === undefined
              ? ""
              : String(existing.perUserLimit),
          expiryDate: existing.expiryDate
            ? formatDateInput(existing.expiryDate)
            : "",
          newUserOnly: Boolean(existing.newUserOnly),
          status: existing.status || "active",
        });
      } catch (error) {
        if (ignore) return;
        if (isAuthError(error?.message)) {
          await handleAuthFailure();
          return;
        }
        toast({
          variant: "destructive",
          title: "Failed to load",
          description: error?.message || "Request failed",
        });
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [navigate, couponId, isEdit]);

  const showDishFields =
    form.discountType === "flat" ||
    form.discountType === "percent" ||
    form.discountType === "bogo";

  const showFreeItemField = form.discountType === "free_item";

  const dishOptions = useMemo(() => {
    return menuItems.map((it) => ({
      id: String(it.id),
      name: it.name,
    }));
  }, [menuItems]);

  const buildPayload = () => {
    const payload = {
      code: String(form.code || "")
        .trim()
        .toUpperCase(),
      title: String(form.title || "").trim(),
      description: String(form.description || "").trim(),
      discount_type: form.discountType,
      discount_value: toApiNumberOrNull(form.discountValue),
      min_order: toApiNumberOrNull(form.minOrder),
      dish_id: String(form.dishId || "").trim(),
      free_item_id: String(form.freeItemId || "").trim(),
      max_discount: toApiNumberOrNull(form.maxDiscount),
      usage_limit: toApiIntOrNull(form.usageLimit),
      per_user_limit: toApiIntOrNull(form.perUserLimit),
      expiry_date: form.expiryDate ? `${form.expiryDate} 23:59:59` : null,
      new_user_only: form.newUserOnly ? 1 : 0,
      status: form.status,
    };

    if (!payload.dish_id) delete payload.dish_id;
    if (!payload.free_item_id) delete payload.free_item_id;

    return payload;
  };

  const validateForm = () => {
    const code = String(form.code || "").trim();
    if (!code) return "Coupon code is required";

    if (form.discountType === "percent") {
      const v = toApiNumberOrNull(form.discountValue);
      if (v === null) return "Discount value is required";
      if (v <= 0 || v > 100)
        return "Percent discount must be between 1 and 100";
    }

    if (form.discountType === "flat") {
      const v = toApiNumberOrNull(form.discountValue);
      if (v === null) return "Discount value is required";
      if (v <= 0) return "Flat discount must be greater than 0";
    }

    if (form.discountType === "bogo" && !String(form.dishId || "").trim()) {
      return "Dish is required for BOGO";
    }

    if (
      form.discountType === "free_item" &&
      !String(form.freeItemId || "").trim()
    ) {
      return "Free item is required";
    }

    return "";
  };

  const onSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "Fix the form",
        description: error,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();

      if (isEdit) {
        const res = await apiRequest(`/coupons/${couponId}`, {
          method: "PUT",
          body: payload,
        });
        toast({ title: "Coupon updated" });
        if (res?.coupon) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === res.coupon.id ? res.coupon : c)),
          );
        }
      } else {
        await apiRequest("/coupons", { method: "POST", body: payload });
        toast({ title: "Coupon created" });
      }

      navigate(getAdminUrl("coupons"));
    } catch (e) {
      if (isAuthError(e?.message)) {
        await handleAuthFailure();
        return;
      }
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e?.message || "Request failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="coupons" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">
                  {isEdit ? "Edit Coupon" : "Create Coupon"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set discount rules and availability.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(getAdminUrl("coupons"))}
                  disabled={isSubmitting}
                >
                  Back to Table
                </Button>
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting || isLoading}
                >
                  {isEdit ? "Save Changes" : "Create Coupon"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Basic Info</h2>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Code
                    </label>
                    <input
                      value={form.code}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, code: e.target.value }))
                      }
                      placeholder="LPN75"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">
                      Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Flat ₹75 off"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">
                      Description
                    </label>
                    <input
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Flat ₹75 off on orders above ₹399"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, status: e.target.value }))
                        }
                        className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        id="newUserOnly"
                        type="checkbox"
                        checked={form.newUserOnly}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            newUserOnly: e.target.checked,
                          }))
                        }
                        disabled={isLoading}
                      />
                      <label htmlFor="newUserOnly" className="text-sm">
                        New user only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Discount Rules</h2>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Discount Type
                      </label>
                      <select
                        value={form.discountType}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            discountType: e.target.value,
                            dishId:
                              e.target.value === "free_item" ? "" : p.dishId,
                            freeItemId:
                              e.target.value === "free_item"
                                ? p.freeItemId
                                : "",
                          }))
                        }
                        className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      >
                        <option value="flat">flat</option>
                        <option value="percent">percent</option>
                        <option value="free_item">free_item</option>
                        <option value="bogo">bogo</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">
                        Discount Value
                      </label>
                      <input
                        value={form.discountValue}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            discountValue: e.target.value,
                          }))
                        }
                        placeholder={
                          form.discountType === "percent" ? "10" : "50"
                        }
                        className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={
                          isLoading || form.discountType === "free_item"
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Min Order (optional)
                      </label>
                      <input
                        value={form.minOrder}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, minOrder: e.target.value }))
                        }
                        placeholder="399"
                        className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">
                        Max Discount (optional)
                      </label>
                      <input
                        value={form.maxDiscount}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            maxDiscount: e.target.value,
                          }))
                        }
                        placeholder="100"
                        className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {showDishFields ? (
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Dish (optional / required for bogo)
                      </label>
                      <select
                        value={form.dishId}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, dishId: e.target.value }))
                        }
                        className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      >
                        <option value="">All dishes</option>
                        {dishOptions.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {showFreeItemField ? (
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Free Item
                      </label>
                      <select
                        value={form.freeItemId}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, freeItemId: e.target.value }))
                        }
                        className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        disabled={isLoading}
                      >
                        <option value="">Select free item</option>
                        {dishOptions.map((it) => (
                          <option key={it.id} value={it.id}>
                            {it.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Limits & Validity</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Usage Limit (optional)
                    </label>
                    <input
                      value={form.usageLimit}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, usageLimit: e.target.value }))
                      }
                      placeholder="1000"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">
                      Per User Limit (optional)
                    </label>
                    <input
                      value={form.perUserLimit}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, perUserLimit: e.target.value }))
                      }
                      placeholder="1"
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Expiry Date (optional)
                    </label>
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, expiryDate: e.target.value }))
                      }
                      className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">Actions</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Save changes to make this coupon available at checkout.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setForm(emptyForm)}
                      disabled={isSubmitting || isLoading}
                    >
                      Reset
                    </Button>
                    <Button
                      type="button"
                      onClick={onSubmit}
                      disabled={isSubmitting || isLoading}
                    >
                      {isEdit ? "Save Changes" : "Create Coupon"}
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Loading...
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
