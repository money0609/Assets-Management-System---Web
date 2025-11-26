import React, { useState } from 'react';
import type { FormEvent } from 'react';
import type { Asset, AssetStatus, CreateAssetDTO } from '../types/asset.types';

interface AssetFormProps {
    asset: Asset | null;
    onSave: (data: CreateAssetDTO) => void;
    onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ asset, onSave, onCancel }) => {
    // All available status options
    const statusOptions: AssetStatus[] = ['Available', 'In Use', 'Needs Repair', 'Unknown'];

    const [formData, setFormData] = useState<CreateAssetDTO>({
        name: asset?.name || '',
        description: asset?.description || '',
        type: asset?.type || '',
        location: asset?.location || '',
        status: asset?.status || 'Available',
    });
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof CreateAssetDTO, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-left">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Asset Name"
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                />
            </div>
            <div >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset Description *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Asset Description"
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location *
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Asset Location"
                        className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status *
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value as AssetStatus)}
                        className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        required
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="!px-6 !py-3 !bg-white !text-gray-700 hover:!bg-gray-100 !rounded-lg !font-medium !transition-colors !border-0 !shadow-none focus:!outline-none focus-visible:!outline-none"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="!px-6 !py-3 !bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-lg !font-medium !transition-colors !shadow-sm !border-0 focus:!outline-none focus-visible:!outline-none"
                >
                    {asset?.id ? 'Update Asset' : 'Create Asset'}
                </button>
            </div>
        </form>
    );
};

export default AssetForm;