import LegalPageLayout from "@/components/LegalPageLayout";
import SeoMeta from "@/components/SeoMeta";
import { BriefcaseBusiness, FileCheck2, Scale, ShieldAlert } from "lucide-react";

const sections = [
  {
    title: "1. User Eligibility",
    text: [
      "You must be legally capable of entering into a binding contract under Indian law to use the platform's order, restaurant, partner, or account features.",
    ],
  },
  {
    title: "2. Customer Responsibilities",
    text: [
      "Customers are responsible for accurate account information, correct delivery details, lawful use of the platform, and timely acceptance of deliveries once an order is placed.",
    ],
  },
  {
    title: "3. Restaurant Responsibilities",
    text: [
      "Restaurants must ensure menu accuracy, food quality, preparation readiness, lawful operation, and timely communication regarding order availability or delays.",
    ],
  },
  {
    title: "4. Delivery Partner Responsibilities",
    text: [
      "Delivery partners must handle orders professionally, follow route and safety requirements, preserve package integrity where applicable, and comply with platform dispatch rules.",
    ],
  },
  {
    title: "5. Platform Usage Rules",
    text: [
      "Users must not misuse the platform, attempt unauthorized access, engage in fraudulent activity, or interfere with the systems, data, or service operations of the marketplace.",
    ],
  },
  {
    title: "6. Order Acceptance Policy",
    text: [
      "Orders are subject to acceptance by the restaurant and may be declined, canceled, or modified where operational issues, product unavailability, or payment verification concerns exist.",
    ],
  },
  {
    title: "7. Pricing and Taxes",
    text: [
      "Prices shown on the platform may include applicable taxes, charges, or delivery fees as displayed at checkout. Final totals are determined by the order summary before confirmation.",
    ],
  },
  {
    title: "8. Delivery Terms",
    text: [
      "Estimated delivery times are approximate and may vary because of weather, traffic, restaurant preparation, or high demand. Delivery completion occurs when the order is handed over to the customer or authorized recipient.",
    ],
  },
  {
    title: "9. Cancellation Terms",
    text: [
      "Cancellation rights depend on the order stage and operational status. Requests made after preparation, dispatch, or handoff may be rejected or partially processed based on service rules.",
    ],
  },
  {
    title: "10. Intellectual Property",
    text: [
      "All platform branding, text, graphics, logos, interfaces, and software elements are owned by or licensed to the platform and may not be copied, distributed, or reused without permission.",
    ],
  },
  {
    title: "11. Fraud Prevention",
    text: [
      "The platform may review suspicious patterns, duplicate activity, payment anomalies, or abuse indicators and may suspend or verify accounts and transactions to prevent fraud.",
    ],
  },
  {
    title: "12. User Accounts",
    text: [
      "Users are responsible for safeguarding login credentials and for all activity associated with their accounts. Notify support immediately if unauthorized access is suspected.",
    ],
  },
  {
    title: "13. Limitation of Liability",
    text: [
      "To the extent permitted by law, the platform is not liable for indirect, incidental, special, or consequential losses arising from service use, delays, or third-party acts beyond reasonable control.",
    ],
  },
  {
    title: "14. Indemnification",
    text: [
      "Users agree to indemnify and hold the platform harmless from claims, losses, or liabilities arising from misuse, breach of these terms, illegal conduct, or violation of third-party rights.",
    ],
  },
  {
    title: "15. Dispute Resolution",
    text: [
      "Disputes should first be reported to support for good-faith resolution. If unresolved, the parties may pursue legally available remedies in accordance with applicable procedures and jurisdictional rules.",
    ],
  },
  {
    title: "16. Governing Law (India)",
    text: [
      "These terms are governed by the laws of India, and disputes will be interpreted and resolved in accordance with applicable Indian legal requirements.",
    ],
  },
  {
    title: "17. Force Majeure",
    text: [
      "The platform is not responsible for failures or delays caused by events beyond reasonable control, including natural disasters, strikes, internet outages, or government restrictions.",
    ],
  },
  {
    title: "18. Account Suspension",
    text: [
      "We may suspend or terminate access where required for policy violations, fraud risk, legal compliance, abuse, or security protection of the platform and its users.",
    ],
  },
  {
    title: "19. Platform Modifications",
    text: [
      "We may add, remove, or modify platform features, workflows, or pricing structures at any time, subject to reasonable notice where legally required.",
    ],
  },
  {
    title: "20. Contact Information",
    text: [
      "For questions regarding these Terms & Conditions, contact support@justeatbharat.com or use the support phone number listed in the website footer.",
    ],
  },
];

const TermsConditions = () => (
  <LegalPageLayout>
    <SeoMeta
      title="Terms & Conditions | Just Eat Bharat"
      description="Review the terms that govern customers, restaurants, delivery partners, platform usage, order acceptance, liability, and dispute handling."
      path="/terms-and-conditions"
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
          Legal Agreement
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
          Terms & Conditions for the Just Eat Bharat marketplace.
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          These terms set expectations for customers, restaurants, and delivery partners using the platform in India.
        </p>
      </div>
    </section>

    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 md:mb-12">
      {[
        { icon: Scale, title: "Fair usage", text: "Clear rules for the marketplace experience." },
        { icon: BriefcaseBusiness, title: "Partner duties", text: "Responsibilities for restaurants and delivery teams." },
        { icon: FileCheck2, title: "Order controls", text: "Acceptance, cancellation, and pricing conditions." },
        { icon: ShieldAlert, title: "Risk controls", text: "Fraud and suspension protections for all users." },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415]">
              <Icon size={20} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </article>
        );
      })}
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

export default TermsConditions;