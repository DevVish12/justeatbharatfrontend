import LegalPageLayout from "@/components/LegalPageLayout";
import SeoMeta from "@/components/SeoMeta";
import { BadgeAlert, Clock3, CreditCard, ShieldAlert } from "lucide-react";

const sections = [
  {
    title: "1. General Non-Refundable Policy",
    text: [
      "All successfully processed payments are generally non-refundable unless a specific exception is approved after internal verification.",
    ],
  },
  {
    title: "2. Change of Mind",
    text: [
      "Refunds are not provided when a customer changes their mind after placing an order or making a payment.",
    ],
  },
  {
    title: "3. Taste Preference Issues",
    text: [
      "Refunds are not issued for food taste, flavor profile, portion preference, or personal culinary expectations that do not relate to order error or delivery failure.",
    ],
  },
  {
    title: "4. Delayed Consumption by Customer",
    text: [
      "If the customer consumes, opens, or handles the order after an extended delay, refund requests will not generally be approved for quality complaints caused by the delay.",
    ],
  },
  {
    title: "5. Incorrect Selections Made by Customer",
    text: [
      "Refunds are not available when the customer chooses the wrong item, customization, quantity, address, or delivery instructions during checkout.",
    ],
  },
  {
    title: "6. Customer Absence During Delivery",
    text: [
      "If the customer is unavailable at the time of delivery or unreachable after reasonable contact attempts, the order may be completed, returned, or otherwise closed without a refund.",
    ],
  },
  {
    title: "7. Exceptional Refund Consideration",
    text: [
      "Refund consideration may occur only in exceptional situations such as duplicate payment, technical payment failure, non-delivery due to platform error, or payment charged without order creation.",
    ],
  },
  {
    title: "8. Duplicate Payment",
    text: [
      "If the same payment is charged more than once for the same order, the platform may review the transaction and process a correction after verification.",
    ],
  },
  {
    title: "9. Technical Payment Failure",
    text: [
      "When a payment is captured but the order does not progress because of a technical issue, the support team may review the case and determine whether a refund is warranted.",
    ],
  },
  {
    title: "10. Order Not Delivered Due to Platform Error",
    text: [
      "If an order fails because of a verified platform-side error rather than customer actions or restaurant unavailability, the case may be eligible for refund review.",
    ],
  },
  {
    title: "11. Payment Charged But Order Not Generated",
    text: [
      "Where the payment gateway confirms a charge but no order is created in the platform workflow, support will verify the discrepancy and may approve a refund if substantiated.",
    ],
  },
  {
    title: "12. Internal Verification",
    text: [
      "All refund requests are subject to internal verification of the payment trail, order lifecycle, delivery status, and incident reports before any approval is issued.",
    ],
  },
  {
    title: "13. Approval or Rejection Rights",
    text: [
      "The platform reserves the right to approve or reject refund requests based on the available evidence, policy rules, and applicable legal obligations.",
    ],
  },
  {
    title: "14. Processing Timeline",
    text: [
      "Approved refunds may take 5 to 10 business days to reflect, depending on the bank, card issuer, wallet provider, or payment gateway used for the original transaction.",
    ],
  },
  {
    title: "15. Razorpay Processing Clauses",
    text: [
      "Where Razorpay handled the original transaction, refund processing, status updates, and settlement timing may also be affected by Razorpay's processing and banking network timelines.",
    ],
  },
  {
    title: "16. Chargeback and Fraud Prevention",
    text: [
      "Unverified chargebacks, misleading claims, or fraudulent disputes may trigger account review, evidence submission requirements, or restriction of future payment access.",
    ],
  },
  {
    title: "17. Refund Dispute Contact Information",
    text: [
      "For refund-related disputes, please email support@justeatbharat.com with the order ID, payment reference, and a short description of the issue.",
    ],
  },
];

const RefundPolicy = () => (
  <LegalPageLayout>
    <SeoMeta
      title="Refund Policy | Just Eat Bharat"
      description="Understand when refunds may be considered, the platform's non-refundable policy, verification steps, Razorpay handling, and dispute contacts."
      path="/refund-policy"
    />

    <section
      className="relative overflow-hidden rounded-3xl border border-[#f2ded0] p-6 md:p-10 mb-8 md:mb-12"
      style={{
        background:
          "linear-gradient(120deg, rgba(249,116,21,0.12) 0%, rgba(249,116,21,0.05) 45%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-[#F97415]/10 blur-2xl" />
      <div className="relative max-w-3xl">
        <span className="inline-flex items-center rounded-full border border-[#f6d6bf] bg-white px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#c85f11] uppercase">
          Refund & Disputes
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
          Refund Policy for the Just Eat Bharat platform.
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          All payments made through the platform are generally non-refundable unless specifically approved after verification.
        </p>
      </div>
    </section>

    <section className="rounded-3xl border border-[#f0d7c4] bg-[#fff7f1] p-6 md:p-7 shadow-sm mb-8 md:mb-12">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c85f11]">
            Important notice
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
            All payments made through the platform are generally non-refundable unless specifically approved after verification.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: CreditCard, label: "Payment review" },
            { icon: Clock3, label: "5 to 10 business days" },
            { icon: ShieldAlert, label: "Verification required" },
            { icon: BadgeAlert, label: "Fraud checks applied" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-[#f0d7c4] bg-white p-4 shadow-sm">
                <Icon size={18} className="text-[#F97415]" />
                <p className="mt-3 text-sm font-semibold text-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="space-y-5 rounded-3xl border border-[#f0e3d8] bg-white p-6 md:p-8 shadow-sm">
      {sections.map((section) => (
        <article key={section.title} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">{section.title}</h2>
          <div className="mt-3 space-y-3 text-sm md:text-[15px] leading-relaxed text-muted-foreground">
            {section.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  </LegalPageLayout>
);

export default RefundPolicy;