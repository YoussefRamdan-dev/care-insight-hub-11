
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, MessageSquare, Settings, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!currentUser) {
    return <div className="p-8 text-center">Please log in to view the dashboard.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                {currentUser.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-primary-dark font-semibold text-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{currentUser.name}</p>
                <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {isMobile ? (
            <div className="flex overflow-x-auto p-2 border-t border-b border-gray-200">
              <Button 
                variant="ghost" 
                className="flex flex-col items-center px-4 py-3 min-w-[80px]"
                onClick={() => navigate('/dashboard')}
              >
                <FileText size={20} />
                <span className="text-xs mt-1">Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center px-4 py-3 min-w-[80px]"
                onClick={() => navigate('/appointments')}
              >
                <Calendar size={20} />
                <span className="text-xs mt-1">Appointments</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center px-4 py-3 min-w-[80px]"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare size={20} />
                <span className="text-xs mt-1">Messages</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center px-4 py-3 min-w-[80px]"
                onClick={() => navigate('/profile')}
              >
                <User size={20} />
                <span className="text-xs mt-1">Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center px-4 py-3 min-w-[80px]"
                onClick={() => navigate('/settings')}
              >
                <Settings size={20} />
                <span className="text-xs mt-1">Settings</span>
              </Button>
            </div>
          ) : (
            <nav className="mt-2">
              <Button 
                variant="ghost" 
                className="flex items-center w-full px-6 py-3 text-left"
                onClick={() => navigate('/dashboard')}
              >
                <FileText size={18} className="mr-3" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="flex items-center w-full px-6 py-3 text-left"
                onClick={() => navigate('/appointments')}
              >
                <Calendar size={18} className="mr-3" />
                Appointments
              </Button>
              <Button 
                variant="ghost" 
                className="flex items-center w-full px-6 py-3 text-left"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare size={18} className="mr-3" />
                Messages
              </Button>
              <Button 
                variant="ghost" 
                className="flex items-center w-full px-6 py-3 text-left"
                onClick={() => navigate('/profile')}
              >
                <User size={18} className="mr-3" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="flex items-center w-full px-6 py-3 text-left"
                onClick={() => navigate('/settings')}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </Button>
            </nav>
          )}
        </aside>

        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
