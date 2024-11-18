import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/subCategory";
export interface ISubCategory  {
    name: string,
    categoryId : string,
    status: boolean,
    _id: string;
    createdAt: Date;
    updateAt: Date;
}



export const useSubCategoryApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addSubCategory = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ISubCategory>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateSubCategoryById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteSubCategoryById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getSubCategoryById = async (id: any) => {
        return axios.get<GeneralApiResponse<ISubCategory>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllSubCategory = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ISubCategory>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addSubCategory, deleteSubCategoryById, updateSubCategoryById, getSubCategoryById, getAllSubCategory
    };
};

export const useAddSubCategory = () => {

    const queryClient = useQueryClient();
    const api = useSubCategoryApiHook()
    return useMutation({
        mutationFn: api.addSubCategory,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SubCategory"] });
        },
    });
};

export const useSubCategoryById = (id: string) => {
    const api = useSubCategoryApiHook()

    return useQuery({
        queryKey: ["SubCategory_id", id],
        queryFn: () => api.getSubCategoryById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useSubCategory = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useSubCategoryApiHook()

    return useQuery({
        queryKey: ["SubCategory", pagination, searchObj],
        queryFn: () => api.getAllSubCategory(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ISubCategory>,
    });
};



export const usedeleteSubCategoryById = () => {
    const api = useSubCategoryApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteSubCategoryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SubCategory"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateSubCategoryById = () => {
    const api = useSubCategoryApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateSubCategoryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SubCategory"] });
        },
    });
};


