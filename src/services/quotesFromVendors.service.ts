import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/QuotesFromVendors";

export interface IQuotesFromVendors {
  quotesId: string;
  displayName: string;
  vendorList: {
    label: string;
    value: string;
  };
  serviceType: [];
  rfpId: string;
  amount: string;
  leadId: string;
  receivedDate: string;
  status: string;
  attachment: string[];
  enquiryId: string;
  eventDates: [
    {
      startDate: Date;
    }
  ];
  markupDetails: {
    label: string;
    markupAmount: string;
  }[];
}
[];

// Quotes from Vendors
export const getQuotesFromVendorsExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getQuotesFromVendorsExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addQuotesFromVendorsExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadQuotesFromVendors`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const useQuotesFromVendorsApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addQuotesFromVendors = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateQuotesFromVendorsById = async ({
    id,
    obj,
  }: {
    id: string;
    obj: any;
  }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };

  // const convertToQuotesFromVendors = async (id: any) => {
  //   return axios.post<GeneralApiResponse<IQuotesFromVendors>>(
  //     `${BASE_URL}${prefix}/convert/${id}`
  //   );
  // };

  const deleteQuotesFromVendorsById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getQuotesFromVendorsById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllQuotesFromVendors = async (
    pagination: PaginationState,
    searchObj: any
  ) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}?${query}`);
  };

  const convertQuotesFromVendorToQuotesToCustomer = async (id: string) => {
    return axios.post<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/convert/${id}`
    );
  };

  return {
    addQuotesFromVendors,
    deleteQuotesFromVendorsById,
    updateQuotesFromVendorsById,
    getQuotesFromVendorsById,
    getAllQuotesFromVendors,
    // convertToQuotesFromVendors,
    convertQuotesFromVendorToQuotesToCustomer,
  };
};

export const useAddQuotesFromVendors = () => {
  const queryClient = useQueryClient();
  const api = useQuotesFromVendorsApiHook();
  return useMutation({
    mutationFn: api.addQuotesFromVendors,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quotesFromVendors"] });
    },
  });
};

export const useQuotesFromVendorsById = (id: string) => {
  const api = useQuotesFromVendorsApiHook();

  return useQuery({
    queryKey: ["QuotesFromVendors_id", id],
    queryFn: () => api.getQuotesFromVendorsById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useQuotesFromVendors = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useQuotesFromVendorsApiHook();

  return useQuery({
    queryKey: ["QuotesFromVendors", pagination, searchObj],
    queryFn: () =>
      api
        .getAllQuotesFromVendors(pagination, searchObj)
        .then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteQuotesFromVendorsById = () => {
  const api = useQuotesFromVendorsApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteQuotesFromVendorsById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["QuotesFromVendors"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateQuotesFromVendorsById = () => {
  const api = useQuotesFromVendorsApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateQuotesFromVendorsById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quotesFromVendors"] });
    },
  });
};

export const useConvertQuotesFromVendorToQuotesToCustomer = () => {
  const api = useQuotesFromVendorsApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.convertQuotesFromVendorToQuotesToCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotesToCustomer"] });
      queryClient.invalidateQueries({ queryKey: ["quotesFromVendors"] });
    },
  });
};


// export const useConvertQuotesFromVendors = () => {
//   const api = useQuotesFromVendorsApiHook();

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.convertToQuotesFromVendors,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({
//         queryKey: ["convertToQuotesFromVendors"],
//       });
//     },
//   });
// };

// console.log("check")