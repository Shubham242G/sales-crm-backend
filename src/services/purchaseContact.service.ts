import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/purchaseContact";
export interface IpurchaseContact {
    // Basic Details
        firstName: '',
        lastName:'',
        phone: '',
        email: '',
        salutation:"",
        company:"",

    
}



export const usepurchaseContactApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addpurchaseContact = async (obj: any) => {

        return axios.post<GeneralApiResponse<IpurchaseContact>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updatepurchaseContactById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deletepurchaseContactById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getpurchaseContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<IpurchaseContact>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllpurchaseContact = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IpurchaseContact>>(`${BASE_URL}${prefix}/?${query}`);
    };
    

    const convertEnquiry = async (id: any) => {
        return axios.post<GeneralApiResponse<IpurchaseContact>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllpurchaseContact,
        updatepurchaseContactById,
        deletepurchaseContactById,
        getpurchaseContactById,
        addpurchaseContact,
        convertEnquiry
    };
};

export const useAddpurchaseContact = () => {
    const queryClient = useQueryClient();
    const api = usepurchaseContactApiHook();
    return useMutation({
        mutationFn: api.addpurchaseContact,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
        },
    });
};

export const usepurchaseContactById = (id: string) => {
    const api = usepurchaseContactApiHook();

    return useQuery({
        queryKey: ["Sales contact_id", id],
        queryFn: () => api.getpurchaseContactById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const usepurchaseContact = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = usepurchaseContactApiHook();


    return useQuery({
        queryKey: ["Sales Contact", pagination, searchObj],
        queryFn: () => api.getAllpurchaseContact(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IpurchaseContact>,
    });
};

export const usedeletepurchaseContactById = () => {
    const api = usepurchaseContactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deletepurchaseContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdatepurchaseContactById = () => {
    const api = usepurchaseContactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updatepurchaseContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addpurchaseContactsExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadpurchaseContacts`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const useConvert = () => {
    const api = usepurchaseContactApiHook();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.convertEnquiry,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Purchase Contact"] });
        },
    });
};

