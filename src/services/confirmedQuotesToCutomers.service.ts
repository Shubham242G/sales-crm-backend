import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/ConfirmedQuotesToCustomer";

export interface IConfirmedQuotesToCustomer {
    quotesId: string;
    enquiryId: string;
    customerName: string;
    serviceType: [];
    amount: number;
    displayName:string;
    leadId: string;
    status: string;
    markupDetails: {
      label: string;
      markupAmount: string;
    }[];
    totalMarkupAmount: number;
  }
// Quotes for Customer
export const getQuotesForCustomerExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addQuotesForCustomerExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadQuotesForCustomer`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const useConfirmedQuotesToCustomerApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addConfirmedQuotesToCustomer = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateConfirmedQuotesToCustomerById = async ({
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

//   const convertToConfirmedQuotesToCustomer = async (id: any) => {
//     return axios.post<GeneralApiResponse<IConfirmedQuotesToCustomer>>(
//       `${BASE_URL}${prefix}/convert/${id}`
//     );
//   };

  const deleteConfirmedQuotesToCustomerById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getConfirmedQuotesToCustomerById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };


    const getAllConfirmedQuotesToCustomer = async (pagination: PaginationState, searchObj: any) => {
      const query = new URLSearchParams({
        pageIndex: String(pagination.pageIndex),
        pageSize: String(pagination.pageSize),
        ...searchObj,
      }).toString();
      return axios.get<GeneralApiResponsePagination<any>>(
        `${BASE_URL}${prefix}/?${query}`
      );
    };
  // const getAllConfirmedQuotesToCustomer = async (
  //   pagination: PaginationState,
  //   searchObj: any
  // ) => {
  //   // const query = new URLSearchParams({
  //   //     pageIndex: String(pagination.pageIndex),
  //   //     pageSize: String(pagination.pageSize),
  //   //     ...searchObj,
  //   // }).toString();
  //   return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}`);
  // };

  return {
    addConfirmedQuotesToCustomer,
    deleteConfirmedQuotesToCustomerById,
    updateConfirmedQuotesToCustomerById,
    getConfirmedQuotesToCustomerById,
    getAllConfirmedQuotesToCustomer,
    // convertToConfirmedQuotesToCustomer,
  };
};

export const useAddConfirmedQuotesToCustomer = () => {
  const queryClient = useQueryClient();
  const api = useConfirmedQuotesToCustomerApiHook();
  return useMutation({
    mutationFn: api.addConfirmedQuotesToCustomer,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotesToCustomer"] });
    },
  });
};

export const useConfirmedQuotesToCustomerById = (id: string) => {
  const api = useConfirmedQuotesToCustomerApiHook();

  return useQuery({
    queryKey: ["ConfirmedQuotesToCustomer_id", id],
    queryFn: () => api.getConfirmedQuotesToCustomerById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useConfirmedQuotesToCustomer = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useConfirmedQuotesToCustomerApiHook();

  return useQuery({
    queryKey: ["ConfirmedQuotesToCustomer", pagination, searchObj],
    queryFn: () =>
      api
        .getAllConfirmedQuotesToCustomer(pagination, searchObj)
        .then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteConfirmedQuotesToCustomerById = () => {
  const api = useConfirmedQuotesToCustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteConfirmedQuotesToCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ConfirmedQuotesToCustomer"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateConfirmedQuotesToCustomerById = () => {
  const api = useConfirmedQuotesToCustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateConfirmedQuotesToCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotesToCustomer"] });
    },
  });
};
// export const useConvertConfirmedQuotesToCustomer = () => {
//   const api = useConfirmedQuotesToCustomerApiHook();

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.convertToConfirmedQuotesToCustomer,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({
//         queryKey: ["convertToConfirmedQuotesToCustomer"],
//       });
//     },
//   });
// };

// console.log("check")
