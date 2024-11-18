import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/brand";
console.log(BASE_URL)
export interface IBrand  {
    name: string,
    status : boolean
}


export const useBrandApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addBrand = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IBrand>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateBrandById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteBrandById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getBrandById = async (id: any) => {
        return axios.get<GeneralApiResponse<IBrand>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllBrand = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IBrand>>(`${BASE_URL}${prefix}/?${query}`);
    };

   
    return {
        addBrand, updateBrandById, deleteBrandById, getBrandById, getAllBrand
    };
};

export const useAddBrand = () => {

    const queryClient = useQueryClient();
    const api = useBrandApiHook()
    return useMutation({
        mutationFn: api.addBrand,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Brand"] });
            // toastSuccess(res);
        },
    });
};

export const useBrandById = (id: string) => {
    const api = useBrandApiHook()

    return useQuery({
        queryKey: ["Brand_id", id],
        queryFn: () => api.getBrandById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useBrand = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useBrandApiHook()

    return useQuery({
        queryKey: ["Brand", pagination, searchObj],
        queryFn: () => api.getAllBrand(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IBrand>,
    });
};


export const usedeleteBrandById = () => {
    const api = useBrandApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteBrandById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Brand"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateBrandById = () => {
    const api = useBrandApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateBrandById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Brand"] });
            // toastSuccess(res);
        },
    });
};


