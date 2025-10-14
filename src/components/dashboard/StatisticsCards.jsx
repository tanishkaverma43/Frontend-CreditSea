import React from 'react';
import { Users, FileText, DollarSign, TrendingUp, Briefcase, Building2, PiggyBank, CheckCircle, UserMinus, Banknote } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-credit-sea-green rounded-lg flex items-center justify-center mr-4">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ stats, userRole }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  if (userRole === 'admin') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="ACTIVE USERS"
          value="200"
          icon={Users}
        />
        <StatsCard
          title="BORROWERS"
          value="100"
          icon={UserMinus}
        />
        <StatsCard
          title="CASH DISBURSED"
          value="550,000"
          icon={Banknote}
        />
        <StatsCard
          title="CASH RECEIVED"
          value="1,000,000"
          icon={DollarSign}
        />
        
        <StatsCard
          title="SAVINGS"
          value="450,000"
          icon={PiggyBank}
        />
        <StatsCard
          title="REPAID LOANS"
          value="30"
          icon={CheckCircle}
        />
        <StatsCard
          title="OTHER ACCOUNTS"
          value="10"
          icon={Building2}
        />
        <StatsCard
          title="LOANS"
          value="50"
          icon={FileText}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="LOANS"
        value={formatNumber(stats?.totalLoans || 50)}
        icon={FileText}
      />
      <StatsCard
        title="BORROWERS"
        value={formatNumber(stats?.borrowers || 100)}
        icon={Users}
      />
      <StatsCard
        title="CASH DISBURSED"
        value={formatCurrency(stats?.cashDisbursed || 550000)}
        icon={DollarSign}
      />
      
      <StatsCard
        title="SAVINGS"
        value={formatCurrency(stats?.savings || 450000)}
        icon={PiggyBank}
      />
      <StatsCard
        title="REPAID LOANS"
        value={formatNumber(stats?.repaidLoans || 30)}
        icon={CheckCircle}
      />
      <StatsCard
        title="CASH RECEIVED"
        value={formatCurrency(stats?.cashReceived || 1000000)}
        icon={TrendingUp}
      />
    </div>
  );
};

export default DashboardStats;
