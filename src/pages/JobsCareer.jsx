import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { submitJobApplication } from "@/services/jobService";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Clock3,
  HeartHandshake,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description:
      "Clear growth paths, structured mentorship, and internal promotions to accelerate your career.",
  },
  {
    icon: Users,
    title: "Supportive Team",
    description:
      "Collaborative work culture where respect, learning, and teamwork are part of daily operations.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Compensation",
    description:
      "Attractive salary packages with performance-linked incentives and role-based rewards.",
  },
];

const openRoles = [
  { title: "Commis / Chef", type: "Full Time", location: "Zirakpur" },
  { title: "Delivery Executive", type: "Shift Based", location: "Tricity" },
  { title: "Restaurant Manager", type: "Full Time", location: "Zirakpur" },
];

const hiringSteps = [
  {
    icon: BriefcaseBusiness,
    title: "Application Review",
    text: "Our hiring team reviews your profile and checks fit for active roles.",
  },
  {
    icon: HeartHandshake,
    title: "Interview Process",
    text: "Shortlisted candidates are invited for a practical and culture-fit discussion.",
  },
  {
    icon: Clock3,
    title: "Quick Onboarding",
    text: "Selected candidates receive role briefing and onboarding support to start smoothly.",
  },
];

const JobsCareer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await submitJobApplication({
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        resumeFile,
      });

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", position: "" });
      setResumeFile(null);
    } catch (error) {
      setSubmitError(error?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
              Careers At Just Eat Bharat
            </span>

            <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight mt-4">
              Build your career with a team that values speed, quality, and
              people.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-4 max-w-2xl">
              Join one of the fastest-growing food brands in the region and work
              in an environment where learning, ownership, and customer
              experience come first.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#f0d7c4] px-3 py-1.5 text-muted-foreground">
                <MapPin size={14} className="text-[#F97415]" />
                Zirakpur and Tricity
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#f0d7c4] px-3 py-1.5 text-muted-foreground">
                <Sparkles size={14} className="text-[#F97415]" />
                Kitchen, Delivery, Operations
              </span>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="grid gap-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article
                    key={benefit.title}
                    className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415] shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <article className="rounded-2xl border border-[#f0e3d8] bg-[#fffaf7] p-5 md:p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                Open Roles
              </h2>
              <div className="space-y-3">
                {openRoles.map((role) => (
                  <div
                    key={role.title}
                    className="rounded-xl border border-[#f2dfd1] bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {role.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.location}
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-[#fff3e9] text-[#a45217] text-xs font-semibold px-3 py-1">
                      {role.type}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Application Form */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-3xl shadow-md p-6 md:p-7">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Apply Now
              </h2>

              {submitted ? (
                <div className="text-center py-7">
                  <h3 className="text-lg font-semibold mb-2">
                    Application Submitted
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Thank you for applying. Our HR team will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-semibold text-red-700">
                        {submitError}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Position Applying For
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Chef / Delivery Executive / Manager"
                      value={form.position}
                      onChange={(e) =>
                        setForm({ ...form, position: e.target.value })
                      }
                      className="w-full border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Upload Resume
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setResumeFile(e.target.files?.[0] || null)
                      }
                      className="w-full border border-border rounded-xl px-3 py-2.5 bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            Our Hiring Process
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {hiringSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-2xl border border-border bg-[#fafafa] p-5"
                >
                  <Icon size={20} className="text-[#F97415] mb-3" />
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobsCareer;
