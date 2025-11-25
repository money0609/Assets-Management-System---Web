import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RouteParams {
    id: string | number;
}

const AssetDetailPage: React.FC = () => {
    const { id } = useParams<keyof RouteParams>();
    const navigate = useNavigate();

    const handleBack = (): void => {
        navigate('/assets');
    }
    return (
        <div>
            <h1>Asset Detail: {id}</h1>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default AssetDetailPage;