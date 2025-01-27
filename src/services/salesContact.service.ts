
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/salesContact";
export interface ISalesContact {
    // Basic Details
        firstName: '',
        lastName:'',
        phone: '',
        email: '',
        salutation:"",
        company:"",

    
}



export const useSalesContactApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addSalesContact = async (obj: any) => {

        return axios.post<GeneralApiResponse<ISalesContact>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateSalesContactById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteSalesContactById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getSalesContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<ISalesContact>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllSalesContact = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ISalesContact>>(`${BASE_URL}${prefix}/?${query}`);
    };
    

    const convertEnquiry = async (id: any) => {
        return axios.post<GeneralApiResponse<ISalesContact>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllSalesContact,
        updateSalesContactById,
        deleteSalesContactById,
        getSalesContactById,
        addSalesContact,
        convertEnquiry
    };
};

export const useAddSalesContact = () => {
    const queryClient = useQueryClient();
    const api = useSalesContactApiHook();
    return useMutation({
        mutationFn: api.addSalesContact,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
        },
    });
};

export const useSalesContactById = (id: string) => {
    const api = useSalesContactApiHook();

    return useQuery({
        queryKey: ["Sales contact_id", id],
        queryFn: () => api.getSalesContactById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useSalesContact = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useSalesContactApiHook();


    return useQuery({
        queryKey: ["Sales Contact", pagination, searchObj],
        queryFn: () => api.getAllSalesContact(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ISalesContact>,
    });
};

export const usedeleteSalesContactById = () => {
    const api = useSalesContactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteSalesContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateSalesContactById = () => {
    const api = useSalesContactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateSalesContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addSalesContactsExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadSalesContacts`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const useConvert = () => {
    const api = useSalesContactApiHook();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.convertEnquiry,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
        },
    });
};

