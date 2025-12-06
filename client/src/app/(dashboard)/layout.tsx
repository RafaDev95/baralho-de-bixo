import { ProtectedRoute } from '../../components/auth/protected-route';
import { Nav } from '../../components/layout/nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-mystic-dark text-white">
        <Nav />
        <main className="flex-1 bg-mystic-dark">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
