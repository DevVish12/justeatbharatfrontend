import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/context/CartContext";
import { useOrderType } from "@/context/OrderTypeContext";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "@/hooks/use-toast";
import { getImage } from "@/lib/imageMap";
import { apiRequest } from "@/services/api";
import { getProcessedMenu } from "@/services/menuService";
import { createOrder, verifyRazorpayPayment } from "@/services/orderService";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Info,
  Minus,
  PartyPopper,
  PencilLine,
  Plus,
  ShoppingBag,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import PromosModal from "./PromosModal";

const normalizePhoneDigits = (raw) => {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
};

const canUseTable = ({ table }) => {
  if (!table) return false;
  const status = String(table?.status || "").toLowerCase();
  return status === "free";
};

const formatShortTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const CartPage = () => {
  const navigate = useNavigate();
  const { storeOpen } = useStoreStatus();
  const { items, updateQuantity, totalPrice, addItem, clearCart } = useCart();
  const { user } = useUserAuth();
  const [suggestions, setSuggestions] = useState([]);
  const { orderType, setOrderType } = useOrderType();
  const [orderTypeOpen, setOrderTypeOpen] = useState(false);
  const orderTypeRef = useRef(null);
  const menuIndexRef = useRef(new Map());
  const cravingScrollRef = useRef(null);

  const [tables, setTables] = useState([]);
  const [isTablesLoading, setIsTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tableValidationError, setTableValidationError] = useState("");

  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [instructions, setInstructions] = useState("");

  const [promosOpen, setPromosOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  const [freeItemPreview, setFreeItemPreview] = useState(null);
  const [petpoojaCouponInfo, setPetpoojaCouponInfo] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("OFFLINE");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // removed sharedOrderType, using orderType directly

  useEffect(() => {
    if (!user) return;

    setCustomerName((prev) => {
      if (String(prev || "").trim()) return prev;
      const name = String(user?.name || "").trim();
      return name || prev;
    });

    setCustomerPhone((prev) => {
      if (String(prev || "").trim()) return prev;
      const phone = String(user?.phone || "").trim();
      return phone || prev;
    });
  }, [user?.id]);

  useEffect(() => {
    const controller = new AbortController();

    getProcessedMenu({ signal: controller.signal })
      .then((data) => {
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.bestsellers)
            ? data.bestsellers
            : [];

        const index = new Map();
        for (const it of list) {
          if (!it?.id) continue;
          index.set(String(it.id), it);
        }
        menuIndexRef.current = index;

        const inCartIds = new Set(
          items.map((ci) => ci.menuItem?.id).filter(Boolean),
        );
        const filtered = list.filter((it) => it?.id && !inCartIds.has(it.id));
        setSuggestions(filtered.slice(0, 4));
      })
      .catch(() => setSuggestions([]));

    return () => controller.abort();
  }, [items]);

  const cartItemsForCoupon = useMemo(() => {
    return items.map((ci) => {
      const price = ci.variant?.price || ci.menuItem.price;
      return {
        itemid: ci.menuItem.id,
        quantity: ci.quantity,
        price,
      };
    });
  }, [items]);

  useEffect(() => {
    if (orderType !== "dine_in") {
      setSelectedTableId("");
      setTableValidationError("");
      return;
    }

    let ignore = false;
    setTablesError("");

    const loadTables = async ({ showLoader } = {}) => {
      if (showLoader) setIsTablesLoading(true);

      try {
        const data = await apiRequest("/tables");
        if (ignore) return;
        const list = Array.isArray(data?.tables) ? data.tables : [];
        setTables(list);
      } catch (error) {
        if (ignore) return;
        setTables([]);
        setTablesError(error?.message || "Failed to load tables");
      } finally {
        if (!ignore && showLoader) setIsTablesLoading(false);
      }
    };

    loadTables({ showLoader: true });
    const interval = window.setInterval(() => {
      loadTables({ showLoader: false });
    }, 15000);

    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [orderType]);

  useEffect(() => {
    if (orderType !== "dine_in") return;
    if (!Array.isArray(tables) || tables.length === 0) return;
    const selected = selectedTableId
      ? tables.find((t) => String(t?.id) === String(selectedTableId))
      : null;

    if (selected && canUseTable({ table: selected })) {
      setTableValidationError("");
      return;
    }

    const firstFree = tables.find((t) => canUseTable({ table: t }));
    setSelectedTableId(firstFree?.id ? String(firstFree.id) : "");
    setTableValidationError(firstFree ? "" : "No free tables available");
  }, [orderType, tables, selectedTableId, user?.phone, customerPhone]);

  useEffect(() => {
    if (!orderTypeOpen) return;

    const onPointerDown = (e) => {
      if (!orderTypeRef.current) return;
      if (!orderTypeRef.current.contains(e.target)) {
        setOrderTypeOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
    };
  }, [orderTypeOpen]);

  const itemTotal = Number(totalPrice) || 0;
  const discountedItemTotal = useMemo(() => {
    const d = Number(couponDiscount) || 0;
    return Math.max(0, itemTotal - d);
  }, [itemTotal, couponDiscount]);
  const gst = useMemo(() => discountedItemTotal * 0.05, [discountedItemTotal]);
  const grandTotal = useMemo(
    () => discountedItemTotal + gst,
    [discountedItemTotal, gst],
  );

  const isEmpty = items.length === 0;

  const orderTypeLabel = orderType === "pickup" ? "Pick Up" : "Dine In";

  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    return (
      tables.find((t) => String(t?.id) === String(selectedTableId)) || null
    );
  }, [tables, selectedTableId]);

  const applyCoupon = async (rawCode) => {
    const code = String(rawCode || "")
      .trim()
      .toUpperCase();
    setCouponCode(code);
    setCouponError("");
    setIsCouponApplying(true);
    setFreeItemPreview(null);
    setPetpoojaCouponInfo(null);

    try {
      const data = await apiRequest("/coupons/validate", {
        method: "POST",
        body: {
          coupon_code: code,
          cart_total: itemTotal,
          cart_items: cartItemsForCoupon,
        },
      });

      setAppliedCoupon(data?.coupon || null);
      setCouponDiscount(Number(data?.discountAmount) || 0);
      setPetpoojaCouponInfo(data?.petpooja || null);

      if (data?.freeItem?.itemid) {
        const free = {
          itemid: String(data.freeItem.itemid),
          quantity: Number(data.freeItem.quantity) || 1,
        };
        const item = menuIndexRef.current.get(String(free.itemid));
        setFreeItemPreview({ ...free, name: item?.name || "" });
      }
    } catch (e) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError(e?.message || "Failed to apply coupon");
      setFreeItemPreview(null);
      setPetpoojaCouponInfo(null);
    } finally {
      setIsCouponApplying(false);
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError("");
    setFreeItemPreview(null);
    setPetpoojaCouponInfo(null);
    setCouponCode("");
    setIsCouponApplying(false);
  };

  useEffect(() => {
    if (!appliedCoupon?.code) return;
    if (isCouponApplying) return;

    // Re-validate when cart changes to keep totals correct.
    applyCoupon(appliedCoupon.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const loadRazorpayCheckout = () => {
    if (window?.Razorpay) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load Razorpay SDK")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setTableValidationError("");

    const user_name = String(customerName || "").trim();
    const phone = String(customerPhone || "").trim();
    if (!user_name) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name.",
      });
      return;
    }
    if (!phone) {
      toast({
        variant: "destructive",
        title: "Phone required",
        description: "Please enter your phone number.",
      });
      return;
    }

    if (orderType === "dine_in") {
      if (!selectedTable?.tableNumber) {
        setTableValidationError("Please select a table number");
        return;
      }

      if (!canUseTable({ table: selectedTable })) {
        const status = String(selectedTable?.status || "").toLowerCase();
        const message =
          status && status !== "free"
            ? `Selected table is ${status}`
            : "Selected table is not free";
        setTableValidationError(message);
        toast({
          variant: "destructive",
          title: "Table not available",
          description: message,
        });
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const payload = {
        user_name,
        phone,
        order_type: orderType,
        table_no: orderType === "dine_in" ? selectedTable?.tableNumber : "",
        items: items.map((ci) => {
          const price = ci.variant?.price || ci.menuItem.price;
          return {
            id: ci.menuItem.id,
            name: ci.menuItem.name,
            variant: ci.variant?.name || "",
            quantity: ci.quantity,
            price,
          };
        }),
        discount_total: Number(couponDiscount) || 0,
        tax: Number(gst) || 0,
        payment_method: paymentMethod,
        special_instructions: instructions,
      };

      const data = await createOrder(payload);

      if (paymentMethod === "OFFLINE") {
        toast({
          title: "Order placed",
          description: data?.order?.order_id
            ? `Order ID: ${data.order.order_id}`
            : "Your order has been placed.",
        });
        clearCart();
        navigate("/", { replace: true });
        return;
      }

      await loadRazorpayCheckout();

      const rp = data?.razorpay;
      if (!rp?.key_id || !rp?.order_id) {
        throw new Error("Razorpay order details missing");
      }

      const appOrderId = data?.order?.order_id || "";

      const rzp = new window.Razorpay({
        key: rp.key_id,
        amount: rp.amount,
        currency: rp.currency || "INR",
        name: "Just Eat Bharat",
        description: "Order payment",
        order_id: rp.order_id,
        prefill: {
          name: user_name,
          contact: phone,
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
          },
        },
        handler: async (response) => {
          try {
            const verified = await verifyRazorpayPayment({
              order_id: appOrderId,
              razorpay_order_id: response?.razorpay_order_id,
              razorpay_payment_id: response?.razorpay_payment_id,
              razorpay_signature: response?.razorpay_signature,
            });

            toast({
              title: "Payment successful",
              description: verified?.order?.order_id
                ? `Order ID: ${verified.order.order_id}`
                : "Payment verified.",
            });
            clearCart();
            navigate("/", { replace: true });
          } catch (e) {
            toast({
              variant: "destructive",
              title: "Payment verification failed",
              description: e?.message || "Please contact support.",
            });
          } finally {
            setIsPlacingOrder(false);
          }
        },
      });

      rzp.open();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: e?.message || "Please try again.",
      });
      setIsPlacingOrder(false);
    }
  };

  const scrollCravingMore = (dir) => {
    const el = cravingScrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -270 : 270;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-muted/30">
        <div className="max-w-[1180px] mx-auto px-4 pt-6 pb-28 lg:pb-6">
          {isEmpty ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "100%", maxWidth: 140 }}
                >
                  <circle cx="256" cy="256" r="256" fill="#fff" />
                  <path
                    fill="#FF8000"
                    opacity="0.5"
                    d="M427.91,208.95v35.26c0,6.87-5.43,12.45-12.14,12.45H108.26c-6.7,0-12.15-5.58-12.15-12.45v-35.26c0-6.87,5.45-12.45,12.15-12.45h31.41l-13.52,27.49h-11.73c-1.2,0-2.19,1.01-2.19,2.25s0.99,2.26,2.19,2.26h31.53c1.22,0,2.19-1.02,2.19-2.26s-0.97-2.25-2.19-2.25h-14.88l13.52-27.49h241.96l13.51,27.49h-14.88c-1.21,0-2.2,1.01-2.2,2.25s0.99,2.26,2.2,2.26h31.52c1.21,0,2.2-1.02,2.2-2.26s-0.99-2.25-2.2-2.25h-11.72l-13.52-27.49h24.31C422.48,196.5,427.91,202.08,427.91,208.95z"
                  />
                  <path
                    fill="#FF8000"
                    d="M410.79,256.66l-30.4,150.99l-2.19,10.82c-0.17,0.06-0.36,0.11-0.55,0.17c-18.77,5.46-62.72,9.3-113.96,9.3c-51.22,0-95.18-3.84-113.96-9.3c-0.18-0.06-0.36-0.11-0.54-0.17l-2.18-10.82l-30.4-150.99H410.79z"
                  />
                </svg>
              </div>
              <p className="text-[36px] leading-none mb-2">&#128542;</p>
              <p className="text-2xl font-semibold text-foreground mb-6">
                Your Cart is Empty
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Order Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-2xl border border-border shadow-sm">
                  <div className="flex items-start justify-between p-5">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => navigate(-1)}
                        className="mt-0.5 w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center"
                        aria-label="Back"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Just Eat Bharat , Zirakpur Punjab
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ITEMS ADDED
                        </p>
                      </div>
                    </div>

                    <div className="relative" ref={orderTypeRef}>
                      <button
                        type="button"
                        onClick={() => setOrderTypeOpen((v) => !v)}
                        className="text-xs font-medium text-foreground border border-border rounded-full px-3 py-1 bg-card inline-flex items-center gap-1.5"
                        aria-haspopup="menu"
                        aria-expanded={orderTypeOpen}
                      >
                        <span>{orderTypeLabel}</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="underline underline-offset-2">
                          Change
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>

                      {orderTypeOpen && (
                        <div
                          role="menu"
                          className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOrderType("pickup");
                              setOrderTypeOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <ShoppingBag className="w-4 h-4 text-foreground" />
                              <span className="text-sm text-foreground">
                                Pick Up
                              </span>
                            </div>
                            {orderType === "pickup" && (
                              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-foreground" />
                              </span>
                            )}
                          </button>

                          <div className="h-px bg-border" />

                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOrderType("dine_in");
                              setOrderTypeOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <UtensilsCrossed className="w-4 h-4 text-foreground" />
                              <span className="text-sm text-foreground">
                                Dine In
                              </span>
                            </div>
                            {orderType === "dine_in" && (
                              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-foreground" />
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 space-y-4">
                    {items.map((ci) => {
                      const key = `${ci.menuItem.id}-${ci.variant?.name || "default"}`;
                      const price = ci.variant?.price || ci.menuItem.price;

                      return (
                        <div
                          key={key}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                          <div className="flex items-start gap-2 min-w-0 w-full sm:items-center">
                            <span
                              className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                                ci.menuItem.isVeg
                                  ? "border-veg"
                                  : "border-nonveg"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ci.menuItem.isVeg ? "bg-veg" : "bg-nonveg"
                                }`}
                              />
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground whitespace-normal break-words leading-snug sm:truncate sm:whitespace-nowrap">
                                {ci.menuItem.name}
                                {ci.variant?.name
                                  ? ` (${ci.variant.name})`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:justify-end sm:gap-4 flex-shrink-0">
                            <div className="flex items-center border border-border rounded-full overflow-hidden bg-card">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    ci.menuItem.id,
                                    ci.variant?.name,
                                    -1,
                                  )
                                }
                                className="px-3 py-1"
                                aria-label="Decrease"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 text-sm font-semibold text-foreground">
                                {ci.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    ci.menuItem.id,
                                    ci.variant?.name,
                                    1,
                                  )
                                }
                                className="px-3 py-1"
                                aria-label="Increase"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-foreground min-w-[64px] text-right">
                              ₹{(price * ci.quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-2 border-t border-border flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate("/")}
                        className="text-xs font-medium text-foreground border border-border rounded-lg px-3 py-2 bg-card inline-flex items-center gap-2"
                      >
                        <CirclePlus className="w-4 h-4" />
                        Add More Items
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Craving More?
                  </p>
                  <style>{`
                    .cm-scroll::-webkit-scrollbar { display: none; }
                    .cm-card:hover { box-shadow: 0 14px 30px rgba(148,163,184,0.24), 0 4px 10px rgba(148,163,184,0.16) !important; }
                    .cm-addbtn:hover { background-color: #F9FAFB !important; }
                    .cm-card {
                      width: 260px;
                      min-height: 375px;
                    }
                    .cm-image {
                      height: 250px;
                    }

                    @media (max-width: 1024px) {
                      .cm-card {
                        width: clamp(190px, 30vw, 230px);
                        min-height: 340px;
                      }
                      .cm-image {
                        height: 210px;
                      }
                    }

                    @media (max-width: 768px) {
                      .cm-track {
                        padding-left: 12px !important;
                        padding-right: 12px !important;
                        gap: 10px !important;
                      }
                      .cm-card {
                        width: clamp(150px, 42vw, 185px);
                        min-height: 300px;
                      }
                      .cm-image {
                        height: 170px;
                      }
                      .cm-content {
                        padding: 8px 12px 10px !important;
                      }
                      .cm-name {
                        margin-top: 10px !important;
                      }
                      .cm-tag {
                        font-size: 10px !important;
                        padding: 3px 10px !important;
                      }
                      .cm-price {
                        font-size: 14px !important;
                      }
                      .cm-price-row {
                        padding-top: 12px !important;
                      }
                      .cm-addbtn {
                        font-size: 12px !important;
                        padding: 7px 14px !important;
                        border-radius: 7px !important;
                      }
                    }

                    @media (max-width: 480px) {
                      .cm-card {
                        width: clamp(140px, 44vw, 160px) !important;
                        min-height: 200px !important;
                        border-radius: 14px !important;
                        overflow: hidden;
                        border: 1px solid #f0f0f0 !important;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
                        background: #fff !important;
                      }

                      .cm-card > div:first-child {
                        padding: 0 !important;
                      }

                      .cm-image {
                        height: 150px !important;
                        width: 100% !important;
                        object-fit: cover;
                        border-radius: 14px 14px 0 0 !important;
                      }

                      .cm-content {
                        padding: 7px 10px 10px !important;
                      }

                      .cm-tag {
                        font-size: 9px !important;
                        padding: 2px 5px !important;
                        border-radius: 4px !important;
                        background: #F3F0ED !important;
                      }

                      .cm-name {
                        margin-top: 4px !important;
                        font-size: 12px !important;
                        font-weight: 600 !important;
                        line-height: 14px !important;
                        color: #1A1A1A;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                      }

                      .cm-price-row {
                        padding-top: 6px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                      }

                      .cm-price {
                        font-size: 13px !important;
                        font-weight: 700 !important;
                        color: #1A1A1A !important;
                      }

                      .cm-addbtn {
                        font-size: 10px !important;
                        font-weight: 600 !important;
                        padding: 4px 10px !important;
                        border-radius: 6px !important;
                        border: 1px solid #d4d4d4 !important;
                        background: #fff !important;
                        color: #1A1A1A !important;
                      }
                    }
                  `}</style>

                  <div
                    style={{
                      position: "relative",
                      paddingLeft: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => scrollCravingMore("left")}
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={20} color="#4B5563" />
                    </button>

                    <div
                      ref={cravingScrollRef}
                      className="cm-scroll cm-track"
                      style={{
                        display: "flex",
                        gap: "12px",
                        overflowX: "auto",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingBottom: "12px",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {suggestions.map((it) => {
                        const dotColor = it.isVeg ? "#16a34a" : "#dc2626";

                        return (
                          <div
                            key={it.id}
                            className="cm-card"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flexShrink: 0,
                              background: "#ffffff",
                              borderRadius: "16px",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                              transition: "box-shadow 0.3s",
                            }}
                          >
                            <div
                              style={{
                                padding: "8px",
                                background: "#ffffff",
                                borderRadius: "12px 12px 0 0",
                              }}
                            >
                              <img
                                className="cm-image"
                                src={getImage(it.image)}
                                alt={it.name}
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  display: "block",
                                }}
                                loading="lazy"
                              />
                            </div>

                            <div
                              className="cm-content"
                              style={{
                                padding: "8px 16px 12px",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                background: "#ffffff",
                                borderRadius: "0 0 12px 12px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    width: "13px",
                                    height: "13px",
                                    borderRadius: "50%",
                                    border: `2px solid ${dotColor}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    background: "#fff",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "5px",
                                      height: "5px",
                                      borderRadius: "50%",
                                      background: dotColor,
                                    }}
                                  />
                                </span>
                                <span
                                  className="cm-tag"
                                  style={{
                                    background: "#F3F0ED",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#1A1A1A",
                                  }}
                                >
                                  Recommended
                                </span>
                              </div>

                              <h3
                                className="cm-name"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "15px",
                                  fontWeight: 500,
                                  color: "#1A1A1A",
                                  marginTop: "16px",
                                  lineHeight: "16.8px",
                                }}
                              >
                                {it.name}
                              </h3>

                              <div
                                className="cm-price-row"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: "auto",
                                  paddingTop: "16px",
                                }}
                              >
                                <span
                                  className="cm-price"
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#1A1A1A",
                                  }}
                                >
                                  ₹{it.price}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => addItem(it)}
                                  className="cm-addbtn"
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    border: "1px solid #333333",
                                    borderRadius: "8px",
                                    padding: "8px 20px",
                                    background: "#ffffff",
                                    color: "#1A1A1A",
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                  }}
                                >
                                  ADD +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollCravingMore("right")}
                      style={{
                        position: "absolute",
                        right: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 20,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={20} color="#4B5563" />
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      SAVINGS CORNER
                    </p>
                  </div>
                  <div className="px-5 py-4 bg-primary/10 border-t border-border">
                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-foreground" />
                      <div className="text-sm text-foreground">
                        <p className="font-medium">Apply a promo code</p>
                        {appliedCoupon?.code ? (
                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              Applied: {appliedCoupon.code}
                            </p>
                            <button
                              type="button"
                              onClick={clearCoupon}
                              className="text-xs font-medium text-foreground underline underline-offset-2"
                              aria-label="Remove applied coupon"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Choose a promo from the list
                          </p>
                        )}
                        {couponError ? (
                          <p className="text-xs text-destructive mt-1">
                            {couponError}
                          </p>
                        ) : null}
                        {freeItemPreview?.itemid ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            Free item:{" "}
                            {freeItemPreview.name || freeItemPreview.itemid} x
                            {freeItemPreview.quantity}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-border">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="text-xs border border-border rounded-lg px-3 py-2 bg-card w-full sm:w-48"
                        />
                        <button
                          type="button"
                          onClick={() => applyCoupon(couponCode)}
                          disabled={
                            isCouponApplying || !String(couponCode || "").trim()
                          }
                          className="text-xs font-medium text-foreground border border-border rounded-lg px-3 py-2 bg-card disabled:opacity-50"
                        >
                          {isCouponApplying ? "Applying..." : "Apply"}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPromosOpen(true)}
                        className="text-xs font-medium text-foreground border border-border rounded-lg px-3 py-2 bg-card"
                      >
                        View more offers
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                  <p className="text-sm font-semibold text-foreground">
                    Table DETAILS
                  </p>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Table No.
                      </p>
                      {orderType === "pickup" ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          Not required for pickup
                        </p>
                      ) : isTablesLoading ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          Loading tables...
                        </p>
                      ) : tablesError ? (
                        <p className="text-xs text-destructive mt-1">
                          {tablesError}
                        </p>
                      ) : selectedTable?.tableNumber ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          Table {selectedTable.tableNumber}
                          {selectedTable.status
                            ? ` (${selectedTable.status})`
                            : ""}
                          {String(selectedTable.status).toLowerCase() ===
                            "booked" && selectedTable.bookedUntil
                            ? ` · free at ${formatShortTime(
                                selectedTable.bookedUntil,
                              )}`
                            : ""}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          Table not selected
                        </p>
                      )}
                    </div>
                    {orderType === "dine_in" ? (
                      <div className="flex flex-col items-end gap-1">
                        <select
                          value={selectedTableId}
                          onChange={(e) => {
                            const nextId = e.target.value;
                            if (!nextId) {
                              setSelectedTableId("");
                              setTableValidationError(
                                "Please select a table number",
                              );
                              return;
                            }

                            const nextTable = tables.find(
                              (t) => String(t?.id) === String(nextId),
                            );

                            if (
                              nextTable &&
                              !canUseTable({ table: nextTable })
                            ) {
                              const status = String(
                                nextTable?.status || "",
                              ).toLowerCase();
                              const message =
                                status && status !== "free"
                                  ? `Only free tables can be selected (this is ${status})`
                                  : "Only free tables can be selected";
                              setTableValidationError(message);
                              toast({
                                variant: "destructive",
                                title: "Select a free table",
                                description: message,
                              });
                              return;
                            }

                            setSelectedTableId(String(nextId));
                            setTableValidationError("");
                          }}
                          className="text-xs border border-border rounded-lg px-2 py-1 bg-card"
                          aria-label="Select table"
                        >
                          <option value="">Select table</option>
                          {tables.map((t) => (
                            <option
                              key={t.id}
                              value={String(t.id)}
                              disabled={!canUseTable({ table: t })}
                            >
                              {t.tableNumber
                                ? `Table ${t.tableNumber}`
                                : "Table"}{" "}
                              {t.status ? `(${t.status})` : ""}
                              {String(t.status).toLowerCase() === "booked" &&
                              t.bookedUntil
                                ? ` · free at ${formatShortTime(t.bookedUntil)}`
                                : ""}
                            </option>
                          ))}
                        </select>
                        {tableValidationError ? (
                          <p className="text-xs text-destructive">
                            {tableValidationError}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                  <p className="text-sm font-semibold text-foreground">
                    CUSTOMER DETAILS
                  </p>
                  <div className="mt-4 space-y-3">
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                      autoComplete="name"
                    />
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone number"
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                      inputMode="tel"
                      autoComplete="tel"
                    />

                    <button
                      type="button"
                      onClick={() => setInstructionsOpen((v) => !v)}
                      className="w-full text-xs font-medium text-foreground border border-border rounded-lg px-3 py-2 bg-card inline-flex items-center justify-center gap-2"
                    >
                      <PencilLine className="w-4 h-4" />
                      Add Special Instructions
                    </button>

                    {instructionsOpen && (
                      <div className="rounded-xl bg-muted/40 border border-border p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
                          <PencilLine className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <input
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Add special instructions"
                          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        {instructions ? (
                          <button
                            type="button"
                            onClick={() => setInstructions("")}
                            className="text-xs text-muted-foreground"
                            aria-label="Clear instructions"
                          >
                            ×
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                  <p className="text-sm font-semibold text-foreground">
                    PAYMENT METHOD
                  </p>

                  <div className="mt-4 space-y-3 text-sm">
                    <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="OFFLINE"
                        checked={paymentMethod === "OFFLINE"}
                        onChange={() => setPaymentMethod("OFFLINE")}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          Pay at Counter
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pay when you receive your order.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => setPaymentMethod("ONLINE")}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          Online (Razorpay)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pay securely using UPI / card / netbanking.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                  <p className="text-sm font-semibold text-foreground">
                    BILL DETAILS
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-foreground">
                      <span>Item Total</span>
                      <span>₹{itemTotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon?.code && couponDiscount > 0 ? (
                      <div className="flex items-center justify-between text-sm text-foreground">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span>-₹{Number(couponDiscount).toFixed(2)}</span>
                      </div>
                    ) : null}
                    {appliedCoupon?.code && couponDiscount > 0 ? (
                      <div className="flex items-center justify-between text-sm text-foreground">
                        <span>Subtotal</span>
                        <span>₹{discountedItemTotal.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between text-sm text-foreground">
                      <span className="inline-flex items-center gap-1">
                        GST(Govt. Taxes)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              aria-label="View GST breakup"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            className="p-4 w-64"
                          >
                            <p className="text-sm font-semibold text-foreground">
                              Restaurant GST Breakup
                            </p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between text-sm text-foreground">
                                <span>CGST</span>
                                <span>₹{(gst / 2).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-foreground">
                                <span>SGST</span>
                                <span>₹{(gst / 2).toFixed(2)}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex items-center justify-between text-sm font-semibold text-foreground">
                      <span>Grand Total</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon?.code && couponDiscount > 0 ? (
                      <div className="mt-3 rounded-xl border border-border bg-primary/10 px-4 py-3">
                        <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                          <PartyPopper className="w-4 h-4" />
                          <span>
                            You are{" "}
                            <span className="font-semibold">saving</span>{" "}
                            <span className="font-semibold">
                              ₹{Number(couponDiscount).toFixed(0)}
                            </span>{" "}
                            on this Order!
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {String(instructions || "").trim() ? (
                      <div className="rounded-xl bg-muted/30 border border-border p-3">
                        <p className="text-xs font-medium text-foreground">
                          Special Instructions
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                          {instructions}
                        </p>
                      </div>
                    ) : null}

                    <div className="pt-2 text-xs text-muted-foreground space-y-2">
                      <p>
                        Orders once placed cannot be cancelled and are
                        non-refundable
                      </p>
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-0.5"
                        />
                        <span>
                          Yes, I would like to receive updates and exclusive
                          offers from Just Eat Bharat
                        </span>
                      </label>
                    </div>

                    {!storeOpen ? (
                      <p className="mt-4 text-sm font-medium text-red-600">
                        Restaurant is currently closed
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || !storeOpen}
                      className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-between px-4 disabled:opacity-60"
                    >
                      <span>
                        {isPlacingOrder
                          ? "Processing..."
                          : paymentMethod === "OFFLINE"
                            ? "Place Order"
                            : "Pay Securely"}
                      </span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEmpty ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg lg:hidden">
          <div className="max-w-[1180px] mx-auto px-4 py-3">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !storeOpen}
              className="w-full flex items-center justify-between bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-sm font-semibold disabled:opacity-60"
            >
              <span>
                {isPlacingOrder
                  ? "Processing..."
                  : paymentMethod === "OFFLINE"
                    ? "Place Order"
                    : "Pay Securely"}
              </span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      ) : null}

      <PromosModal
        open={promosOpen}
        onClose={() => setPromosOpen(false)}
        onSelectCode={(code) => applyCoupon(code)}
      />

      <Footer />
    </>
  );
};

export default CartPage;
