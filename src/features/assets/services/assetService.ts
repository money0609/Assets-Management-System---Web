import { apiClient as api } from "../../../services/apiClient";
import type { Asset } from "../types/asset.types";
import type { 
    GetAssetsParams, 
    GetAssetsResponse,
    CreateAssetRequest, 
    CreateAssetResponse, 
    UpdateAssetRequest, 
    UpdateAssetResponse 
} from "../types/asset-api.types";

class AssetService {
    private readonly basePath = "/assets";

    async getALL(params?: GetAssetsParams): Promise<GetAssetsResponse> {
        // apiClient interceptor returns response.data, so response is already the data
        // Add trailing slash to avoid 307 redirect from backend
        const response = await api.get<GetAssetsResponse>(`${this.basePath}/`, { params });
        return response as unknown as GetAssetsResponse;
    }
    async getById(id: number): Promise<Asset> {
        // apiClient interceptor returns response.data, so response is already the data
        const response = await api.get<Asset>(`${this.basePath}/${id}`);
        return response as unknown as Asset;
    }
    
    async create(data: CreateAssetRequest): Promise<CreateAssetResponse> {
        // apiClient interceptor returns response.data, so response is already the data
        const response = await api.post<CreateAssetResponse>(`${this.basePath}/create`, data);
        return response as unknown as CreateAssetResponse;
    }
    
    async update(id: number, data: UpdateAssetRequest): Promise<UpdateAssetResponse> {
        // apiClient interceptor returns response.data, so response is already the data
        const response = await api.put<UpdateAssetResponse>(`${this.basePath}/update/${id}`, data);
        return response as unknown as UpdateAssetResponse;
    }
    
      async delete(id: number): Promise<void> {
        await api.delete(`${this.basePath}/delete/${id}`);
      }
}

export const assetService = new AssetService();