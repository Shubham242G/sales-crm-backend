
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination, ReactSelectFormat } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/leadManagement";
export interface ILeadManagement {
    // Basic Details
   
    userId: string,
    leadIds : string[],
}









export const useleadManagementApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addLeadManagement = async (obj: any) => {

        return axios.post<GeneralApiResponse<ILeadManagement>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateLeadManagementById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteLeadManagementById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };

    const getLeadManagementById = async (id: any) => {
        return axios.get<GeneralApiResponse<ILeadManagement>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
    

    

    const getAllLeadManagement = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ILeadManagement>>(`${BASE_URL}${prefix}/?${query}`);
    };



  

 

  






    return {
        getAllLeadManagement,
        updateLeadManagementById,
        deleteLeadManagementById,
      getLeadManagementById,
        addLeadManagement

    };
};

export const useAddLeadManagement = () => {
    const queryClient = useQueryClient();
    const api = useleadManagementApiHook();
    return useMutation({
        mutationFn: api.addLeadManagement,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
        },
    });
};

export const useLeadManagementById = (id: string, enabled: boolean = true) => {
    const api = useleadManagementApiHook();

    return useQuery({
        queryKey: ["lead_id", id],
        queryFn: () => api.getLeadManagementById(id).then((res) => res.data),
        enabled: !!id && enabled,
    });
};

export const useLeadManagement = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useleadManagementApiHook();


    return useQuery({
        queryKey: ["lead", pagination, searchObj],
        queryFn: () => api.getAllLeadManagement(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ILeadManagement>,
    });
};

export const usedeleteLeadManagementById = () => {
    const api = useleadManagementApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteLeadManagementById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateLeadManagementById = () => {
    const api = useleadManagementApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateLeadManagementById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
        },
    });
};

















