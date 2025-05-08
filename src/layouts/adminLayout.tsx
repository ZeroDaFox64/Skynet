import { Outlet } from "react-router";
import AdminNav from "../components/admin/adminNav";

export default function App() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
}
