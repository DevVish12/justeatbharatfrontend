import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const LegalPageLayout = ({ children, mainClassName = "px-4 py-8 md:py-12 max-w-6xl mx-auto" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  );
};

export default LegalPageLayout;