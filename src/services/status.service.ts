import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/status";

export interface IStatus  {
    statusId: string,
    status: string
    
}



export const useStatusApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addStatus = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IStatus>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateStatusById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteStatusById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getStatusById = async (id: any) => {
        return axios.get<GeneralApiResponse<IStatus>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllStatus = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IStatus>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addStatus, deleteStatusById, updateStatusById, getStatusById, getAllStatus
    };
};

export const useAddStatus = () => {

    const queryClient = useQueryClient();
    const api = useStatusApiHook()
    return useMutation({
        mutationFn: api.addStatus,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Status"] });
        },
    });
};

export const useStatusById = (id: string) => {
    const api = useStatusApiHook()

    return useQuery({
        queryKey: ["Status_id", id],
        queryFn: () => api.getStatusById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useStatus = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useStatusApiHook()

    return useQuery({
        queryKey: ["Status", pagination, searchObj],
        queryFn: () => api.getAllStatus(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IStatus>,
    });
};



export const usedeleteStatusById = () => {
    const api = useStatusApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteStatusById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Status"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateStatusById = () => {
    const api = useStatusApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateStatusById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Status"] });
        },
    });
};