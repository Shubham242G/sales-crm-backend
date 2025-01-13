
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/rpf";
export interface IRPF {
    // Basic Details
    _id: string; // Unique identifier
    rpfId: string;
    serviceType: string,
    eventDate: string,
    eventDetails: string,
    deadlineOfProposal: string,
    vendorList: string,
    additionalInstructions: string,
    // displayName: string;
    // companyName: string;
    // salutation: string;
    // firstName: string;
    // lastName: string;
    // phone: string;
    // currencyCode: string;
    // notes: string;
    // website: string;
    // status: string;
    // openingBalance: string;
    // openingBalanceExchangeRate: string;
    // branchId: string;
    // branchName: string;
    // bankAccountPayment: string;
    // portalEnabled: boolean;
    // creditLimit: string;
    // customerSubType: string;
    // department: string;
    // designation: string;
    // priceList: string;
    // paymentTerms: string;
    // paymentTermsLabel: string;

    // // Contact Information
    // emailId: string;
    // mobilePhone: string;
    // skypeIdentity: string;
    // facebook: string;
    // twitter: string;

    // // GST Details
    // gstTreatment: string;
    // gstin: string;
    // taxable: boolean;
    // taxId: string;
    // taxName: string;
    // taxPercentage: string;
    // exemptionReason: string;

    // // Billing Address
    // billingAttention: string;
    // billingAddress: string;
    // billingStreet2: string;
    // billingCity: string;
    // billingState: string;
    // billingCountry: string;
    // billingCounty: string;
    // billingCode: string;
    // billingPhone: string;
    // billingFax: string;

    // // Shipping Address
    // shippingAttention: string;
    // shippingAddress: string;
    // shippingStreet2: string;
    // shippingCity: string;
    // shippingState: string;
    // shippingCountry: string;
    // shippingCounty: string;
    // shippingCode: string;
    // shippingPhone: string;
    // shippingFax: string;

    // // Additional Details
    // placeOfContact: string;
    // placeOfContactWithStateCode: string;
    // contactAddressId: string;
    // source: string;
    // ownerName: string;
    // primaryContactId: string;
    // contactId: string;
    // contactName: string;
    // contactType: string;
    // lastSyncTime: string;
}



export const useRpfApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addRpf = async (obj: any) => {

        return axios.post<GeneralApiResponse<IRPF>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateRpfById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteRpfById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getRpfById = async (id: any) => {
        return axios.get<GeneralApiResponse<IRPF>>(`${BASE_URL}${prefix}/getById/${id}`);
    };



    const getAllRpf = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IRPF>>(`${BASE_URL}${prefix}?${query}`);
    };

    return {
        getAllRpf,
        updateRpfById,
        deleteRpfById,
        getRpfById,
        addRpf,

    };
};

export const useAddRpf = () => {
    const queryClient = useQueryClient();
    const api = useRpfApiHook();
    return useMutation({
        mutationFn: api.addRpf,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Rpf"] });
        },
    });
};

export const useRpfById = (id: string) => {
    const api = useRpfApiHook();

    return useQuery({
        queryKey: ["rpf_id", id],
        queryFn: () => api.getRpfById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useRpf = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useRpfApiHook();


    return useQuery({
        queryKey: ["Rpf", pagination, searchObj],
        queryFn: () => api.getAllRpf(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IRPF>,
    });
};

export const usedeleteRpfById = () => {
    const api = useRpfApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteRpfById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Rpf"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateRpfById = () => {
    const api = useRpfApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateRpfById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["rpf"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addRpfExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadEnquiries`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};



