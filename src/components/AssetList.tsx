import React from 'react';
import AssetCard from './AssetCard';
import type { Asset } from '../types/asset.types';

interface AssetListProps {
    assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
    return (
        <div>
            {
                assets.map((asset: Asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                ))
            }
        </div>
    );
};

export default AssetList;