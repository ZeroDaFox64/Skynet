import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "./routes/routes";
// import UserLayout from "./layouts/userLayout";
import Home from "./pages/landing/home";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import NotFound from "./pages/notFound";
import Otp from "./pages/auth/otp";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { Toaster } from "sonner";
import "./index.css";
import Dashboard from "./components/admin/adminNav";
import Update from "./pages/admin/options/update";
import Add from "./pages/admin/options/add";
import View from "./pages/admin/options/view";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="*" element={<NotFound />} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route
            path={`/${ROUTES.LOGIN}`}
            element={<LoginPage />}
          />
          <Route
            path={`/${ROUTES.AUTH}/${ROUTES.REGISTER}`}
            element={<RegisterPage />}
          />
          <Route
            path={`/${ROUTES.AUTH}/${ROUTES.FORGOT_PASSWORD}`}
            element={<ForgotPassword />}
          />
          <Route
            path={`/${ROUTES.AUTH}/${ROUTES.FORGOT_PASSWORD}/:token`}
            element={<ResetPassword />}
          />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={`/${ROUTES.VIEW}`} element={<View />} />
            <Route path={`/${ROUTES.UPDATE}`} element={<Update />} />
            <Route path={`/${ROUTES.CREATE}`} element={<Add />} />
            <Route path={`/${ROUTES.AUTH}/${ROUTES.OTP}`} element={<Otp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
