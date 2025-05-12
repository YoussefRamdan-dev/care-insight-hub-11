
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  FileText,
  Menu,
  MessageSquare,
  Settings,
  User,
  LogOut,
  ChevronDown,
  BookOpen
} from 'lucide-react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  const navigationItems = currentUser ? [
    { path: '/dashboard', label: 'Dashboard', icon: <FileText className="h-4 w-4" /> },
    { path: '/appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" /> },
    ...(currentUser.role === 'patient' ? [{ path: '/specialties', label: 'Specialties', icon: <FileText className="h-4 w-4" /> }] : []),
    { path: '/healthy-talk', label: 'Healthy Talk', icon: <BookOpen className="h-4 w-4" /> },
    { path: '/messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              CareInsight
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser && navigationItems.map((item) => (
              <Button 
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`px-3 py-2 text-sm ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-1">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Button>
            ))}

            {!currentUser && navigationItems.map((item) => (
              <Button 
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`px-3 py-2 text-sm ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* User Menu (if logged in) */}
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                      {currentUser.profileImage ? (
                        <img 
                          src={currentUser.profileImage} 
                          alt={currentUser.name} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <span className="text-primary-dark font-semibold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            {/* Login/Register buttons (if not logged in) */}
            {!currentUser && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-primary text-white hover:bg-primary-dark"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && currentUser && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Button 
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`justify-start w-full ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600'}`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Button>
              ))}
              <Button 
                variant="ghost" 
                className="justify-start w-full text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
