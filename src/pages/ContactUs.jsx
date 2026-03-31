import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { submitContactMessage } from "@/services/contactService";
import { Clock, Headset, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";

const contactCards = [
  {
    icon: Phone,
    title: "Phone Support",
    content: ["+91 7404133302", "+91 7404233302"],
    note: "Available 24/7",
  },
  {
    icon: Mail,
    title: "Email",
    content: ["support@justeatbharat.com"],
    note: "Response within 24 hours",
  },
  {
    icon: MapPin,
    title: "Address",
    content: [
      "SCO 126A, Ground Floor, Near SBI Bank, Opp. Gurudwara Singh Sabha",
      "Zirakpur, Punjab - 140603",
    ],
    note: "Punjab, India",
  },
  {
    icon: Clock,
    title: "Opening Hours",
    content: ["11:00 AM - 04:00 AM"],
    note: "Open 7 days a week",
  },
];

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "Visit our menu page, add items to cart, and complete checkout. Most orders are delivered within about 45 minutes.",
  },
  {
    question: "What are your delivery charges?",
    answer:
      "Delivery is INR 30 for orders below INR 299. Orders above INR 299 are eligible for free delivery.",
  },
  {
    question: "Do you offer replacement for damaged food?",
    answer:
      "Yes. If your order arrives damaged or incorrect, contact support immediately for fast resolution.",
  },
  {
    question: "Which payment methods are available?",
    answer:
      "We accept UPI, major debit and credit cards, and popular digital wallets.",
  },
];

const ContactUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSubmitError(error?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="px-4 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Hero */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#f2ded0] p-6 md:p-10 mb-8 md:mb-12"
          style={{
            background:
              "linear-gradient(120deg, rgba(249,116,21,0.12) 0%, rgba(249,116,21,0.04) 45%, rgba(255,255,255,1) 100%)",
          }}
        >
          <div className="absolute -top-20 -right-14 h-48 w-48 rounded-full bg-[#F97415]/10 blur-2xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-[#f6d6bf] bg-white px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#c85f11] uppercase">
              Contact Just Eat Bharat
            </span>

            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight mt-4">
              We are here to help with your orders, feedback, and support.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-4 max-w-2xl">
              Reach out anytime. Whether it is a delivery concern, payment
              issue, or general query, our team responds quickly and clearly.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#f0d7c4] px-3 py-1.5 text-muted-foreground">
                <Headset size={14} className="text-[#F97415]" />
                24/7 Support
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#f0d7c4] px-3 py-1.5 text-muted-foreground">
                <ShieldCheck size={14} className="text-[#F97415]" />
                Fast Resolution
              </span>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.02fr_0.98fr] gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-4 h-fit">
            {contactCards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415] mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <div className="space-y-1">
                    {item.content.map((line) => (
                      <p
                        key={line}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground/90 mt-3">
                    {item.note}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Contact Form */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl border border-[#f0e3d8] bg-[#fffaf7] p-6 md:p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-5">
                Send us a Message
              </h2>

              {submitted && (
                <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm font-semibold">
                    Thank you. Your message has been sent successfully.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-semibold">
                    {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    required
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    required
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                    required
                    placeholder="Write your message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </aside>
        </section>

        {/* FAQ */}
        <section className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-5">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-border bg-[#fafafa] p-5"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
