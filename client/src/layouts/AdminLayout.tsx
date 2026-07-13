import { Outlet } from 'react-router';

export default function AdminLayout() {
  return (
    <div className="layout-root">
      <main className="layout-main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
