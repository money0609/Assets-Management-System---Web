import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Package, MapPin, Activity, Users, Grid, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useAssets } from "../../../features/assets/hooks/useAssets";

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { assets } = useAssets();

    // Map user roles to display info
    const getRoleInfo = (role: string) => {
        const roleMap: Record<string, { name: string; initials: string; bgColor: string }> = {
            admin: { name: 'Administrator', initials: 'AD', bgColor: 'bg-indigo-600' },
            manager: { name: 'Manager', initials: 'MG', bgColor: 'bg-blue-600' },
            viewer: { name: 'Viewer', initials: 'VW', bgColor: 'bg-gray-600' },
            unknown: { name: 'Unknown', initials: 'UN', bgColor: 'bg-gray-600' },
        };
        return roleMap[role] || roleMap.unknown;
    };

    const roleInfo = user ? getRoleInfo(user.role) : getRoleInfo('unknown');
    const userDisplayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'Guest';

    // Get maintenance count (assets with status "Needs Repair")
    const maintenanceCount = assets?.filter(a => a.status === 'Needs Repair').length || 0;

    // Check permissions based on role
    const canViewReports = user?.role === 'admin' || user?.role === 'manager';
    const canManageUsers = user?.role === 'admin';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
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
                
                {user && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 ${roleInfo.bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow`}>
                            {roleInfo.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">{userDisplayName}</div>
                            <div className="text-xs text-gray-500">{roleInfo.name}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `w-full px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
                            isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`
                    }
                >
                    <Grid className="w-5 h-5 mr-3" />
                    Dashboard
                </NavLink>
                
                <NavLink
                    to="/assets"
                    className={({ isActive }) =>
                        `w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                            isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`
                    }
                >
                    <div className="flex items-center">
                        <Package className="w-5 h-5 mr-3" />
                        All Assets
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{assets?.length || 0}</span>
                </NavLink>
                
                <button
                    className="w-full px-4 py-3 rounded-lg font-medium flex items-center transition-colors text-gray-700 hover:bg-gray-50"
                    disabled
                >
                    <MapPin className="w-5 h-5 mr-3" />
                    Locations
                </button>
                
                <button
                    className="w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors text-gray-700 hover:bg-gray-50"
                    disabled
                >
                    <div className="flex items-center">
                        <Activity className="w-5 h-5 mr-3" />
                        Maintenance
                    </div>
                    {maintenanceCount > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                            {maintenanceCount}
                        </span>
                    )}
                </button>
                
                <button
                    disabled={!canViewReports}
                    className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                        !canViewReports
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        Reports
                    </div>
                    {!canViewReports && <span className="text-xs">🔒</span>}
                </button>
                
                <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                        `w-full px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                            !canManageUsers
                                ? 'text-gray-400 cursor-not-allowed pointer-events-none'
                                : isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50'
                        }`
                    }
                >
                    <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        User Management
                    </div>
                    {!canManageUsers && <span className="text-xs">🔒</span>}
                </NavLink>
            </nav>

            {/* Permissions Panel */}
            {user && (
                <div className="p-4 border-t border-gray-200">
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-xs font-semibold text-indigo-900 mb-3">Your Permissions</div>
                        <div className="space-y-2 text-xs">
                            <div className={user.role === 'admin' || user.role === 'manager' ? 'text-green-700' : 'text-gray-400'}>
                                {user.role === 'admin' || user.role === 'manager' ? '✓' : '✗'} Create Assets
                            </div>
                            <div className={user.role === 'admin' || user.role === 'manager' ? 'text-green-700' : 'text-gray-400'}>
                                {user.role === 'admin' || user.role === 'manager' ? '✓' : '✗'} Edit Assets
                            </div>
                            <div className={user.role === 'admin' ? 'text-green-700' : 'text-gray-400'}>
                                {user.role === 'admin' ? '✓' : '✗'} Delete Assets
                            </div>
                            <div className={canViewReports ? 'text-green-700' : 'text-gray-400'}>
                                {canViewReports ? '✓' : '✗'} View Reports
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
            )}
        </div>
    );
};

export default Sidebar;