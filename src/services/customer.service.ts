// import { usePagination } from "../libs/hooks/usePagination";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { PaginationState } from "@tanstack/react-table";
// import BASE_URL, {
//   GeneralApiResponse,
//   GeneralApiResponsePagination,
// } from "./urls.service";
// import axios from "../libs/hooks/axios";
// import { CHARGE_TYPE } from "@/common/constant.common";
// import { toastError, toastSuccess } from "@/utils/toast";
// import { AxiosError } from "axios";
// // import useAxiosAuth from "@/libs/hooks/useAxiosAuth";

// const prefix = "/customer";
// type communicationChannelsProps = {

//   prefersEmail: boolean  ,
//   prefersSms : boolean ,
//   }
// export interface IContactPerson {
//     salutation: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     workPhone: string;
//     mobilePhone: string;
//     communicationChannels: communicationChannelsProps;
//   }

// export interface ICustomer {
//   // Basic Details
//   _id: string;
//   contactName: string;
//   contactOwner: string;
//   companyName: string;
//   firstName: string;
//   lastName: string;
//   customerType: string;
//   taxPreference: string;
//   enablePortal: boolean;
//   gstTreatment: string;
//   openingBalanceState: string;
//   openingBalance: string;
//   creditLimit: string;
//   email: string;
//   phoneNumber: string;
//   panNumber: string;
//   placeOfSupply: string;
//   prefersEmail: boolean;
//   prefersSms: boolean;
//   state: string;
//   city: string;
//   Area: string;
//   Address: string;
//   bankName: string;
//   bankAccountNumber: string;
//   bankIFSCCode: string;
//   salutation: string;
//   contactPersonName: string;
//   contactPersonEmail: string;
//   contactPersonPhoneNumber: string;
//   workPhone?: string;
//   mobile?: string;
//   displayName?: string;
//   currency?: string;
//   paymentTerms?: string;
//   priceList?: string;
//   portalLanguage?: string;
//   // attention?: string;
//   countryRegion?: string;
//   addressStreet1?: string;
//   addressStreet2?: string;
//   pinCode?: string;
//   faxNumber?: string;
//   // shippingAttention?: string;
//   shippingCountryRegion?: string;
//   shippingAddressStreet1?: string;
//   shippingAddressStreet2?: string;
//   shippingCity?: string;
//   shippingState?: string;
//   shippingPhoneNumber?: string;
//   shippingPinCode?: string;
//   shippingFaxNumber?: string;
//   contactPersons: IContactPerson[];
//   documentArray: string[];
//   websiteUrl: string;
//   department: string;
//   designation: string;
//   skype: string;
//   facebook: string;
//   twitter: string;
//   // communicationChannels: string[];
// //   contactPersonsSalutation?: string;
// //   contactPersonsFirstName?: string;
// //   contactPersonsLastName?: string;
// //   contactPersonsEmail?: string;
// //   contactPersonsWorkPhone?: string;
// //   contactPersonsMobile?: string;
// //   contactPersonsCommunicationChannels?: string[];
// }

// export const usecustomerApiHook = () => {
//   // const axiosAuth = useAxiosAuth({});
//   const addCustomer = async (obj: any) => {
//     return axios.post<GeneralApiResponse<ICustomer>>(
//       `${BASE_URL}${prefix}/`,
//       obj
//     );
//   };
//   const updateCustomerById = async ({ id, obj }: { id: string; obj: any }) => {
//     return axios.patch<GeneralApiResponse>(
//       `${BASE_URL}${prefix}/updateById/${id}`,
//       obj
//     );
//   };
//   const deleteCustomerById = async (id: any) => {
//     return axios.delete<GeneralApiResponse>(
//       `${BASE_URL}${prefix}/deleteById/${id}`
//     );
//   };
//   const getCustomerById = async (id: any) => {
//     return axios.get<GeneralApiResponse<ICustomer>>(
//       `${BASE_URL}${prefix}/getById/${id}`
//     );
//   };

