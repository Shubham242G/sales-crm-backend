
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination, ReactSelectFormat } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/lead";
export interface ILead {
    // Basic Details
    _id: string,
    salutation: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    company: string,
    leadOwner: string,
    displayName: string,
}




export interface Inew extends ILead {
    id: string,
}




export const useleadApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addLead = async (obj: any) => {

        return axios.post<GeneralApiResponse<ILead>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateLeadById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteLeadById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<ILead>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const convertToEnquiry = async (id: any) => {
        return axios.get<GeneralApiResponse<Inew>>(`${BASE_URL}${prefix}/convertToEnquiry/${id}`);
    }

    const getAllLead = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ILead>>(`${BASE_URL}${prefix}/?${query}`);
    };



    const convertToContact = async (id: any) => {
        return axios.get<GeneralApiResponse<ILead>>(`${BASE_URL}${prefix}/convertToContact/${id}`);
    }

    const getAllLeadName = async (searchObj: any) => {
        const query = new URLSearchParams({
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ReactSelectFormat[]>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const getCompanyName = async (fullName: string) => {


        return axios.get<GeneralApiResponse<ILead>>(`${BASE_URL}${prefix}/getCompanyName/${fullName}`);
    };






    return {
        getAllLead,
        updateLeadById,
        deleteLeadById,
        getContactById,
        addLead,
        convertToContact,
        getAllLeadName,
        getCompanyName,
        convertToEnquiry

    };
};

export const useAddLead = () => {
    const queryClient = useQueryClient();
    const api = useleadApiHook();
    return useMutation({
        mutationFn: api.addLead,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
        },
    });
};

export const useLeadById = (id: string, enabled: boolean = true) => {
    const api = useleadApiHook();

    return useQuery({
        queryKey: ["lead_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id && enabled,
    });
};

export const useLead = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useleadApiHook();


    return useQuery({
        queryKey: ["lead", pagination, searchObj],
        queryFn: () => api.getAllLead(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ILead>,
    });
};

export const usedeleteLeadById = () => {
    const api = useleadApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteLeadById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateLeadById = () => {
    const api = useleadApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateLeadById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lead"] });
        },
    });
};


export const useConvertLeadToContact = () => {
    const api = useleadApiHook();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.convertToContact,
        onSuccess: (res) => {

            queryClient.invalidateQueries({ queryKey: ["LeadConvert"] });
        },
    });
}

export const useConvertLeadToEnquiry = () => {
    const api = useleadApiHook();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.convertToEnquiry,
        onSuccess: (res) => {

            queryClient.invalidateQueries({ queryKey: ["LeadConvertToEnquiry"] });
        },
    });
}

export const getExel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getExel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};


export const addLeadExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadLeads`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const useLeadName = (
    searchObj: Record<string, any> = {},
) => {



    const api = useleadApiHook();
    return useQuery({
        queryKey: ["LeadName", searchObj],
        queryFn: () =>
            api.getAllLeadName(searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ReactSelectFormat[]>
    });
};

export const useCompanyName = (fullName: string,

) => {



    const api = useleadApiHook();
    return useQuery({
        queryKey: ["LeadCompanyName", fullName],
        queryFn: () =>
            api.getCompanyName(fullName).then((res) => res?.data),
        initialData: {
            data: [],
            message: "",
        } as unknown as GeneralApiResponse<ILead>,
    });
};




