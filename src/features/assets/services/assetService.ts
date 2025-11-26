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
        const response = await api.get<GetAssetsResponse>(this.basePath, { params });
        console.log('getALL assetService: ', response);
        return response as unknown as GetAssetsResponse;
    }
    async getById(id: number): Promise<Asset> {
        const response = await api.get<Asset>(`${this.basePath}/${id}`);
        return response.data;
      }
    
      async create(data: CreateAssetRequest): Promise<CreateAssetResponse> {
        const response = await api.post<CreateAssetResponse>(`${this.basePath}/create`, data);
        return response.data;
      }
    
      async update(id: number, data: UpdateAssetRequest): Promise<UpdateAssetResponse> {
        const response = await api.put<UpdateAssetResponse>(`${this.basePath}/update/${id}`, data);
        return response.data;
      }
    
      async delete(id: number): Promise<void> {
        await api.delete(`${this.basePath}/delete/${id}`);
      }
}

export const assetService = new AssetService();