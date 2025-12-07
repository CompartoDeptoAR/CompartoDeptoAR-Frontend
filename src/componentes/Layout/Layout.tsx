import Header from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import GlobalLoader from "../../paginas/Loading/GlobalLoader";

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <Header />
      
      <main className="layout-content">
        <Outlet />
        <GlobalLoader /> 
      </main>

      <Footer />
    </div>
  );
}
