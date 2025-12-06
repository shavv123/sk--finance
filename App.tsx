import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ApplyLoan from './pages/ApplyLoan';
import AdminPanel from './pages/AdminPanel';
import LoanCalculator from './components/LoanCalculator';
import { User, UserRole } from './types';
import { AuthService } from './services/mockBackend';
import { Card, Button, Input } from './components/UI';
import { MOCK_ADMIN_USER, MOCK_DEMO_USER } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Simple Login Page Component
const Login: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = await AuthService.login(email);
    setLoading(false);
    onLogin(user);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input label="Password" type="password" required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-bold mb-1">Demo Credentials:</p>
          <div className="flex justify-between mb-1">
            <span>User:</span> 
            <button className="text-brand-600 underline" onClick={() => setEmail(MOCK_DEMO_USER.email)}>{MOCK_DEMO_USER.email}</button>
          </div>
          <div className="flex justify-between">
            <span>Admin:</span> 
            <button className="text-brand-600 underline" onClick={() => setEmail(MOCK_ADMIN_USER.email)}>{MOCK_ADMIN_USER.email}</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null; role?: UserRole }> = ({ children, user, role }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<LoanCalculator />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          
          {/* Reuse Login for Register just for demo simplicity */}
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user!} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/apply" 
            element={
              <ProtectedRoute user={user}>
                <ApplyLoan user={user!} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} role={UserRole.ADMIN}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<div className="text-center py-20 text-gray-500">404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;