import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-rose-600">WedIndia</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/weddings" className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium">{t('explore', 'Explore Weddings')}</Link>
            
            <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              <Globe className="w-4 h-4 mr-1" />
              <select 
                onChange={changeLanguage} 
                defaultValue={i18n.language}
                className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {t('dashboard', 'Dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {t('logout', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium">{t('login', 'Log in')}</Link>
                <Link to="/register" className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-md text-sm font-medium">Sign up</Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
