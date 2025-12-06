import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, PieChart, LogOut, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';
import { Button } from './UI';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`block px-3 py-2 rounded-md text-base font-medium ${
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <ShieldCheck className="h-8 w-8 text-brand-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">SK Finance</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" label="Products" />
              <NavLink to="/calculator" label="Calculator" />
              
              {user ? (
                <>
                  {user.role === UserRole.ADMIN ? (
                    <NavLink to="/admin" label="Admin Panel" />
                  ) : (
                    <>
                      <NavLink to="/dashboard" label="Dashboard" />
                      <NavLink to="/apply" label="Apply Now" />
                    </>
                  )}
                  <div className="ml-4 flex items-center space-x-2 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-600 hidden lg:inline">{user.fullName}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1 inline" /> Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="ml-4 flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/" label="Products" />
              <NavLink to="/calculator" label="Loan Calculator" />
              {user ? (
                <>
                  {user.role === UserRole.ADMIN ? (
                    <NavLink to="/admin" label="Admin Dashboard" />
                  ) : (
                    <>
                      <NavLink to="/dashboard" label="My Loans" />
                      <NavLink to="/apply" label="Apply for Loan" />
                    </>
                  )}
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <UserIcon className="h-8 w-8 rounded-full bg-gray-100 p-1" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-gray-800">{user.fullName}</div>
                        <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 px-2">
                      <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                        Sign out
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200 px-2 space-y-2">
                   <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <ShieldCheck className="h-6 w-6 text-brand-500" />
                <span className="ml-2 text-xl font-bold">SK Finance</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Empowering your dreams with secure, fast, and transparent financial solutions. From gold to home loans, we are your trusted partner.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Gold Loan</a></li>
                <li><a href="#" className="hover:text-white">Bajaj 2-Wheeler</a></li>
                <li><a href="#" className="hover:text-white">Car Finance</a></li>
                <li><a href="#" className="hover:text-white">Home Loan</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Data Retention</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SK Finance Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;