//   const getAllCustomer = async (
//     pagination: PaginationState,
//     searchObj: any
//   ) => {
//     const query = new URLSearchParams({
//       pageIndex: String(pagination.pageIndex),
//       pageSize: String(pagination.pageSize),
//       ...searchObj,
//     }).toString();
//     return axios.get<GeneralApiResponsePagination<ICustomer>>(
//       `${BASE_URL}/${prefix}?${query}`
//     );
//   };

//   const convertEnquiry = async (id: any) => {
//     return axios.post<GeneralApiResponse<ICustomer>>(
//       `${BASE_URL}${prefix}/convert/${id}`
//     );

//   };

//   const bulkUpload = async (obj: any) => {
//       return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/bulkUpload`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
//     }

//   return {
//     getAllCustomer,
//     updateCustomerById,
//     deleteCustomerById,
//     getCustomerById,
//     addCustomer,
//     convertEnquiry,
//     bulkUpload
//   };
// };

// export const useAddCustomer = () => {
//   const queryClient = useQueryClient();
//   const api = usecustomerApiHook();
//   return useMutation({
//     mutationFn: api.addCustomer,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({ queryKey: ["Customer"] });
//     //   toastSuccess(res.data.message);
//     },
//     onError: (error: AxiosError<GeneralApiResponse>) => {
//         toastError(error.response?.data?.message || "Failed to create customer");
//       }
//   });
// };

// export const useCustomerById = (id: string) => {
//   const api = usecustomerApiHook();

//   return useQuery({
//     queryKey: ["customer_id", id],
//     queryFn: () => api.getCustomerById(id).then((res) => res.data),
//     enabled: !!id,
//   });
// };

// export const useCustomer = (
//   searchObj: Record<string, any> = {},
//   getPaginationFromParams = true
// ) => {
//   const pagination = usePagination(getPaginationFromParams);

//   const api = usecustomerApiHook();

//   return useQuery({
//     queryKey: ["customer", pagination, searchObj],
//     queryFn: () =>
//       api.getAllCustomer(pagination, searchObj).then((res) => res?.data),
//     initialData: {
//       data: [],
//       total: 0,
//       message: "",
//     } as unknown as GeneralApiResponsePagination<ICustomer>,
//   });
// };

// export const usedeleteCustomerById = () => {
//   const api = usecustomerApiHook();

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.deleteCustomerById,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({ queryKey: ["customer"] });
//       // toastSuccess(res);
//     },
//   });
// };

// export const useUpdateCustomerById = () => {
//   const api = usecustomerApiHook();

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.updateCustomerById,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({ queryKey: ["customer"] });
//     },
//   });
// };

// export const useBulkUpload = () => {
//   const api = usecustomerApiHook();
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: api.bulkUpload,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["vendorBulkUpload"] });
//     }
//   })
// }
// export const getExel = async () => {
//     return axios.get(`${BASE_URL}${prefix}/getExel`);
// };

// export const addCustomersExel = async (obj: any,) => {

//     return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadCustomers`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
// };

// export const useConvert = () => {
//     const api = usecustomerApiHook();
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: api.convertEnquiry,
//         onSuccess: (res) => {
//             queryClient.invalidateQueries({ queryKey: ["customer"] });
//         },
//     });
// };

// src/services/useZohoCustomerApiHook.ts

import axios from "../libs/hooks/axios";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import { PaginationState } from "@tanstack/react-table";
import { usePagination } from "../libs/hooks/usePagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const prefix = "/customer";

export interface Address {
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax?: string;
  phone?: string;
}

export interface ContactPerson {
  salutation?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  designation?: string;
  department?: string;
}

export interface ICustomer {

