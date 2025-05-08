import { Outlet } from "react-router";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
