import LegalPageLayout from "@/components/LegalPageLayout";
import SeoMeta from "@/components/SeoMeta";
import { Database, FileText, Lock, Mail, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    text: [
      "This Privacy Policy explains how Just Eat Bharat collects, uses, stores, shares, and protects personal information when you use our food ordering and restaurant marketplace services.",
      "By using the platform, you agree to the practices described in this policy, subject to applicable law and any service-specific terms that may also apply.",
    ],
  },
  {
    title: "2. Information We Collect",
    text: [
      "We may collect information that you provide directly, information generated through platform usage, and information received from third-party service providers that help us operate the marketplace.",
    ],
  },
  {
    title: "3. Customer Information",
    text: [
      "For customers, this may include name, phone number, email address, delivery address, order history, saved preferences, support communications, and transaction identifiers.",
    ],
  },
  {
    title: "4. Restaurant Information",
    text: [
      "For restaurant partners, we may collect business name, owner details, contact information, menu data, operational details, GST or tax-related records, and onboarding documents where required.",
    ],
  },
  {
    title: "5. Delivery Partner Information",
    text: [
      "For delivery partners, we may process identification details, contact details, route assignments, delivery status updates, and performance or settlement records needed for operations and compliance.",
    ],
  },
  {
    title: "6. Device Information",
    text: [
      "We may collect device identifiers, browser type, IP address, operating system, app version, language settings, and usage data to improve security, diagnostics, and service quality.",
    ],
  },
  {
    title: "7. Cookies Policy",
    text: [
      "Cookies and similar technologies may be used to maintain session state, remember preferences, improve performance, and measure the effectiveness of platform features and campaigns.",
    ],
  },
  {
    title: "8. Payment Information",
    text: [
      "When you make a purchase, we may collect billing-related information and transaction metadata, but sensitive payment credentials are handled through secure payment processing channels rather than stored in plain text on our systems.",
    ],
  },
  {
    title: "9. Razorpay Payment Processing",
    text: [
      "Payments processed through Razorpay are subject to Razorpay's own terms, privacy practices, and security controls. We may receive payment confirmations, failure notices, refunds status updates, and transaction references for order reconciliation.",
    ],
  },
  {
    title: "10. Data Security",
    text: [
      "We use commercially reasonable administrative, technical, and organizational safeguards designed to protect data from unauthorized access, misuse, alteration, or disclosure.",
    ],
  },
  {
    title: "11. Data Sharing Policy",
    text: [
      "We may share information with restaurants, delivery partners, payment processors, logistics providers, analytics vendors, legal authorities, and other service providers when necessary for service delivery or legal compliance.",
    ],
  },
  {
    title: "12. Third Party Services",
    text: [
      "The platform may rely on third-party services for payments, messaging, analytics, hosting, maps, communication, and other business operations. Their own terms and privacy policies may apply when their services are used.",
    ],
  },
  {
    title: "13. Marketing Communications",
    text: [
      "We may send service messages, order updates, promotional offers, or product announcements. You can opt out of non-essential marketing communications where legally required or by using available unsubscribe mechanisms.",
    ],
  },
  {
    title: "14. Data Retention",
    text: [
      "We retain personal information only as long as necessary to provide the service, comply with tax and legal obligations, resolve disputes, prevent fraud, and enforce our agreements.",
    ],
  },
  {
    title: "15. User Rights",
    text: [
      "Subject to applicable law, users may request access, correction, update, or deletion of certain personal data, or raise objections regarding specific processing activities by contacting support.",
    ],
  },
  {
    title: "16. Children's Privacy",
    text: [
      "The platform is not intended for use by children without appropriate legal consent. We do not knowingly collect personal information from children in a manner inconsistent with applicable law.",
    ],
  },
  {
    title: "17. International Data Transfers",
    text: [
      "Where data is processed across borders by third-party vendors or hosting providers, we take reasonable steps to ensure appropriate safeguards are in place as required by law.",
    ],
  },
  {
    title: "18. Account Deletion Requests",
    text: [
      "Users may request account deletion by contacting support. Some information may be retained where necessary for legal, accounting, fraud-prevention, or dispute-resolution purposes.",
    ],
  },
  {
    title: "19. Contact Information",
    text: [
      "For privacy queries, data correction requests, or account-related concerns, please contact support@justeatbharat.com or use the phone support details listed in the website footer.",
    ],
  },
  {
    title: "20. Policy Updates",
    text: [
      "We may update this Privacy Policy from time to time. Material changes will be posted on this page, and continued use of the platform after an update indicates acceptance of the revised policy.",
    ],
  },
];

const PrivacyPolicy = () => (
  <LegalPageLayout>
    <SeoMeta
      title="Privacy Policy | Just Eat Bharat"
      description="Read how Just Eat Bharat collects, uses, shares, retains, and protects customer, restaurant, and delivery partner information."
      path="/privacy-policy"
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
          Privacy & Data Protection
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
          Privacy Policy for the Just Eat Bharat food ordering platform.
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          We are committed to handling user, restaurant, and delivery partner data responsibly while supporting secure platform operations.
        </p>
      </div>
    </section>

    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 md:mb-12">
      {[
        { icon: ShieldCheck, title: "Secure handling", text: "Operational controls designed to protect data." },
        { icon: Database, title: "Data minimization", text: "Collect only what is needed for service delivery." },
        { icon: FileText, title: "Clear notices", text: "Policy language written for commercial use." },
        { icon: Mail, title: "Support contact", text: "Reach out for privacy questions or requests." },
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

export default PrivacyPolicy;