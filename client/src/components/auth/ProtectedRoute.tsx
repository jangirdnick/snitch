import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: Array<'USER' | 'ADMIN'>;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Block rendering entirely while session restore (handleGetMe) is in flight.
  // loading starts as `true` in the Redux initial state, so this spinner shows
  // on the very first synchronous render — before the async /me request settles.
  // This prevents ProtectedRoute from seeing isAuthenticated=false prematurely
  // and firing a redirect before auth is actually resolved.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[oklch(0.09_0_0)]">
        <img
          src="/loading.webp"
          alt="Loading..."
          className="size-24 animate-pulse opacity-80 invert-100 "
        />
      </div>
    );
  }

  // Auth resolved — user is not logged in.
  // Pass `from` so the login page can redirect back to the intended destination.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but wrong role — send to home.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
