import axiosInstance from "@/lib/axios";
import { FavoritesResult,FavoritesResponse} from "@/types/index"




export async function GetFavorites(
    id: string | undefined,
): Promise<FavoritesResult> {
    let isLoading = true;
    let error: string | null = null;
    let data: FavoritesResponse | null = null;

    try {
        const response = await axiosInstance.get<FavoritesResponse>(`/favorite`, {
            params: { userId: id},
        });
        data = response.data;
    } catch (err: unknown) {
        console.error('GetFavorites error', err);
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        error = e?.response?.data?.message ?? (e?.message ?? 'Unknown error');
    } finally {
        isLoading = false;
    }

    return { data, isLoading, error };
}