import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { toastError, toastSuccess } from "@/utils/toast";
import { AxiosError } from "axios";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";

const prefix = "/customer";
type communicationChannelsProps = {

  prefersEmail: boolean  ,
  prefersSms : boolean ,
  }
export interface IContactPerson {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    communicationChannels: communicationChannelsProps;
  }

export interface ICustomer {
  // Basic Details
  _id: string;
  contactName: string;
  contactOwner: string;
  companyName: string;
  firstName: string;
  lastName: string;
  customerType: string;
  taxPreference: string;
  enablePortal: boolean;
  gstTreatment: string;
  email: string;
  phoneNumber: string;
  panNumber: string;
  placeOfSupply: string;
  prefersEmail: boolean;
  prefersSms: boolean;
  state: string;
  city: string;
  Area: string;
  Address: string;
  bankName: string;
  bankAccountNumber: string;
  bankIFSCCode: string;
  salutation: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhoneNumber: string;
  workPhone?: string;
  mobile?: string;
  displayName?: string;
  currency?: string;
  paymentTerms?: string;
  priceList?: string;
  portalLanguage?: string;
  attention?: string;
  countryRegion?: string;
  addressStreet1?: string;
  addressStreet2?: string;
  pinCode?: string;
  faxNumber?: string;
  shippingAttention?: string;
  shippingCountryRegion?: string;
  shippingAddressStreet1?: string;
  shippingAddressStreet2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPhoneNumber?: string;
  shippingPinCode?: string;
  shippingFaxNumber?: string;
  contactPersons: IContactPerson[];
  documentArray: string[];
  // communicationChannels: string[];
//   contactPersonsSalutation?: string;
//   contactPersonsFirstName?: string;
//   contactPersonsLastName?: string;
//   contactPersonsEmail?: string;
//   contactPersonsWorkPhone?: string;
//   contactPersonsMobile?: string;
//   contactPersonsCommunicationChannels?: string[];
}

export const usecustomerApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addCustomer = async (obj: any) => {
    return axios.post<GeneralApiResponse<ICustomer>>(
      `${BASE_URL}${prefix}/`,
      obj
    );
  };
  const updateCustomerById = async ({ id, obj }: { id: string; obj: any }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };
  const deleteCustomerById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getCustomerById = async (id: any) => {
    return axios.get<GeneralApiResponse<ICustomer>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllCustomer = async (
    pagination: PaginationState,
    searchObj: any
  ) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axios.get<GeneralApiResponsePagination<ICustomer>>(
      `${BASE_URL}/${prefix}?${query}`
    );
  };

  const convertEnquiry = async (id: any) => {
    return axios.post<GeneralApiResponse<ICustomer>>(
      `${BASE_URL}${prefix}/convert/${id}`
    );
  };

  return {
    getAllCustomer,
    updateCustomerById,
    deleteCustomerById,
    getCustomerById,
    addCustomer,
    convertEnquiry,
  };
};

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  const api = usecustomerApiHook();
  return useMutation({
    mutationFn: api.addCustomer,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Customer"] });
    //   toastSuccess(res.data.message);
    },
    onError: (error: AxiosError<GeneralApiResponse>) => {
        toastError(error.response?.data?.message || "Failed to create customer");
      }
  });
};

export const useCustomerById = (id: string) => {
  const api = usecustomerApiHook();

  return useQuery({
    queryKey: ["customer_id", id],
    queryFn: () => api.getCustomerById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCustomer = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = usecustomerApiHook();

  return useQuery({
    queryKey: ["customer", pagination, searchObj],
    queryFn: () =>
      api.getAllCustomer(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<ICustomer>,
  });
};

export const usedeleteCustomerById = () => {
  const api = usecustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateCustomerById = () => {
  const api = usecustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

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