  _id: string;
  customerType: 'Business' | 'Individual' | string;
  address: Address;
  contactPerson: ContactPerson;
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  email: string;
  workPhone: string;
  mobile: string;
  panNumber: string;
  placeOfSupply: string;
  prefersEmail: boolean;
  prefersSms: boolean;
  gstTreatment: string;
  taxPreference: 'Taxable' | 'Non-Taxable' | string;
  currency: string;
  paymentTerms: string;
  priceList: string;
  enablePortal: boolean;
  portalLanguage: string;
  openingBalanceState: string;
  openingBalance: string;
  creditLimit: string;
  countryRegion: string;
  addressStreet1: string;
  addressStreet2: string;
  city: string;
  state: string;
  phoneNumber: string;
  pinCode: string;
  faxNumber: string;
  shippingCountryRegion: string;
  shippingAddressStreet1: string;
  shippingAddressStreet2: string;
  shippingCity: string;
  shippingState: string;
  shippingPhoneNumber: string;
  shippingPinCode: string;
  shippingFaxNumber: string;
  contactPersons: ContactPerson[];
  documentArray: any[]; // You can type this properly if you have docs schema
  websiteUrl: string;
  department: string;
  designation: string;
  twitter: string;
  skype: string;
  facebook: string;
}

export const useZohoCustomerApiHook = () => {
  // Get all customers with pagination + search
  const getAllCustomers = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();

    return axios.get<GeneralApiResponsePagination<ICustomer>>(`${BASE_URL}${prefix}/customers?${query}`);
  };









  // Sync customers from Zoho
  const syncCustomers = async () => {
    return axios.get<GeneralApiResponse<{ createdCount: number; updatedCount: number }>>(
      `${BASE_URL}${prefix}/sync`
    );
  };

  // Get a customer by ID
  const getCustomerById = async (id: string) => {
    return axios.get<GeneralApiResponse<ICustomer>>(`${BASE_URL}${prefix}/customersById/${id}`);
  };


  const addCustomer = async (obj: any) => {
    return axios.post<GeneralApiResponse<ICustomer>>(`${BASE_URL}${prefix}/addCustomer`, obj);
  };

  const updateCustomerById = async ({ id, obj }: { id: string, obj: any }) => {
    return axios.post<GeneralApiResponse<ICustomer>>(`${BASE_URL}${prefix}/updateCustomer/${id}`, obj);
  };

  const deleteCustomerById = async (id: any) => {
    return axios.delete<GeneralApiResponse<ICustomer>>(`${BASE_URL}${prefix}/deleteCustomer/${id}`);
  };
  return {
    getAllCustomers,
    syncCustomers,
    getCustomerById,
    addCustomer,
    updateCustomerById,
    deleteCustomerById
  };
};

// Get all customers
export const useZohoCustomers = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
  const pagination = usePagination(getPaginationFromParams);
  const api = useZohoCustomerApiHook();

  return useQuery({
    queryKey: ["zohoCustomers", pagination, searchObj],
    queryFn: () => api.getAllCustomers(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<ICustomer>,
  });
};




// Get a customer by ID
export const useZohoCustomerById = (id: string) => {
  const api = useZohoCustomerApiHook();

  return useQuery({
    queryKey: ["zohoCustomer_id", id],
    queryFn: () => api.getCustomerById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useAddCustomer = () => {

  const queryClient = useQueryClient();
  const api = useZohoCustomerApiHook()
  return useMutation({
    mutationFn: api.addCustomer,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Customer_Add"] });
    },
  });
};

export const updateCustomerById = () => {

  const queryClient = useQueryClient();
  const api = useZohoCustomerApiHook()
  return useMutation({
    mutationFn: api.updateCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customer_update"] });
    },
  });
};

export const deleteCustomerById = () => {

  const queryClient = useQueryClient();
  const api = useZohoCustomerApiHook()
  return useMutation({
    mutationFn: api.deleteCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zohoCustomers"] });
    },
  });
};

// Sync customers from Zoho
export const useSyncZohoCustomers = () => {
  const queryClient = useQueryClient();
  const api = useZohoCustomerApiHook();

  return useMutation({
    mutationFn: api.syncCustomers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zohoCustomers_sync"] });
    },
  });
};
