
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div className="p-8 text-center">Please log in to view the dashboard.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 md:p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
