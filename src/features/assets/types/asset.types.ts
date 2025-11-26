export interface Asset {
    id: number;
    name: string;
    description: string;
    type: string;
    location: string;
    status: "Available" | "In Use" | "Needs Repair" | "Unknown";
    created_at: Date;
    updated_at: Date;
}

export type AssetStatus = Asset['status'];

export type CreateAssetDTO = Omit<Asset, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAssetDTO = Partial<CreateAssetDTO>;