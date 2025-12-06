import React, { useState, useEffect } from 'react';
import { calculateEMI, generateAmortizationSchedule } from '../services/mockBackend';
import { LOAN_PRODUCTS } from '../constants';
import { LoanProductType, EMIScheduleItem } from '../types';
import { Button, Input, Card } from './UI';
import { Calculator, Download } from 'lucide-react';

const LoanCalculator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(LOAN_PRODUCTS[0]);
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);
  const [schedule, setSchedule] = useState<EMIScheduleItem[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Recalculate when inputs change
    const calculatedEmi = calculateEMI(amount, selectedProduct.interestRateBase, tenure);
    setEmi(calculatedEmi);
  }, [amount, tenure, selectedProduct]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = LOAN_PRODUCTS.find(p => p.id === e.target.value);
    if (product) {
      setSelectedProduct(product);
      // Reset tenure to within bounds
      setTenure(Math.max(product.minTenureMonths, Math.min(product.maxTenureMonths, tenure)));
    }
  };

  const handleGenerateSchedule = () => {
    const sched = generateAmortizationSchedule(amount, selectedProduct.interestRateBase, tenure);
    setSchedule(sched);
    setShowSchedule(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-6 h-full">
          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-brand-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">EMI Calculator</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                value={selectedProduct.id}
                onChange={handleProductChange}
              >
                {LOAN_PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.type}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Interest Rate: {selectedProduct.interestRateBase}% p.a.</p>
            </div>

            <Input 
              label="Loan Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={10000}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Months)</label>
              <input 
                type="range" 
                min={selectedProduct.minTenureMonths} 
                max={selectedProduct.maxTenureMonths}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{selectedProduct.minTenureMonths}m</span>
                <span className="font-semibold text-brand-700">{tenure} Months</span>
                <span>{selectedProduct.maxTenureMonths}m</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Monthly EMI</span>
                <span className="text-2xl font-bold text-brand-700">₹{emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Interest</span>
                <span className="text-gray-900 font-medium">₹{((emi * tenure) - amount).toLocaleString()}</span>
              </div>
            </div>

            <Button onClick={handleGenerateSchedule} className="w-full">
              View Schedule
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {showSchedule ? (
          <Card className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Amortization Schedule</h3>
              <Button variant="outline" size="sm" onClick={() => alert("Simulating PDF Download...")}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
            <div className="overflow-auto flex-grow max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((row) => (
                    <tr key={row.installmentNo} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{row.installmentNo}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">₹{row.principalComponent.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">₹{row.interestComponent.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">₹{row.totalPayment.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">₹{row.outstandingBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            <Calculator className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-lg">Enter loan details and click "View Schedule"</p>
            <p className="text-sm">to see the detailed breakdown of payments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;