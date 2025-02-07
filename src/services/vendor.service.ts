import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/vendor";
export interface IVendor {
  vendor: {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    landLine: string;
    phoneNumber: string;
    displayName: string;
  };

  otherDetails: {
    sourceOfSupply: string;
    gstTreatment: string;
    gstin: string;
    pan: string;
    msmeRegistered: boolean;
    currency: string;
    openingBalanceState: string;
    openingBalance: string;
    creditLimit: string;
    paymentTerms: string;
    tds: string;
    priceList: string;
    enablePortal: boolean;
    portalLanguage: string;
    documents?: [];
    websiteUrl: string;
    department: string;
    designation: string;
    skype: string;
    facebook: string;
    twitter: string;
  };

  billingAddress: {
    addressId: string;
    //   attention : string;
    billingCountry: string;
    billingAddressStreet1: string;
    billingAddressStreet2: string;
    billingCity: string;
    billingState: string;
    billingPincode: string;
    billingPhone: string;
    billingFaxNumber: string;
  };

  shipppingAddress: {
    //   attention : string;
    shippingCountry: string;
    shippingAddressStreet1: string;
    shippingAddressStreet2: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
    shippingPhone: string;
    shippingFaxNumber: string;
  };
  // contactPersons
  contactPersons: {
    salutation: string;
    contactPersonId: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactPersonEmail: string;
    contactPersonWorkPhone: string;
    contactPersonMobilePhone: string;
    contactPersonMobile: string;
  }[];

  documents?: string;
}

export const useVendorApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addVendor = async (obj: any) => {
    console.log(`${BASE_URL}${prefix}/`, "test");
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateVendorById = async ({ id, obj }: { id: string; obj: any }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };
  const deleteVendorById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getVendorById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllVendor = async (pagination: PaginationState, searchObj: any) => {
    console.log(`${BASE_URL}${prefix}/`, "test c");
    // const query = new URLSearchParams({
    //     pageIndex: String(pagination.pageIndex),
    //     pageSize: String(pagination.pageSize),
    //     ...searchObj,
    // }).toString();
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}`);
  };

  return {
    addVendor,
    deleteVendorById,
    updateVendorById,
    getVendorById,
    getAllVendor,
  };
};

export const useAddVendor = () => {
  const queryClient = useQueryClient();
  const api = useVendorApiHook();
  return useMutation({
    mutationFn: api.addVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useVendorById = (id: string) => {
  const api = useVendorApiHook();

  return useQuery({
    queryKey: ["Vendor_id", id],
    queryFn: () => api.getVendorById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useVendor = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useVendorApiHook();

  return useQuery({
    queryKey: ["Vendor", pagination, searchObj],
    queryFn: () =>
      api.getAllVendor(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteVendorById = () => {
  const api = useVendorApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteVendorById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Vendor"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateVendorById = () => {
  const api = useVendorApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateVendorById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};
