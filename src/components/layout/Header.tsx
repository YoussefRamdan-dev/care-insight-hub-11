
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            CareInsight
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {currentUser ? (
            <>
              <Button 
                variant="link" 
                className="text-gray-600 hover:text-primary"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="link" 
                className="text-gray-600 hover:text-primary"
                onClick={() => navigate('/appointments')}
              >
                Appointments
              </Button>
              {currentUser.role === 'patient' && (
                <Button 
                  variant="link" 
                  className="text-gray-600 hover:text-primary"
                  onClick={() => navigate('/specialties')}
                >
                  Specialties
                </Button>
              )}
              <Button 
                variant="link" 
                className="text-gray-600 hover:text-primary"
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="link" 
                className="text-gray-600 hover:text-primary"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                variant="link" 
                className="text-gray-600 hover:text-primary"
                onClick={() => navigate('/about')}
              >
                About
              </Button>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
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
              </div>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
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
    </header>
  );
}
