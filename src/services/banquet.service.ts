import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/banquet";
export interface IBanquet {
    _id : string,
    banquetName: string,
    size: string,
    setup: string,
    foodOption: string,
    vegPrice: string,
    nonVegPrice: string,
    PFAsize: string,
    imagesArr: {
        image: string
    }[]
};


// Banquet
export const getBanquetExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addBanquetExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadBanquet`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const usebanquetApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addBanquet = async (obj: any) => {
        return axios.post<GeneralApiResponse<IBanquet>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateBanquetById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteBanquetById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getBanquetById = async (id: any) => {
        return axios.get<GeneralApiResponse<IBanquet>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllBanquet = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IBanquet>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        getAllBanquet,
        updateBanquetById,
        deleteBanquetById,
        getBanquetById,
        addBanquet,
    };
};

export const useAddBanquet = () => {
    const queryClient = useQueryClient();
    const api = usebanquetApiHook();
    return useMutation({
        mutationFn: api.addBanquet,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Banquet"] });
        },
    });
};

export const useBanquetById = (id: string) => {
    const api = usebanquetApiHook();

    return useQuery({
        queryKey: ["banquet_id", id],
        queryFn: () => api.getBanquetById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useBanquet = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = usebanquetApiHook();

    return useQuery({
        queryKey: ["banquet", pagination, searchObj],
        queryFn: () => api.getAllBanquet(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IBanquet>,
    });
};

export const usedeleteBanquetById = () => {
    const api = usebanquetApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteBanquetById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["banquet"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateBanquetById = () => {
    const api = usebanquetApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateBanquetById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["banquet"] });
        },
    });
};
