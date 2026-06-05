import { Route, Routes } from "react-router-dom";
import CartPage from "../components/CartPage";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import HelpCenter from "../pages/HelpCenter";
import Index from "../pages/Index";
import JobsCareer from "../pages/JobsCareer";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import TermsConditions from "../pages/TermsConditions";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RequireLogin from "./RequireLogin";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/help-center" element={<HelpCenter />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-and-conditions" element={<TermsConditions />} />
    <Route path="/refund-policy" element={<RefundPolicy />} />
    <Route
      path="/cart"
      element={
        <RequireLogin redirectTo="/cart">
          <CartPage />
        </RequireLogin>
      }
    />
    <Route path="/about" element={<About />} />
    <Route path="/jobs-career" element={<JobsCareer />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route
      path="/user-dashboard"
      element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
