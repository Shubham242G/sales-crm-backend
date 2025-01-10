
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/enquiry";
export interface IEnqiry {
    // Basic Details
    _id: string; // Unique identifier
    name: string;
    phone: string;
    email: string;
    typeOfContact: string;
    contactId: string;
    subject: string;
    details: string;
    priority: string;
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



export const useEnquiryApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addEnquiry = async (obj: any) => {

        return axios.post<GeneralApiResponse<IEnqiry>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateEnquiryById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteEnquiryById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getEnquiryById = async (id: any) => {
        return axios.get<GeneralApiResponse<IEnqiry>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    

    const getAllEnquiry = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IEnqiry>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        getAllEnquiry,
        updateEnquiryById,
        deleteEnquiryById,
        getEnquiryById,
        addEnquiry,
       
    };
};

export const useAddEnquiry = () => {
    const queryClient = useQueryClient();
    const api = useEnquiryApiHook();
    return useMutation({
        mutationFn: api.addEnquiry,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Enquiry"] });
        },
    });
};

export const useEnquiryById = (id: string) => {
    const api = useEnquiryApiHook();

    return useQuery({
        queryKey: ["enquiry_id", id],
        queryFn: () => api.getEnquiryById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useEnquiry = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useEnquiryApiHook();


    return useQuery({
        queryKey: ["contact", pagination, searchObj],
        queryFn: () => api.getAllEnquiry(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IEnqiry>,
    });
};

export const usedeleteEnquiryById = () => {
    const api = useEnquiryApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteEnquiryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Enquiry"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateContactById = () => {
    const api = useEnquiryApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateEnquiryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addEnquiryExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadContacts`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};



