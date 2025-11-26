import type { Asset } from "./asset.types";
import type { PaginationParams } from "../../../types/common.types";

export interface GetAssetsParams extends PaginationParams {
    status?: string;
    location?: string;
    search?: string;
}

export type GetAssetsResponse = Asset[];

export type CreateAssetRequest = Omit<Asset, 'id' | 'created_at' | 'updated_at'>;

export type CreateAssetResponse = Asset;

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {}

export type UpdateAssetResponse = Asset;