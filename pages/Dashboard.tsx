import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoanApplication, User } from '../types';
import { LoanService } from '../services/mockBackend';
import { Card, Button, Badge } from '../components/UI';
import { PlusCircle, FileText, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      const data = await LoanService.getApplications(false, user.id);
      setApplications(data);
      setLoading(false);
    };
    fetchApps();
  }, [user.id]);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName}</h1>
          <p className="text-gray-500">Track your applications and manage repayments.</p>
        </div>
        <Link to="/apply">
          <Button className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" /> New Application
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-brand-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Applications</p>
              <h3 className="text-3xl font-bold text-gray-900">{applications.length}</h3>
            </div>
            <FileText className="h-8 w-8 text-brand-200" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Next Due Amount</p>
              <h3 className="text-3xl font-bold text-gray-900">₹0</h3>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
          <p className="text-xs text-gray-400 mt-2">No active EMI schedules yet.</p>
        </Card>
        <Card className="p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Disbursed</p>
              <h3 className="text-3xl font-bold text-gray-900">₹0</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-green-200" />
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8">Recent Applications</h2>
      {applications.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-gray-500 mb-4">You haven't applied for any loans yet.</p>
          <Link to="/apply">
            <Button variant="outline">Start Application</Button>
          </Link>
        </Card>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                       <span className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                         {app.productType.charAt(0)}
                       </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-600 truncate">{app.productType}</p>
                      <p className="text-sm text-gray-500">ID: {app.id} • {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge status={app.status} />
                    <p className="text-sm font-semibold text-gray-900">₹{app.amountRequested.toLocaleString()}</p>
                  </div>
                </div>
                {app.comments && (
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <span className="font-semibold">Note:</span> {app.comments}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;