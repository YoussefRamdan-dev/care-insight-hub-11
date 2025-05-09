
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">CareInsight</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/specialties" 
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Specialties
              </Link>
              <Link 
                to="/health-tools" 
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Health Tools
              </Link>
              {currentUser && (
                <>
                  <Link 
                    to="/appointments" 
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Appointments
                  </Link>
                  <Link 
                    to="/laboratories" 
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Laboratories
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={logout} variant="ghost">Logout</Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
