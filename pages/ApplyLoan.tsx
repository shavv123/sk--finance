import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoanProductType } from '../types';
import { LOAN_PRODUCTS } from '../constants';
import { LoanService } from '../services/mockBackend';
import { Card, Button, Input } from '../components/UI';
import { Upload, Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface ApplyLoanProps {
  user: User;
}

const steps = ['Product & Amount', 'Personal Details', 'Documents', 'Review'];

const ApplyLoan: React.FC<ApplyLoanProps> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productType: LoanProductType.GOLD,
    amountRequested: 50000,
    tenureMonths: 12,
    dob: '',
    address: '',
    pan: '',
    aadhar: '',
    income: '',
  });

  const selectedProduct = LOAN_PRODUCTS.find(p => p.type === formData.productType) || LOAN_PRODUCTS[0];

  const handleNext = () => setCurrentStep(p => p + 1);
  const handleBack = () => setCurrentStep(p => p - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    await LoanService.createApplication({
      userId: user.id,
      userName: user.fullName,
      ...formData,
      documents: [
        { name: 'pan_card.jpg', type: 'image/jpeg', url: '#' },
        { name: 'aadhar_front.jpg', type: 'image/jpeg', url: '#' }
      ]
    });
    setSubmitting(false);
    navigate('/dashboard');
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        {steps.map((label, idx) => (
          <div key={label} className="flex flex-col items-center bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${
              idx <= currentStep ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span className={`text-xs ${idx <= currentStep ? 'text-brand-600 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Loan Application</h1>
        <p className="text-gray-500">Complete the steps below to apply for a new loan.</p>
      </div>

      {renderStepIndicator()}

      <Card className="p-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Select Product & Terms</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LOAN_PRODUCTS.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setFormData({...formData, productType: p.type})}
                    className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
                      formData.productType === p.type ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <span className="font-semibold text-gray-900">{p.type}</span>
                    <span className="text-xs text-gray-500 mt-1">Rate: {p.interestRateBase}%</span>
                  </div>
                ))}
              </div>
            </div>

            <Input 
              label="Amount Requested (₹)"
              type="number"
              value={formData.amountRequested}
              onChange={(e) => setFormData({...formData, amountRequested: Number(e.target.value)})}
            />

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Months): {formData.tenureMonths}</label>
               <input 
                 type="range"
                 min={selectedProduct.minTenureMonths}
                 max={selectedProduct.maxTenureMonths}
                 value={formData.tenureMonths}
                 onChange={(e) => setFormData({...formData, tenureMonths: Number(e.target.value)})}
                 className="w-full"
               />
               <div className="flex justify-between text-xs text-gray-500 mt-1">
                 <span>{selectedProduct.minTenureMonths}m</span>
                 <span>{selectedProduct.maxTenureMonths}m</span>
               </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Personal Details (KYC)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={user.fullName} disabled className="bg-gray-50" />
              <Input label="Date of Birth" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              <Input label="PAN Number" placeholder="ABCDE1234F" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} />
              <Input label="Aadhar Number" placeholder="1234 5678 9012" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} />
              <Input label="Annual Income (₹)" type="number" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" 
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
            <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-700 mb-4">
              Securely upload your KYC documents. Max size 5MB. Formats: JPG, PDF.
            </div>
            
            <div className="space-y-4">
              {['PAN Card', 'Aadhar Front', 'Aadhar Back', 'Income Proof', 'Address Proof'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="bg-brand-100 p-2 rounded-full mr-3">
                      <Upload className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">Required</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert("Simulating upload...")}>Select File</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span className="font-medium">{formData.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">₹{formData.amountRequested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tenure:</span>
                <span className="font-medium">{formData.tenureMonths} Months</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-medium">{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PAN:</span>
                <span className="font-medium">{formData.pan || 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2" required />
              <p className="text-xs text-gray-500">
                I hereby declare that the information provided is true and correct. I authorize SK Finance to verify my documents and conduct necessary credit checks.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button 
            variant="secondary" 
            onClick={handleBack} 
            disabled={currentStep === 0 || submitting}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ChevronLeft className="h-4 w-4 mr-1 inline" /> Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-1 inline" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ApplyLoan;