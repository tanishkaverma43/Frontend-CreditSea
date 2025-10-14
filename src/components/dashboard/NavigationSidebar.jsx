import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/UserContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  PieChart,
  Settings,
  Calendar,
  Briefcase,
  TrendingUp,
  Shield,
  UserPlus,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'verifier'] },
    { name: 'Borrowers', href: '/borrowers', icon: Users, roles: ['admin', 'verifier'] },
    { name: 'Loans', href: '/loans', icon: FileText, roles: ['admin', 'verifier'] },
    { name: 'Repayments', href: '/repayments', icon: DollarSign, roles: ['admin', 'verifier'] },
    { name: 'Loan Parameters', href: '/loan-parameters', icon: Settings, roles: ['admin', 'verifier'] },
    { name: 'Accounting', href: '/accounting', icon: PieChart, roles: ['admin', 'verifier'] },
    { name: 'Reports', href: '/reports', icon: TrendingUp, roles: ['admin', 'verifier'] },
    { name: 'Collateral', href: '/collateral', icon: Shield, roles: ['admin', 'verifier'] },
    { name: 'Access Configuration', href: '/access-config', icon: Shield, roles: ['admin', 'verifier'] },
    { name: 'Savings', href: '/savings', icon: Briefcase, roles: ['admin', 'verifier'] },
    { name: 'Other Incomes', href: '/other-incomes', icon: TrendingUp, roles: ['admin'] },
    { name: 'Payroll', href: '/payroll', icon: Users, roles: ['admin'] },
    { name: 'Expenses', href: '/expenses', icon: DollarSign, roles: ['admin', 'verifier'] },
    { name: 'E-signature', href: '/e-signature', icon: FileText, roles: ['admin', 'verifier'] },
    { name: 'Investor Accounts', href: '/investor-accounts', icon: TrendingUp, roles: ['admin', 'verifier'] },
    { name: 'Calendar', href: '/calendar', icon: Calendar, roles: ['admin', 'verifier'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'verifier'] }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex flex-col h-full text-white" style={{ backgroundColor: '#132E1A' }}>
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-credit-sea-green font-semibold text-lg">
              {user?.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-base font-medium text-green-100">{user?.username}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isCurrentPage = isActive(item.href);
          return (
            <div key={item.name} className="border-b border-gray-600">
              <Link
                to={item.href}
                className={`group flex items-center px-6 py-4 text-base font-medium transition-colors duration-150 ${
                  isCurrentPage
                    ? 'text-white'
                    : 'text-green-100 hover:text-white'
                }`}
                style={{
                  backgroundColor: isCurrentPage ? '#2D5A3D' : 'transparent'
                }}
              >
                <item.icon
                  className={`mr-4 h-6 w-6 ${
                    isCurrentPage ? 'text-white' : 'text-green-300 group-hover:text-white'
                  }`}
                />
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-600">
        <button
          onClick={logout}
          className="group flex items-center w-full px-6 py-4 text-base font-medium text-green-100 hover:text-white transition-colors duration-150"
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2D5A3D'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <LogOut className="mr-4 h-6 w-6 text-green-300 group-hover:text-white" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
