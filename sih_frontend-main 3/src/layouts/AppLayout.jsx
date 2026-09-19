import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';

export default function AppLayout() {
  return (
    <div className="dashboard-light light-theme flex h-screen bg-[#f8f9fb] text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#f8f9fb]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
