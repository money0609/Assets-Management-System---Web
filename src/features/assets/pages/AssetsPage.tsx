import React, { useState, useMemo } from 'react';
import { Package, MapPin, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAssets } from '../hooks/useAssets';
import { useAuth } from '../../auth/hooks/useAuth';
import type { AssetStatus, CreateAssetDTO } from '../types/asset.types';
import type { CreateAssetRequest } from '../types/asset-api.types';
import Modal from '../../../components/Modal';
import AssetForm from '../components/AssetForm';

const AssetsPage: React.FC = () => {
    const { assets, showModal, editingAsset, openCreateModal, openEditModal, closeModal, deleteAsset, createAsset, updateAsset, refresh } = useAssets();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    // Status options matching the actual Asset type
    const statusOptions: AssetStatus[] = ['Available', 'In Use', 'Needs Repair', 'Unknown'];

    // Check permissions
    const canCreate = user?.role === 'admin' || user?.role === 'manager';
    const canEdit = user?.role === 'admin' || user?.role === 'manager';
    const canDelete = user?.role === 'admin';

    // Filter assets based on search and status
    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            const matchesSearch = asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 asset?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 asset?.location?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || asset?.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [assets, searchTerm, filterStatus]);

    // Get status color based on actual asset statuses
    const getStatusColor = (status: AssetStatus): string => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'In Use': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Needs Repair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Unknown': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            await deleteAsset(id);
            refresh();
        }
    };

    const handleSave = (data: CreateAssetDTO) => {
        if (editingAsset) {
            // Update existing asset
            updateAsset(editingAsset.id, data as Partial<CreateAssetRequest>)
                .then(() => {
                    closeModal();
                    refresh();
                })
                .catch((err) => console.error('Failed to update asset:', err));
        } else {
            // Create new asset
            createAsset(data as CreateAssetRequest)
                .then(() => {
                    closeModal();
                    refresh();
                })
                .catch((err) => console.error('Failed to create asset:', err));
        }
    };

    return (
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
                        <option value="All">All</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    {canCreate && (
                        <button
                            onClick={openCreateModal}
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                {(canEdit || canDelete) && (
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAssets.length === 0 ? (
                                <tr>
                                    <td colSpan={canEdit || canDelete ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                                        No assets found
                                    </td>
                                </tr>
                            ) : (
                                filteredAssets.map(asset => (
                                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                                    <Package className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{asset.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {asset.id}</div>
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
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={asset.description}>
                                            {asset.description}
                                        </td>
                                        {(canEdit || canDelete) && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => openEditModal(asset)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(asset.id)}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit Asset */}
            {showModal && (
                <Modal onClose={closeModal}>
                    <AssetForm
                        asset={editingAsset}
                        onSave={handleSave}
                        onCancel={closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AssetsPage;