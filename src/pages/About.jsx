import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  Award,
  Clock3,
  HandPlatter,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every dish is prepared with fresh ingredients and strict quality checks.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "We improve continuously based on customer feedback and service insights.",
  },
  {
    icon: Utensils,
    title: "Culinary Excellence",
    description:
      "Our chefs balance consistency, flavor, and presentation in every order.",
  },
];

const stats = [
  { value: "500+", label: "Orders Daily" },
  { value: "50+", label: "Menu Items" },
  { value: "4.8", label: "Customer Rating" },
  { value: "45 Min", label: "Avg Delivery" },
];

const process = [
  {
    icon: HandPlatter,
    title: "Curated Menus",
    text: "Balanced options for everyday meals, comfort cravings, and special moments.",
  },
  {
    icon: Sparkles,
    title: "Fresh Preparation",
    text: "Hygienic kitchen process with carefully sourced ingredients and consistency checks.",
  },
  {
    icon: Clock3,
    title: "Reliable Delivery",
    text: "Fast dispatch and dependable handoff so your food arrives warm and on time.",
  },
];

const About = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#f2ded0] p-6 md:p-10 mb-10 md:mb-14"
          style={{
            background:
              "linear-gradient(120deg, rgba(249,116,21,0.12) 0%, rgba(249,116,21,0.04) 45%, rgba(255,255,255,1) 100%)",
          }}
        >
          <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#F97415]/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#f6d6bf] bg-white px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[#c85f11] uppercase">
                Who We Are
              </span>

              <h1 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight mt-4">
                About Just Eat Bharat
              </h1>

              <p className="text-muted-foreground leading-relaxed mt-4 max-w-xl">
                We deliver restaurant-quality food with authentic taste and
                dependable service. Our team works every day to make ordering
                simple, food consistent, and every meal worth remembering.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-xl bg-[#F97415] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#db640f] transition"
                >
                  Explore Menu
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-xl border border-[#f0cdb4] bg-white px-5 py-2.5 text-sm font-semibold text-[#8a4b1e] hover:bg-[#fff7f1] transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#f2e4d8] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-center rounded-2xl bg-[#fff7f1] border border-[#f4dfcf] p-6 mb-5">
                <img
                  src="/logo.png"
                  alt="Just Eat Bharat Logo"
                  className="w-28 h-28 md:w-32 md:h-32 object-contain"
                />
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[#F97415] mt-0.5 shrink-0"
                  />
                  Hygienic preparation and carefully managed quality standards.
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[#F97415] mt-0.5 shrink-0"
                  />
                  Trained kitchen and delivery teams focused on consistency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-14">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Just Eat Bharat began with one clear mission: make authentic,
              high-quality meals accessible across the city. What started as a
              focused kitchen operation has grown into a trusted food
              destination for families, professionals, and students.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to combine fresh ingredients, strong kitchen
              standards, and fast delivery to provide a reliable food experience
              every single day.
            </p>
          </article>

          <article className="rounded-3xl border border-[#f0e3d8] bg-[#fffaf7] p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              What Makes Us Different
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F97415]" />
                Consistent taste built on repeatable kitchen processes.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F97415]" />
                Quick delivery flow designed for peak-hour reliability.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F97415]" />
                Customer-first support with practical, fast resolution.
              </li>
            </ul>
          </article>
        </section>

        {/* Values */}
        <section className="mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3e9] text-[#F97415] mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 md:mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-[#f1e1d4] bg-white text-center p-5 shadow-sm"
              >
                <p className="text-2xl md:text-3xl font-semibold text-[#F97415]">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-10 md:mb-14 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">
            How We Work
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {process.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-2xl bg-[#fafafa] border border-border p-5"
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

        {/* Team */}
        <section className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Our Team</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Behind every order is a focused team of chefs, delivery partners,
            and support staff working together to create a smooth and satisfying
            food experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our promise is simple: serve delicious food quickly, safely, and
            with consistency you can trust.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
