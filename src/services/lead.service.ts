
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/lead";
export interface ILead {
    // Basic Details


    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    panNumber: '',
    gstNumber: '',

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

    const getAllLead = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ILead>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const convertEnquiry = async (id: any) => {
        return axios.post<GeneralApiResponse<ILead>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllLead,
        updateLeadById,
        deleteLeadById,
        getContactById,
        addLead,

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

export const useLeadById = (id: string) => {
    const api = useleadApiHook();

    return useQuery({
        queryKey: ["lead_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id,
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








