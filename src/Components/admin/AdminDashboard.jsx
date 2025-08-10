import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  Home,
  Landmark
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ViewDetailsModal from './ViewDetailsModal';

const EnhancedAdminDashboard = () => {
  // Main state management
  const [registrations, setRegistrations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedLocalBodyType, setSelectedLocalBodyType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Sorting states
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // UI states
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Kerala districts for dropdown
  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const localBodyTypes = [
    { value: 'panchayath', label: 'Panchayath', icon: Home },
    { value: 'municipality', label: 'Municipality', icon: Building },
    { value: 'corporation', label: 'Corporation', icon: Landmark }
  ];

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedRegistration(null);
  };

  // Fetch registrations from Supabase
  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, itemsPerPage, sortField, sortDirection]);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [registrations, searchTerm, selectedDistrict, selectedLocalBodyType, dateRange]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate offset for pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Build Supabase query
      let query = supabase
        .from('registrations')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setRegistrations(data || []);
      setTotalItems(count || 0);
      
    } catch (err) {
      setError('Failed to fetch registrations: ' + err.message);
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.first_name?.toLowerCase().includes(searchLower) ||
        reg.last_name?.toLowerCase().includes(searchLower) ||
        reg.district?.toLowerCase().includes(searchLower) ||
        reg.local_body?.toLowerCase().includes(searchLower) ||
        reg.local_body_type?.toLowerCase().includes(searchLower) ||
        reg.phone_number?.includes(searchTerm) ||
        reg.whatsapp_number?.includes(searchTerm)
      );
    }

    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter(reg => reg.district === selectedDistrict);
    }

    // Local Body Type filter
    if (selectedLocalBodyType) {
      filtered = filtered.filter(reg => reg.local_body_type === selectedLocalBodyType);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(reg => 
        new Date(reg.created_at) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(reg => 
        new Date(reg.created_at) <= new Date(dateRange.end + 'T23:59:59')
      );
    }

    setFilteredData(filtered);
  };

  // Enhanced stats calculations
  const calculateStats = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Local Body Type breakdown
    const typeBreakdown = registrations.reduce((acc, reg) => {
      const type = reg.local_body_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: registrations.length,
      today: registrations.filter(reg => 
        new Date(reg.created_at).toDateString() === today
      ).length,
      districts: [...new Set(registrations.map(reg => reg.district))].length,
      thisWeek: registrations.filter(reg => 
        new Date(reg.created_at) > weekAgo
      ).length,
      panchayaths: typeBreakdown.panchayath || 0,
      municipalities: typeBreakdown.municipality || 0,
      corporations: typeBreakdown.corporation || 0
    };
  };

  const stats = calculateStats();

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRegistrations();
    setRefreshing(false);
  };

  // Enhanced export with local body type
  const handleExport = () => {
    const csvContent = [
      ['Name', 'District', 'Local Body Type', 'Local Body', 'Phone', 'WhatsApp', 'Date'],
      ...filteredData.map(reg => [
        `${reg.first_name} ${reg.last_name}`,
        reg.district,
        reg.local_body_type || '',
        reg.local_body,
        reg.phone_number,
        reg.whatsapp_number,
        new Date(reg.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(reg => reg.id));
    }
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} registration(s)?`)) {
      try {
        const { error } = await supabase
          .from('registrations')
          .delete()
          .in('id', selectedRows);

        if (error) throw error;

        setSelectedRows([]);
        await fetchRegistrations();
      } catch (err) {
        alert('Error deleting registrations: ' + err.message);
      }
    }
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getLocalBodyTypeIcon = (type) => {
    const typeData = localBodyTypes.find(t => t.value === type);
    return typeData ? typeData.icon : Home;
  };

  const getLocalBodyTypeLabel = (type) => {
    const typeData = localBodyTypes.find(t => t.value === type);
    return typeData ? typeData.label : type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Left side - Title and Description */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  Enhanced Admin Dashboard
                </h1>
                <Bell className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-white/70 text-lg">
                Manage painter protection policy registrations with local body details
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-white/50 text-sm">
                  Welcome back, {user?.email || 'Admin User'}
                </span>
                <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                <span className="text-white/50 text-sm">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            {/* Right side - Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 group">
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${
                  refreshing ? 'animate-spin' : 'group-hover:rotate-180'
                }`} />
                <span className="hidden sm:block">
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 group"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                <span className="hidden sm:block">Export</span>
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-white/50">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="text-white/50">
              <span>Kerala Painters Admin Panel v2.0</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {[
            {
              title: 'Total Registrations',
              value: stats.total,
              icon: Users,
              color: 'blue',
              change: '+12%',
              description: 'All time registrations',
              span: 'xl:col-span-2'
            },
            {
              title: 'Today',
              value: stats.today,
              icon: Calendar,
              color: 'emerald',
              change: `+${stats.today}`,
              description: 'New registrations today'
            },
            {
              title: 'Districts',
              value: stats.districts,
              icon: MapPin,
              color: 'purple',
              change: `${stats.districts}/14`,
              description: 'Districts covered'
            },
            {
              title: 'This Week',
              value: stats.thisWeek,
              icon: TrendingUp,
              color: 'orange',
              change: '+18%',
              description: 'Weekly registrations'
            },
            {
              title: 'Panchayaths',
              value: stats.panchayaths,
              icon: Home,
              color: 'green',
              change: `${((stats.panchayaths/stats.total)*100).toFixed(1)}%`,
              description: 'Panchayath registrations'
            },
            {
              title: 'Municipalities',
              value: stats.municipalities,
              icon: Building,
              color: 'indigo',
              change: `${((stats.municipalities/stats.total)*100).toFixed(1)}%`,
              description: 'Municipality registrations'
            },
            {
              title: 'Corporations',
              value: stats.corporations,
              icon: Landmark,
              color: 'red',
              change: `${((stats.corporations/stats.total)*100).toFixed(1)}%`,
              description: 'Corporation registrations'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${stat.span || ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') 
                        ? 'text-emerald-400' 
                        : stat.change.startsWith('-') 
                        ? 'text-red-400' 
                        : 'text-blue-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors duration-300">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </h3>
                  <p className="text-white/60 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-white/40 text-xs">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Filters and Search Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(selectedDistrict || selectedLocalBodyType || dateRange.start) && (
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                )}
              </button>

              {selectedRows.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">
                    {selectedRows.length} selected
                  </span>
                  <button 
                    onClick={handleDeleteSelected}
                    className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" className="bg-gray-800">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district} className="bg-gray-800">
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Local Body Type</label>
                <select
                  value={selectedLocalBodyType}
                  onChange={(e) => setSelectedLocalBodyType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" className="bg-gray-800">All Types</option>
                  {localBodyTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Table Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Registrations ({filteredData.length})
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
              >
                <option value={10} className="bg-gray-800">10</option>
                <option value={25} className="bg-gray-800">25</option>
                <option value={50} className="bg-gray-800">50</option>
              </select>
              <span className="text-white/60 text-sm">entries</span>
            </div>
          </div>

          {/* Enhanced Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Loading registrations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchRegistrations}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg mb-2">No registrations found</p>
              <p className="text-white/40">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-400"
                      />
                    </th>
                    {[
                      { key: 'first_name', label: 'Name' },
                      { key: 'district', label: 'District' },
                      { key: 'local_body_type', label: 'Type' },
                      { key: 'local_body', label: 'Local Body' },
                      { key: 'phone_number', label: 'Phone' },
                      { key: 'created_at', label: 'Date' }
                    ].map(column => (
                      <th 
                        key={column.key}
                        className="text-left py-3 px-4 text-white/80 font-medium cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {sortField === column.key && (
                            <span className="text-blue-400">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((registration) => {
                    const LocalBodyIcon = getLocalBodyTypeIcon(registration.local_body_type);
                    return (
                      <tr key={registration.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(registration.id)}
                            onChange={() => handleRowSelect(registration.id)}
                            className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-400"
                          />
                        </td>
                        <td className="py-3 px-4 text-white">
                          {registration.first_name} {registration.last_name}
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          {registration.district}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <LocalBodyIcon className="w-4 h-4 text-blue-300" />
                            <span className="text-white/80 text-sm">
                              {getLocalBodyTypeLabel(registration.local_body_type)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          <span className="truncate max-w-32 block" title={registration.local_body}>
                            {registration.local_body}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          {registration.phone_number}
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleViewDetails(registration)}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <ViewDetailsModal 
        isOpen={showViewModal}
        onClose={closeViewModal}
        registration={selectedRegistration}
        onUpdate={(updatedData) => {
          // Refresh the data after edit
          fetchRegistrations();
        }}
      />
    </div>
  );
};

export default EnhancedAdminDashboard;