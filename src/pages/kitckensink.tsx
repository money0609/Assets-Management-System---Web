import { useState } from 'react';
import { Package, MapPin, Activity, Users, Grid, BarChart3, Settings, Bell, LogOut, Plus, Edit2, Trash2, Search, Filter, Download, X } from 'lucide-react';

const AirportAssetsManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [assets, setAssets] = useState([
    { id: 1, name: 'Baggage Carousel 1', type: 'Baggage Handling', location: 'Terminal A - Arrivals', status: 'Operational', lastMaintenance: '2024-11-15', assignedTo: 'Team A' },
    { id: 2, name: 'Security Scanner 3', type: 'Security Equipment', location: 'Terminal B - Security', status: 'Maintenance', lastMaintenance: '2024-11-20', assignedTo: 'Team B' },
    { id: 3, name: 'Jet Bridge 12', type: 'Aircraft Interface', location: 'Gate B12', status: 'Operational', lastMaintenance: '2024-11-10', assignedTo: 'Team C' },
    { id: 4, name: 'HVAC Unit 5', type: 'Climate Control', location: 'Terminal A - East Wing', status: 'Operational', lastMaintenance: '2024-11-05', assignedTo: 'Team A' },
    { id: 5, name: 'Fire Suppression Panel', type: 'Safety System', location: 'Terminal C - Central', status: 'Out of Service', lastMaintenance: '2024-10-28', assignedTo: 'Team B' },
    { id: 6, name: 'Fuel Truck 03', type: 'Ground Support', location: 'Apron Area 2', status: 'Operational', lastMaintenance: '2024-11-18', assignedTo: 'Team D' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const roles = {
    admin: { 
      name: 'Administrator', 
      initials: 'AD',
      canCreate: true, 
      canEdit: true, 
      canDelete: true, 
      canViewReports: true,
      canManageUsers: true,
      color: 'indigo'
    },
    manager: { 
      name: 'Manager', 
      initials: 'MG',
      canCreate: true, 
      canEdit: true, 
      canDelete: false, 
      canViewReports: true,
      canManageUsers: false,
      color: 'blue'
    },
    viewer: { 
      name: 'Viewer', 
      initials: 'VW',
      canCreate: false, 
      canEdit: false, 
      canDelete: false, 
      canViewReports: false,
      canManageUsers: false,
      color: 'gray'
    }
  };

  const assetTypes = ['Baggage Handling', 'Security Equipment', 'Aircraft Interface', 'Climate Control', 'Safety System', 'Ground Support', 'Communication System'];
  const statusOptions = ['Operational', 'Maintenance', 'Out of Service', 'Decommissioned'];

  const handleLogin = (role) => {
    setCurrentUser(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
    setShowModal(false);
    setEditingAsset(null);
  };

  const handleAddAsset = () => {
    setEditingAsset({
      name: '',
      type: assetTypes[0],
      location: '',
      status: 'Operational',
      lastMaintenance: new Date().toISOString().split('T')[0],
      assignedTo: 'Team A'
    });
    setShowModal(true);
  };

  const handleEditAsset = (asset) => {
    setEditingAsset({ ...asset });
    setShowModal(true);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (editingAsset.id) {
      setAssets(assets.map(a => a.id === editingAsset.id ? editingAsset : a));
    } else {
      setAssets([...assets, { ...editingAsset, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingAsset(null);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800 border-green-200';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Service': return 'bg-red-100 text-red-800 border-red-200';
      case 'Decommissioned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusCount = (status) => {
    return assets.filter(a => a.status === status).length;
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Airport Assets</h1>
          <p className="text-center text-gray-600 mb-8">Management System</p>
          <div className="space-y-3">
            {Object.entries(roles).map(([key, role]) => (
              <button
                key={key}
                onClick={() => handleLogin(key)}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${role.color}-100 rounded-lg flex items-center justify-center text-${role.color}-700 font-bold text-sm`}>
                    {role.initials}
                  </div>
                  <span>{role.name}</span>
                </div>
                <div className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userRole = roles[currentUser];

  // Main Application
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo & User */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Airport Assets</div>
              <div className="text-xs text-gray-500">Management System</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-10 h-10 bg-${userRole.color}-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow`}>
              {userRole.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">John Smith</div>
              <div className="text-xs text-gray-500">{userRole.name}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
              activeView === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveView('assets')}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
              activeView === 'assets' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-3" />
              All Assets
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{assets.length}</span>
          </button>
          
          <button
            onClick={() => setActiveView('locations')}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
              activeView === 'locations' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-5 h-5 mr-3" />
            Locations
          </button>
          
          <button
            onClick={() => setActiveView('maintenance')}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
              activeView === 'maintenance' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-3" />
              Maintenance
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {getStatusCount('Maintenance')}
            </span>
          </button>
          
          <button
            onClick={() => setActiveView('reports')}
            disabled={!userRole.canViewReports}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
              !userRole.canViewReports
                ? 'text-gray-400 cursor-not-allowed'
                : activeView === 'reports'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-3" />
              Reports
            </div>
            {!userRole.canViewReports && <span className="text-xs">🔒</span>}
          </button>
          
          <button
            onClick={() => setActiveView('users')}
            disabled={!userRole.canManageUsers}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
              !userRole.canManageUsers
                ? 'text-gray-400 cursor-not-allowed'
                : activeView === 'users'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3" />
              User Management
            </div>
            {!userRole.canManageUsers && <span className="text-xs">🔒</span>}
          </button>
        </nav>

        {/* Permissions Panel */}
        <div className="p-4 border-t border-gray-200">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-xs font-semibold text-indigo-900 mb-3">Your Permissions</div>
            <div className="space-y-2 text-xs">
              <div className={userRole.canCreate ? 'text-green-700' : 'text-gray-400'}>
                {userRole.canCreate ? '✓' : '✗'} Create Assets
              </div>
              <div className={userRole.canEdit ? 'text-green-700' : 'text-gray-400'}>
                {userRole.canEdit ? '✓' : '✗'} Edit Assets
              </div>
              <div className={userRole.canDelete ? 'text-green-700' : 'text-gray-400'}>
                {userRole.canDelete ? '✓' : '✗'} Delete Assets
              </div>
              <div className={userRole.canViewReports ? 'text-green-700' : 'text-gray-400'}>
                {userRole.canViewReports ? '✓' : '✗'} View Reports
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'assets' && 'Asset Management'}
                {activeView === 'locations' && 'Location Overview'}
                {activeView === 'maintenance' && 'Maintenance Schedule'}
                {activeView === 'reports' && 'Reports & Analytics'}
                {activeView === 'users' && 'User Management'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeView === 'dashboard' && 'Overview of all airport assets'}
                {activeView === 'assets' && 'Manage and track all assets'}
                {activeView === 'locations' && 'View assets by location'}
                {activeView === 'maintenance' && 'Track maintenance activities'}
                {activeView === 'reports' && 'Generate and view reports'}
                {activeView === 'users' && 'Manage system users and permissions'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {getStatusCount('Operational')}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Operational</div>
                  <div className="text-xs text-gray-500 mt-1">Assets running smoothly</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                      {getStatusCount('Maintenance')}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Maintenance</div>
                  <div className="text-xs text-gray-500 mt-1">Scheduled service</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      {getStatusCount('Out of Service')}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Out of Service</div>
                  <div className="text-xs text-gray-500 mt-1">Requires attention</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{assets.length}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">Total Assets</div>
                  <div className="text-xs text-gray-500 mt-1">All tracked items</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                  {userRole.canCreate && (
                    <button
                      onClick={handleAddAsset}
                      className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
                    >
                      <Plus className="w-5 h-5 text-indigo-600 mb-2" />
                      <div className="font-medium text-gray-900 text-sm">Add New Asset</div>
                      <div className="text-xs text-gray-600 mt-1">Register new equipment</div>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveView('maintenance')}
                    className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors text-left"
                  >
                    <Activity className="w-5 h-5 text-yellow-600 mb-2" />
                    <div className="font-medium text-gray-900 text-sm">View Maintenance</div>
                    <div className="text-xs text-gray-600 mt-1">Check scheduled tasks</div>
                  </button>
                  {userRole.canViewReports && (
                    <button
                      onClick={() => setActiveView('reports')}
                      className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
                    >
                      <Download className="w-5 h-5 text-green-600 mb-2" />
                      <div className="font-medium text-gray-900 text-sm">Generate Report</div>
                      <div className="text-xs text-gray-600 mt-1">Export asset data</div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeView === 'assets' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assets by name, type, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option>All</option>
                    {statusOptions.map(status => <option key={status}>{status}</option>)}
                  </select>
                  {userRole.canCreate && (
                    <button
                      onClick={handleAddAsset}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Asset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Assets Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Maintenance</th>
                        {(userRole.canEdit || userRole.canDelete) && (
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAssets.map(asset => (
                        <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                <Package className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{asset.name}</div>
                                <div className="text-sm text-gray-500">{asset.assignedTo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{asset.type}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {asset.location}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{asset.lastMaintenance}</td>
                          {(userRole.canEdit || userRole.canDelete) && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {userRole.canEdit && (
                                  <button
                                    onClick={() => handleEditAsset(asset)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                )}
                                {userRole.canDelete && (
                                  <button
                                    onClick={() => handleDeleteAsset(asset.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(activeView === 'locations' || activeView === 'maintenance' || activeView === 'reports' || activeView === 'users') && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeView === 'locations' && <MapPin className="w-8 h-8 text-gray-400" />}
                {activeView === 'maintenance' && <Activity className="w-8 h-8 text-gray-400" />}
                {activeView === 'reports' && <BarChart3 className="w-8 h-8 text-gray-400" />}
                {activeView === 'users' && <Users className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
              </h3>
              <p className="text-gray-600">This view is under development</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Add/Edit Asset */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAsset?.id ? 'Edit Asset' : 'Add New Asset'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAsset(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAsset} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={editingAsset?.name || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Baggage Carousel 1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset Type *
                  </label>
                  <select
                    value={editingAsset?.type || ''}
                    onChange={(e) => setEditingAsset({...editingAsset, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    required
                  >
                    {assetTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={editingAsset?.status || ''}
                    onChange={(e) => setEditingAsset({...editingAsset, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={editingAsset?.location || ''}
                  onChange={(e) => setEditingAsset({...editingAsset, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Terminal A - Arrivals"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Maintenance *
                  </label>
                  <input
                    type="date"
                    value={editingAsset?.lastMaintenance || ''}
                    onChange={(e) => setEditingAsset({...editingAsset, lastMaintenance: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigned To *
                  </label>
                  <select
                    value={editingAsset?.assignedTo || ''}
                    onChange={(e) => setEditingAsset({...editingAsset, assignedTo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="Team A">Team A</option>
                    <option value="Team B">Team B</option>
                    <option value="Team C">Team C</option>
                    <option value="Team D">Team D</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAsset(null);
                  }}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  {editingAsset?.id ? 'Update Asset' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default AirportAssetsManagement;