import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";

const UserRoutes = () => (
  <Routes>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default UserRoutes;
