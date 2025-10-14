import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/UserContext';
import { apiClient } from '../utils/apiClient';
import NavigationSidebar from '../components/dashboard/NavigationSidebar';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import LoanTable from '../components/dashboard/LoanTable';
import { Bell, Menu, X, LogOut, User, Settings, ChevronDown, ArrowUpDown, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await apiClient.getDashboardStats();
      console.log('Stats response:', statsResponse);
      setStats(statsResponse.stats || {});

      const applicationsResponse = await apiClient.getLoanApplications({
        limit: 10
      });
      console.log('Applications response:', applicationsResponse);
      setApplications(applicationsResponse.loanApplications || applicationsResponse.applications || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({});
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = () => {
    loadDashboardData();
  };

  const handleSignOut = () => {
    logout();
    setUserDropdownOpen(false);
  };

  const filteredApplications = applications.filter(app => {
    return statusFilter === 'all' || app.status === statusFilter;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'amount':
        comparison = (a.loanAmount || 0) - (b.loanAmount || 0);
        break;
      case 'status':
        const statusOrder = { pending: 1, under_review: 2, approved: 3, rejected: 4, disbursed: 5, completed: 6 };
        comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-12">
                <h1 className="text-3xl font-bold uppercase" style={{ color: '#0A512F' }}>
                  CREDIT APP
                </h1>
                <Menu className="h-8 w-8" style={{ color: '#0A512F' }} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-green-600 hover:text-green-700 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">4</span>
                </button>
              </div>
              <button className="p-2 text-green-600 hover:text-green-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-green-600 capitalize font-medium">{user?.role}</span>
                  <ChevronDown 
                    className={`h-4 w-4 text-green-600 transition-transform ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-1 overflow-hidden">
        <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
          <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)}></div>
          <div className={`relative flex-1 flex flex-col max-w-xs w-full transition ease-in-out duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <NavigationSidebar />
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <NavigationSidebar />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <h2 className="text-lg font-medium" style={{ color: '#0A512F' }}>
                    <span className="text-base">Dashboard</span> &gt; <span className="text-2xl font-semibold">Loans</span>
                  </h2>
                </div>

                <StatisticsCards stats={stats} userRole={user?.role} />
                <div className="mt-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Loan Applications
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative" ref={sortDropdownRef}>
                          <button 
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                            <span>Sort</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showSortDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sort By
                              </div>
                              {[
                                { value: 'date', label: 'Date Applied' },
                                { value: 'amount', label: 'Loan Amount' },
                                { value: 'status', label: 'Status' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setSortBy(option.value);
                                    setShowSortDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    sortBy === option.value ? 'text-green-600 bg-green-50' : 'text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                              
                              <div className="border-t border-gray-100 my-1"></div>
                              
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order
                              </div>
                              {[
                                { value: 'desc', label: 'Descending' },
                                { value: 'asc', label: 'Ascending' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setSortOrder(option.value);
                                    setShowSortDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    sortOrder === option.value ? 'text-green-600 bg-green-50' : 'text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="relative" ref={filterDropdownRef}>
                          <button 
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </div>
                              {[
                                { value: 'all', label: 'All Statuses' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'under_review', label: 'Under Review' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'rejected', label: 'Rejected' },
                                { value: 'disbursed', label: 'Disbursed' },
                                { value: 'completed', label: 'Completed' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setStatusFilter(option.value);
                                    setShowFilterDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    statusFilter === option.value ? 'text-green-600 bg-green-50' : 'text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <LoanTable
                      applications={sortedApplications}
                      onStatusUpdate={handleStatusUpdate}
                      userRole={user?.role}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
