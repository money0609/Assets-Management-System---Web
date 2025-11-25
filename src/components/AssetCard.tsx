import React from 'react';
import type { Asset } from '../types/asset.types';

interface AssetCardProps {
    asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
    return (
        <div>
            <h3>{asset.name}</h3>
            <p>{asset.status}</p>
            <p>{asset.description}</p>
            <p>{asset.type}</p>
            <p>{asset.location}</p>
            <p>{asset.updated_at.toLocaleString()}</p>
        </div>
    );
};

export default AssetCard;