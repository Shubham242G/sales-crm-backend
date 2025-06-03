import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


interface IvendorList {
    label: string, 
    value: string
}

const prefix = "/rfp";
export interface IRPF {
    // Basic Details
    _id: string; // Unique identifier
    rfpId: string;
    serviceType: [],
    status: string,
    leadId: string,
    displayName: string;
    eventDates: [
        {
        startDate: string,
        endDate: string,
    }],
    eventDetails: string,
    deadlineOfProposal: string,
    vendorList: IvendorList[],
    additionalInstructions: string,
    markupPercentage: number,
    
}

// RFPS
export const getRFPSExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addRFPSExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadRFPS`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};



export const useRfpApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addRfp = async (obj: any) => {

        return axios.post<GeneralApiResponse<IRPF>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateRfpById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteRfpById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getRfpById = async (id: any) => {
        return axios.get<GeneralApiResponse<IRPF>>(`${BASE_URL}${prefix}/getById/${id}`);
    };


    const convertRfp = async (id: string) => {
        return axios.post<GeneralApiResponse<IRPF>>(`${BASE_URL}${prefix}/convertRfp/${id}`);
    };

    const getAllRfp = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IRPF>>(`${BASE_URL}${prefix}?${query}`);
    };

    return {
        getAllRfp,
        updateRfpById,
        deleteRfpById,
        getRfpById,
        addRfp,
        convertRfp

    };
};

export const useAddRfp = () => {
    const queryClient = useQueryClient();
    const api = useRfpApiHook();
    return useMutation({
        mutationFn: api.addRfp,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Rfp"] });
        },
    });
};

export const useRfpById = (id: string) => {
    const api = useRfpApiHook();

    return useQuery({
        queryKey: ["rfp_id", id],
        queryFn: () => api.getRfpById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useRfp = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useRfpApiHook();


    return useQuery({
        queryKey: ["Rfp", pagination, searchObj],
        queryFn: () => api.getAllRfp(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IRPF>,
    });
};

export const usedeleteRfpById = () => {
    const api = useRfpApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteRfpById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Rfp"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateRfpById = () => {
    const api = useRfpApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateRfpById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["rfp"] });
        },
    });
};export const useConvertRfpToQuotesFromVendor = () => {
    const api = useRfpApiHook();
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: api.convertRfp,
      onSuccess: (res) => {
      
        queryClient.invalidateQueries({ queryKey: ["Rfp"] });
      },
    });
  };

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addRfpExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadEnquiries`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};