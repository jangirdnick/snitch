import { Outlet } from 'react-router';
import { Navbar } from '@/components/navbar/Navbar';

export default function RootLayout() {
  return (
    <div className="layout-root dark">
      <Navbar />
      <main className="layout-main dark" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
