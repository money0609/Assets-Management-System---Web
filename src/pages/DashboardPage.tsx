import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Activity, Settings, Plus, Download } from 'lucide-react';
import { useAssets } from '../features/assets/hooks/useAssets';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { AssetStatus } from '../features/assets/types/asset.types';

const DashboardPage: React.FC = () => {
    const { assets } = useAssets();
    const { user } = useAuth();
    const navigate = useNavigate();
    // Map actual asset statuses to display categories
    const getStatusCount = (status: AssetStatus): number => {
        return assets?.filter(a => a.status === status).length || 0;
    };

    // Check permissions
    const canCreate = user?.role === 'admin' || user?.role === 'manager';
    const canViewReports = user?.role === 'admin' || user?.role === 'manager';

    // Count assets by status
    const availableCount = getStatusCount('Available');
    const inUseCount = getStatusCount('In Use');
    const needsRepairCount = getStatusCount('Needs Repair');
    const totalAssets = assets?.length || 0;

    const handleAddAsset = () => {
        navigate('/assets');
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                            {availableCount}
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">Available</div>
                    <div className="text-xs text-gray-500 mt-1">Assets running smoothly</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                            {inUseCount}
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">In Use</div>
                    <div className="text-xs text-gray-500 mt-1">Currently in operation</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">
                            {needsRepairCount}
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">Needs Repair</div>
                    <div className="text-xs text-gray-500 mt-1">Requires attention</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">{totalAssets}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">Total Assets</div>
                    <div className="text-xs text-gray-500 mt-1">All tracked items</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                    {canCreate && (
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
                        onClick={() => navigate('/assets')}
                        className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors text-left"
                    >
                        <Activity className="w-5 h-5 text-yellow-600 mb-2" />
                        <div className="font-medium text-gray-900 text-sm">View Assets</div>
                        <div className="text-xs text-gray-600 mt-1">Browse all assets</div>
                    </button>
                    {canViewReports && (
                        <button
                            onClick={() => navigate('/assets')}
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
    );
};

export default DashboardPage;