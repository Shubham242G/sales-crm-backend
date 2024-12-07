import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/vendor";
export interface ICategory  {
    name: string,
    _id: string;
    createdAt: Date;
    updateAt: Date;
    label:string;
    value:string;
}



export const useVendorApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addVendor = async (obj: any,) => {
        console.log(`${BASE_URL}${prefix}/`,"test")
        return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateCategoryById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteCategoryById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };  
    const getCategoryById = async (id: any) => {
        return axios.get<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllCategory = async (pagination: PaginationState, searchObj: any) => {
        console.log(`${BASE_URL}${prefix}/`,"test c")
        // const query = new URLSearchParams({
        //     pageIndex: String(pagination.pageIndex),
        //     pageSize: String(pagination.pageSize),
        //     ...searchObj,
        // }).toString();
        return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}`);
    };

    return {
        addVendor, deleteCategoryById, updateCategoryById, getCategoryById, getAllCategory
    };
};

export const useAddVendor = () => {

    const queryClient = useQueryClient();
    const api = useVendorApiHook()
    return useMutation({
        mutationFn: api.addVendor,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["vendor"] });
        },
    });
};

export const useCategoryById = (id: string) => {
    const api = useVendorApiHook()

    return useQuery({
        queryKey: ["Category_id", id],
        queryFn: () => api.getCategoryById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useCategory = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useVendorApiHook()

    return useQuery({
        queryKey: ["Category", pagination, searchObj],
        queryFn: () => api.getAllCategory(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<any>,
    });
};



export const usedeleteCategoryById = () => {
    const api = useVendorApiHook()
    
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
    const api = useVendorApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateCategoryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Category"] });
        },
    });
};


