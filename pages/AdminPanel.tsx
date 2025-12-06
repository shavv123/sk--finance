import React, { useEffect, useState } from 'react';
import { LoanService } from '../services/mockBackend';
import { LoanApplication, KPIStats, ApplicationStatus } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, Eye } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState<KPIStats | null>(null);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  const fetchData = async () => {
    const [applications, kpi] = await Promise.all([
      LoanService.getApplications(true),
      LoanService.getStats()
    ]);
    setApps(applications);
    setStats(kpi);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (id: string, status: ApplicationStatus, comment: string) => {
    await LoanService.updateStatus(id, status, comment);
    setSelectedApp(null);
    fetchData(); // refresh
  };

  const chartData = [
    { name: 'Mon', apps: 4 },
    { name: 'Tue', apps: 7 },
    { name: 'Wed', apps: 3 },
    { name: 'Thu', apps: 8 },
    { name: 'Fri', apps: 12 },
    { name: 'Sat', apps: 5 },
    { name: 'Sun', apps: 2 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4 bg-blue-50 border-l-4 border-blue-600">
            <p className="text-sm text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeLoans}</p>
          </Card>
          <Card className="p-4 bg-green-50 border-l-4 border-green-600">
            <p className="text-sm text-gray-500">Disbursed (Total)</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalDisbursed.toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-purple-50 border-l-4 border-purple-600">
            <p className="text-sm text-gray-500">New Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.newApplications}</p>
          </Card>
          <Card className="p-4 bg-red-50 border-l-4 border-red-600">
            <p className="text-sm text-gray-500">Overdue %</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overduePercentage}%</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Application Queue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Applicant</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {apps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{app.userName}</td>
                      <td className="px-6 py-4">{app.productType}</td>
                      <td className="px-6 py-4">₹{app.amountRequested.toLocaleString()}</td>
                      <td className="px-6 py-4"><Badge status={app.status} /></td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {apps.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h3 className="font-semibold text-gray-800 mb-4">Weekly Applications</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="apps" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Review Modal (Mocked inline) */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg p-6 animate-fade-in">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Review Application</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <div className="space-y-2 mb-6 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-500">ID:</span> <span>{selectedApp.id}</span>
                <span className="text-gray-500">Applicant:</span> <span>{selectedApp.userName}</span>
                <span className="text-gray-500">Product:</span> <span>{selectedApp.productType}</span>
                <span className="text-gray-500">Amount:</span> <span>₹{selectedApp.amountRequested.toLocaleString()}</span>
                <span className="text-gray-500">Tenure:</span> <span>{selectedApp.tenureMonths} Months</span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded text-center text-xs text-gray-500">
                Documents: PAN, Aadhar, Bank Statement (Verified Automated Check)
              </div>
            </div>

            <div className="flex gap-3">
              {selectedApp.status === ApplicationStatus.SUBMITTED ? (
                <>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={() => handleDecision(selectedApp.id, ApplicationStatus.APPROVED, "Approved by Admin")}
                  >
                    <Check className="h-4 w-4 mr-2 inline" /> Approve
                  </Button>
                  <Button 
                    variant="danger" 
                    className="flex-1"
                    onClick={() => handleDecision(selectedApp.id, ApplicationStatus.REJECTED, "Low Credit Score")}
                  >
                    <X className="h-4 w-4 mr-2 inline" /> Reject
                  </Button>
                </>
              ) : (
                <div className="w-full text-center text-gray-500 py-2 border rounded">
                  Status: {selectedApp.status}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;