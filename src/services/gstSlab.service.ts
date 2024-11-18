import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/gstSlab";
export interface IGstSlab  {
    _id: string,
    label: string,
    value: string,
    cgst: number,
    sgst: number,
    igst: number,
    status: boolean,
    createdAt: Date,
    updateAt: Date,
}



export const useGstSlabApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addGstSlab = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IGstSlab>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateGstSlabById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteGstSlabById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getGstSlabById = async (id: any) => {
        return axios.get<GeneralApiResponse<IGstSlab>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllGstSlab = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IGstSlab>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addGstSlab, deleteGstSlabById, updateGstSlabById, getGstSlabById, getAllGstSlab
    };
};

export const useAddGstSlab = () => {

    const queryClient = useQueryClient();
    const api = useGstSlabApiHook()
    return useMutation({
        mutationFn: api.addGstSlab,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["GstSlab"] });
        },
    });
};

export const useGstSlabById = (id: string) => {
    const api = useGstSlabApiHook()

    return useQuery({
        queryKey: ["GstSlab_id", id],
        queryFn: () => api.getGstSlabById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useGstSlab = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useGstSlabApiHook()

    return useQuery({
        queryKey: ["GstSlab", pagination, searchObj],
        queryFn: () => api.getAllGstSlab(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IGstSlab>,
    });
};



export const usedeleteGstSlabById = () => {
    const api = useGstSlabApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteGstSlabById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["GstSlab"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateGstSlabById = () => {
    const api = useGstSlabApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateGstSlabById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["GstSlab"] });
        },
    });
};


