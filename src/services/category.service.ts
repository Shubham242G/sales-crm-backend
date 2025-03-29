import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/category";
export interface ICategory {
    _id: string;
    name: string,
  
    createdAt: Date;
    updateAt: Date;
    label: string;
    value: string;
}



export const useCategoryApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addCategory = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ICategory>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateCategoryById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteCategoryById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getCategoryById = async (id: any) => {
        return axios.get<GeneralApiResponse<ICategory>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllCategory = async (pagination: PaginationState, searchObj: any) => {
        // const query = new URLSearchParams({
        //     pageIndex: String(pagination.pageIndex),
        //     pageSize: String(pagination.pageSize),
        //     ...searchObj,
        // }).toString();
        return axios.get<GeneralApiResponsePagination<ICategory>>(`${BASE_URL}${prefix}`);
    };

    return {
        addCategory, deleteCategoryById, updateCategoryById, getCategoryById, getAllCategory
    };
};

export const useAddCategory = () => {

    const queryClient = useQueryClient();
    const api = useCategoryApiHook()
    return useMutation({
        mutationFn: api.addCategory,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Category"] });
        },
    });
};

export const useCategoryById = (id: string) => {
    const api = useCategoryApiHook()

    return useQuery({
        queryKey: ["Category_id", id],
        queryFn: () => api.getCategoryById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useCategory = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useCategoryApiHook()

    return useQuery({
        queryKey: ["Category", pagination, searchObj],
        queryFn: () => api.getAllCategory(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ICategory>,
    });
};



export const usedeleteCategoryById = () => {
    const api = useCategoryApiHook()

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteCategoryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Category"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateCategoryById = () => {
    const api = useCategoryApiHook()

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateCategoryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Category"] });
        },
    });
};


