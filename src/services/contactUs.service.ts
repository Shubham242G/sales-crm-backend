
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

    const convertEnquiry = async (id: any) => {
        return axios.post<GeneralApiResponse<IContact>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllContact,
        updateContactById,
        deleteContactById,
        getContactById,
        addContact,
        convertEnquiry
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

export const useConvert = () => {
    const api = usecontactApiHook();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.convertEnquiry,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
        },
    });
};

