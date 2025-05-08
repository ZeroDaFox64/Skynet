import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "./routes/routes";
import AdminLayout from "./layouts/adminLayout";
import UserLayout from "./layouts/userLayout";
import Home from "./pages/landing/home";
import Crunchy from "./pages/landing/crunchyroll";
import Profile from "./pages/user/profile";
import Dashboard from "./pages/admin/dashboard";
import Subscriptions from "./pages/user/subscription";
import LinkTree from "./pages/landing/linkTree";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import NotFound from "./pages/notFound";
import Otp from "./pages/auth/otp";
import View from "./pages/admin/options/view";
import Add from "./pages/admin/options/add";
import Update from "./pages/admin/options/update";
import ViewAccount from "./pages/admin/options_custom/viewAccount";
import ViewSubscription from "./pages/admin/options_custom/viewSubscription";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Terms from "./pages/landing/terms";
import { Toaster } from "sonner";
import Cookies from "./components/landing/Cookies";
import "./index.css";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Cookies />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="*" element={<NotFound />} />
          <Route path={ROUTES.LINK_TREE} element={<LinkTree />} />
          <Route
            path={`/${ROUTES.AUTH}/${ROUTES.LOGIN}`}
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

          <Route element={<UserLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.CRUNCHYROLL} element={<Crunchy />} />
            <Route path={`/${ROUTES.TERMS}`} element={<Terms />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.SUBSCRIPTIONS} element={<Subscriptions />} />
            </Route>
            <Route path={`/${ROUTES.AUTH}/${ROUTES.OTP}`} element={<Otp />} />
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={`/${ROUTES.VIEW}`} element={<View />} />
              <Route path={`/${ROUTES.CREATE}`} element={<Add />} />
              <Route path={`/${ROUTES.UPDATE}`} element={<Update />} />
              <Route
                path={`/${ROUTES.VIEW_ACCOUNT}`}
                element={<ViewAccount />}
              />
              <Route
                path={`/${ROUTES.VIEW_SUBSCRIPTION}`}
                element={<ViewSubscription />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
