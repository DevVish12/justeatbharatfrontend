import LegalPageLayout from "@/components/LegalPageLayout";
import SeoMeta from "@/components/SeoMeta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  BadgeInfo,
  CreditCard,
  HelpCircle,
  Mail,
  PackageSearch,
  Phone,
  Search,
  ShieldCheck,
  Store,
  Truck,
  WalletCards,
  UserRoundCog,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const supportTopics = [
  {
    title: "How to Place an Order",
    icon: PackageSearch,
    description:
      "Browse restaurants, select items, add them to cart, and complete checkout with your preferred delivery and payment method.",
    points: ["Choose your restaurant and items", "Review cart and place order", "Track confirmation in real time"],
  },
  {
    title: "How to Track Orders",
    icon: Truck,
    description:
      "Use the order screen to follow preparation, dispatch, and delivery progress once the restaurant accepts your order.",
    points: ["Open My Orders", "Check live order status", "Contact support if tracking stalls"],
  },
  {
    title: "Restaurant Registration Guide",
    icon: Store,
    description:
      "Restaurants can share business details, menu information, and onboarding documents for marketplace registration.",
    points: ["Submit business profile", "Share menu and GST details", "Complete onboarding verification"],
  },
  {
    title: "Delivery Partner Support",
    icon: Truck,
    description:
      "Delivery partners can raise concerns related to routing, payouts, order handoff, and account access through support channels.",
    points: ["Use your delivery support line", "Share order and route details", "Escalate payout or login concerns"],
  },
  {
    title: "Account Management",
    icon: UserRoundCog,
    description:
      "Update profile details, contact information, and access preferences from your account settings when signed in.",
    points: ["Edit phone or name", "Review login access", "Contact support for account issues"],
  },
  {
    title: "Payment Issues",
    icon: CreditCard,
    description:
      "If a payment fails, is debited twice, or remains pending, our team can review the payment trail and help resolve the issue.",
    points: ["Check payment status", "Keep transaction details ready", "Contact support for verification"],
  },
  {
    title: "Wallet and Coupon Issues",
    icon: WalletCards,
    description:
      "For coupon errors, wallet balance concerns, or discount application problems, verify the offer terms before contacting support.",
    points: ["Check coupon validity", "Confirm wallet balance", "Report abnormal deductions"],
  },
  {
    title: "Cancellation Process",
    icon: XCircle,
    description:
      "Cancellation depends on order stage, restaurant preparation progress, and delivery status at the time of request.",
    points: ["Raise cancellation early", "Review status before requesting", "Follow support instructions if the order is already prepared"],
  },
  {
    title: "Customer Support Information",
    icon: BadgeInfo,
    description:
      "Our support team helps with order queries, restaurant coordination, payment review, and general marketplace assistance.",
    points: ["Email support for detailed queries", "Call for urgent issues", "Use the contact center for follow-up"],
  },
];

const faqs = [
  {
    question: "How do I place an order on the platform?",
    answer:
      "Select a restaurant, add menu items to your cart, choose delivery details, and complete checkout. You will receive confirmation once the order is accepted.",
  },
  {
    question: "Can I edit my order after placing it?",
    answer:
      "Edits depend on the restaurant preparation stage. If the kitchen has not started processing the order, support may help with limited changes.",
  },
  {
    question: "How can I track my delivery?",
    answer:
      "Open your order history or active order page to view preparation, dispatch, and delivery progress. If tracking does not update, contact support.",
  },
  {
    question: "Why is my order showing as pending?",
    answer:
      "A pending status usually means the restaurant or payment confirmation is still being processed. In most cases the status updates shortly after verification.",
  },
  {
    question: "What should restaurants submit for onboarding?",
    answer:
      "Restaurants are generally expected to provide business information, menu details, and verification documents required by the operations team.",
  },
  {
    question: "How do delivery partners contact support?",
    answer:
      "Delivery partners should use the designated support phone number or email and include the order ID, route details, and the concern being reported.",
  },
  {
    question: "How do I reset my account information?",
    answer:
      "Sign in to your account profile to update personal information. If access is blocked, support can help verify and restore account access.",
  },
  {
    question: "What if my payment is debited but the order does not appear?",
    answer:
      "Keep the transaction reference and contact support immediately. The team will check whether the order was created or if a payment verification issue occurred.",
  },
  {
    question: "Can I use multiple coupons in one order?",
    answer:
      "Only one valid offer may apply per order unless a promotion explicitly states otherwise. Coupon stacking is restricted by offer rules.",
  },
  {
    question: "Why did my coupon not apply?",
    answer:
      "Common causes include minimum order value, offer expiry, item exclusions, or limited usage counts. Review the offer terms before reattempting.",
  },
  {
    question: "When can I cancel my order?",
    answer:
      "Cancellation is usually possible before the restaurant starts preparation or before dispatch. Once processing is underway, cancellation rights may be limited.",
  },
  {
    question: "What happens if I am unavailable at delivery?",
    answer:
      "If the customer is unavailable, the order may be marked delivered, returned, or closed based on the delivery attempt. Additional charges or restrictions may apply.",
  },
  {
    question: "How do I register my restaurant?",
    answer:
      "Use the business onboarding channel, share your restaurant details, and complete the verification steps requested by the marketplace team.",
  },
  {
    question: "How quickly do support teams respond?",
    answer:
      "Most email queries receive a response within a reasonable business timeframe, while urgent phone queries are handled as quickly as possible.",
  },
  {
    question: "What should I do if the app shows the wrong address?",
    answer:
      "Update the saved address before checkout. If the issue persists, contact support and share the order ID and the correct delivery location.",
  },
  {
    question: "Are payment gateways secure?",
    answer:
      "The platform uses payment integrations with secure processing flows, including Razorpay, to handle transactions and verification.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes. Users can request account deletion through support, subject to verification, legal retention requirements, and active order settlement.",
  },
  {
    question: "What should I do for a delayed order?",
    answer:
      "Check the live status first. If the delay is unusual, contact support with the order ID so the team can investigate and coordinate with the restaurant or delivery partner.",
  },
  {
    question: "Do I get a refund if I change my mind?",
    answer:
      "Refunds are generally not available for change-of-mind requests. Refunds are considered only in specific verified cases described in the refund policy.",
  },
  {
    question: "Where can I find platform policies?",
    answer:
      "You can review the privacy policy, terms and conditions, and refund policy from the footer links on this website.",
  },
];

