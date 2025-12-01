import { useState, useCallback, useEffect } from 'react';
import type { Asset } from '../types/asset.types';
import type { CreateAssetRequest, GetAssetsParams } from '../types/asset-api.types';
import type { ApiError } from '../../../types/common.types';
import { assetService } from '../services/assetService';

interface UseAsstsReturn {
    assets: Asset[];
    showModal: boolean;
    loading: boolean;
    error: ApiError | null;
    editingAsset: Asset | null;
    openCreateModal: () => void;
    openEditModal: (asset: Asset) => void;
    closeModal: () => void;
    createAsset: (assetData: CreateAssetRequest) => Promise<void>;
    updateAsset: (id: number, assetData: Partial<CreateAssetRequest>) => Promise<void>;
    deleteAsset: (id: number) => Promise<void>;
    refresh: () => Promise<void>;
}

export const useAssets = (params?: GetAssetsParams): UseAsstsReturn => {

    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const loadAssets = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await assetService.getALL(params);
            // response is already Asset[] due to apiClient interceptor
            setAssets(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    const createAsset = useCallback(async (assetData: CreateAssetRequest): Promise<void> => {
        try {
            const newAsset = await assetService.create(assetData);
            setAssets(prev => [...prev, newAsset]);
        } catch (err) {
            setError(err as ApiError);
        }
    }, []);
    
    const updateAsset = useCallback(async (id: number, assetData: Partial<CreateAssetRequest>): Promise<void> => {
        try {
            const updatedAsset = await assetService.update(id, assetData);
            setAssets(prev => prev.map(asset => (asset.id === id ? updatedAsset : asset)));
        } catch (err) {
            setError(err as ApiError);
            throw err;
        }
    }, []);

    const deleteAsset = useCallback(async (id: number): Promise<void> => {
        try {
            await assetService.delete(id);
            setAssets(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            setError(err as ApiError);
            throw err;
        }
    }, []);

    const openCreateModal = useCallback((): void => {
        setEditingAsset(null);
        setShowModal(true);
    }, []);
    
    const openEditModal = useCallback((asset: Asset): void => {
        setEditingAsset(asset);
        setShowModal(true);
    }, []);
    
    const closeModal = useCallback((): void => {
        setShowModal(false);
        setEditingAsset(null);
    }, []);
    

    return {
        assets,
        loading,
        error,
        showModal,
        editingAsset,
        openCreateModal,
        openEditModal,
        closeModal,
        createAsset,
        updateAsset,
        deleteAsset,
        refresh:loadAssets,
    };
}