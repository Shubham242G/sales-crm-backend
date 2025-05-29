
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/contactUs";
export interface IContact {
    // Basic Details
    _id: string; // Unique identifier
    name: string;
    phone: string;
    email: string;
    typeOfContact: string;
}



export const usecontactApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addContact = async (obj: any) => {

        return axios.post<GeneralApiResponse<IContact>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateContactById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteContactById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<IContact>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllContact = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IContact>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        getAllContact,
        updateContactById,
        deleteContactById,
        getContactById,
        addContact,
    };
};

export const useAddContact = () => {
    const queryClient = useQueryClient();
    const api = usecontactApiHook();
    return useMutation({
        mutationFn: api.addContact,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Contact"] });
        },
    });
};

// Customer Outstanding
export const getCustomerOutstandingExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getCustomerOutstandingExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addCustomerOutstandingExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadCustomerOutstanding`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const useContactById = (id: string) => {
    const api = usecontactApiHook();

    return useQuery({
        queryKey: ["contact_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useContact = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = usecontactApiHook();


    return useQuery({
        queryKey: ["contact", pagination, searchObj],
        queryFn: () => api.getAllContact(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IContact>,
    });
};

export const usedeleteContactById = () => {
    const api = usecontactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateContactById = () => {
    const api = usecontactApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateContactById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addContactsExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadContacts`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

