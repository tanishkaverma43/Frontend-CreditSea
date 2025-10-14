import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

const LoanApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    loanAmount: '',
    loanTenure: '',
    loanReason: '',
    employmentStatus: '',
    employmentAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!termsAccepted || !privacyAccepted) {
      setError('Please accept the terms and conditions and privacy policy');
      return;
    }

    const amount = parseFloat(formData.loanAmount);
    const term = parseInt(formData.loanTenure);
    
    if (isNaN(amount) || amount < 1000) {
      setError('Loan amount must be at least 1000');
      return;
    }
    
    if (isNaN(term) || term < 6) {
      setError('Loan tenure must be at least 6 months');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const applicationData = {
        fullName: formData.fullName,
        loanAmount: Math.max(parseFloat(formData.loanAmount) || 1000, 1000),
        loanTenure: Math.max(parseInt(formData.loanTenure) || 6, 6),
        loanReason: formData.loanReason,
        employmentStatus: formData.employmentStatus,
        employmentAddress: formData.employmentAddress
      };

      const response = await apiClient.submitLoanApplication(applicationData);
      console.log('Loan application submitted successfully:', response);
      
      setFormData({
        fullName: '',
        loanAmount: '',
        loanTenure: '',
        loanReason: '',
        employmentStatus: '',
        employmentAddress: ''
      });
      setTermsAccepted(false);
      setPrivacyAccepted(false);
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error submitting loan application:', error);
      setError(error.message || 'Failed to submit application. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">APPLY FOR A LOAN</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name as it appears on bank account
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name as it appears on bank account"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan tenure (in months)
                </label>
                <input
                  type="number"
                  name="loanTenure"
                  value={formData.loanTenure}
                  onChange={handleChange}
                  placeholder="Loan tenure (in months) (Minimum: 6)"
                  min="6"
                  max="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for loan
                </label>
                <textarea
                  name="loanReason"
                  value={formData.loanReason}
                  onChange={handleChange}
                  placeholder="Reason for loan"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much do you need?
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder="How much do you need? (Minimum: 1000)"
                  min="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment status
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment address
                </label>
                <input
                  type="text"
                  name="employmentAddress"
                  value={formData.employmentAddress}
                  onChange={handleChange}
                  placeholder="Employment address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read the important information and accept that by completing the application I will be bound by the terms
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other, credit reporting agencies.
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading || !termsAccepted || !privacyAccepted}
              className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationModal;
