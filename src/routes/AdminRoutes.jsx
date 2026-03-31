import { Navigate, Route, Routes } from "react-router-dom";
import AdminCouponForm from "../admin/AdminCouponForm";
import AdminCoupons from "../admin/AdminCoupons";
import AdminOrders from "../admin/AdminOrders";
import { adminRoutePaths, getAdminUrl } from "../admin/adminPaths";
import AdminTables from "../admin/AdminTables";
import ForgotPassword from "../admin/auth/ForgotPassword";
import Login from "../admin/auth/login";
import Register from "../admin/auth/Register";
import ResetPassword from "../admin/auth/ResetPassword";
import ManageContact from "../admin/ContactManage/ManageContact";
import Dashboard from "../admin/Dashboard";
import DishImageManager from "../admin/DishImageManager";
import HeroManage from "../admin/HeroManage";
import ManageJobInfo from "../admin/JobInfoManage/ManageJobInfo";
import NotFound from "../pages/NotFound";

const AdminRoutes = () => (
  <Routes>
    <Route path={adminRoutePaths.register} element={<Register />} />
    <Route path={adminRoutePaths.login} element={<Login />} />
    <Route path={adminRoutePaths.forgotPassword} element={<ForgotPassword />} />
    <Route path={adminRoutePaths.resetPassword} element={<ResetPassword />} />
    <Route path={adminRoutePaths.dashboard} element={<Dashboard />} />
    <Route path={adminRoutePaths.contacts} element={<ManageContact />} />
    <Route path={adminRoutePaths.jobInfo} element={<ManageJobInfo />} />
    <Route path={adminRoutePaths.orders} element={<AdminOrders />} />
    <Route path={adminRoutePaths.tables} element={<AdminTables />} />
    <Route path={adminRoutePaths.coupons} element={<AdminCoupons />} />
    <Route
      path={`${adminRoutePaths.coupons}/new`}
      element={<AdminCouponForm />}
    />
    <Route
      path={`${adminRoutePaths.coupons}/edit/:id`}
      element={<AdminCouponForm />}
    />
    <Route path={adminRoutePaths.heroManage} element={<HeroManage />} />
    <Route path={adminRoutePaths.dishImages} element={<DishImageManager />} />
    <Route path="" element={<LoginRedirect />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const LoginRedirect = () => {
  return <Navigate to={getAdminUrl("login")} replace />;
};

export default AdminRoutes;
