import Header from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Header/>
       <main className="container my-4">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}