const contactCards = [
  { icon: Phone, label: "Support Phone", value: "+91 7404133302", href: "tel:+917404133302" },
  { icon: Mail, label: "Support Email", value: "support@justeatbharat.com", href: "mailto:support@justeatbharat.com" },
  { icon: Mail, label: "Business Inquiry Email", value: "business@justeatbharat.com", href: "mailto:business@justeatbharat.com" },
  { icon: Mail, label: "Restaurant Partnership Email", value: "partners@justeatbharat.com", href: "mailto:partners@justeatbharat.com" },
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTopics = useMemo(
    () =>
      supportTopics.filter((topic) => {
        if (!normalizedQuery) return true;
        const haystack = [topic.title, topic.description, ...(topic.points || [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    [normalizedQuery],
  );

  const filteredFaqs = useMemo(
    () =>
      faqs.filter((faq) => {
        if (!normalizedQuery) return true;
        const haystack = `${faq.question} ${faq.answer}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    [normalizedQuery],
  );

  return (
    <LegalPageLayout>
      <SeoMeta
        title="Help Center | Just Eat Bharat"
        description="Find answers about orders, tracking, restaurant onboarding, delivery partner support, payments, coupons, and account assistance."
        path="/help-center"
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
            Support Center
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
            Help Center for orders, accounts, restaurants, and delivery support.
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Search for answers, explore support guides, and contact our team for urgent marketplace assistance.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@justeatbharat.com"
              className="inline-flex items-center justify-center rounded-xl bg-[#F97415] px-5 py-3 text-sm font-semibold text-white hover:bg-[#db640f] transition"
            >
              Contact Support
              <ArrowRight size={16} className="ml-2" />
            </a>
            <a
              href="tel:+917404133302"
              className="inline-flex items-center justify-center rounded-xl border border-[#f0d7c4] bg-white px-5 py-3 text-sm font-semibold text-[#8a4b1e] hover:bg-[#fff7f1] transition"
            >
              Call Now
            </a>
          </div>

          <div className="mt-6 rounded-2xl border border-[#f0d7c4] bg-white/90 p-4 md:p-5 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Search support topics
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search orders, tracking, refunds, coupons, and more"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 md:mb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c85f11]">
              Popular help topics
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
              Start with the most common support requests.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#f0d7c4] bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <ShieldCheck size={16} className="text-[#F97415]" />
            Fast support for all users
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <article
                key={topic.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {topic.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F97415] shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-8 md:mb-12 rounded-3xl border border-[#f0e3d8] bg-[#fffaf7] p-6 md:p-8 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c85f11]">
            Frequently asked questions
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
            Answers to the questions customers ask most often.
          </h2>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="rounded-2xl bg-white border border-border px-4 md:px-6 shadow-sm">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-foreground no-underline hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-[15px] leading-relaxed text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-center text-sm text-muted-foreground">
            No help articles matched your search. Try a broader keyword or contact support directly.
          </div>
        )}
      </section>

      <section className="mb-8 md:mb-12">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c85f11]">
            Contact support
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
            Reach the right team quickly.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.value}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-[#f2ded0] bg-white p-6 md:p-8 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c85f11]">
              Need immediate help?
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">
              Our support team can help with order issues, payments, account access, and restaurant coordination.
            </h2>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              to="/contact"
              className="inline-flex w-full md:w-auto items-center justify-center rounded-xl bg-[#F97415] px-5 py-3 text-sm font-semibold text-white hover:bg-[#db640f] transition"
            >
              Contact Us
            </Link>
            <div className="text-xs text-muted-foreground md:text-right">
              Support responses are handled through verified business channels.
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default HelpCenter;