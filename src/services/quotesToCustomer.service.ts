import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/QuotesToCustomer";

export interface IQuotesToCustomer {
    quotesId: string;
    customerName: string;
    serviceType: [];
    amount: string;
    markupDetails: {
      label: string;
      markupAmount: string;
    }[];
    totalAmount: string;
  }

export const useQuotesToCustomerApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addQuotesToCustomer = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateQuotesToCustomerById = async ({
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

//   const convertToQuotesToCustomer = async (id: any) => {
//     return axios.post<GeneralApiResponse<IQuotesToCustomer>>(
//       `${BASE_URL}${prefix}/convert/${id}`
//     );
//   };

  const deleteQuotesToCustomerById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getQuotesToCustomerById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllQuotesToCustomer = async (
    pagination: PaginationState,
    searchObj: any
  ) => {
    // const query = new URLSearchParams({
    //     pageIndex: String(pagination.pageIndex),
    //     pageSize: String(pagination.pageSize),
    //     ...searchObj,
    // }).toString();
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}`);
  };

  return {
    addQuotesToCustomer,
    deleteQuotesToCustomerById,
    updateQuotesToCustomerById,
    getQuotesToCustomerById,
    getAllQuotesToCustomer,
    // convertToQuotesToCustomer,
  };
};

export const useAddQuotesToCustomer = () => {
  const queryClient = useQueryClient();
  const api = useQuotesToCustomerApiHook();
  return useMutation({
    mutationFn: api.addQuotesToCustomer,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quotesToCustomer"] });
    },
  });
};

export const useQuotesToCustomerById = (id: string) => {
  const api = useQuotesToCustomerApiHook();

  return useQuery({
    queryKey: ["QuotesToCustomer_id", id],
    queryFn: () => api.getQuotesToCustomerById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useQuotesToCustomer = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useQuotesToCustomerApiHook();

  return useQuery({
    queryKey: ["QuotesToCustomer", pagination, searchObj],
    queryFn: () =>
      api
        .getAllQuotesToCustomer(pagination, searchObj)
        .then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteQuotesToCustomerById = () => {
  const api = useQuotesToCustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteQuotesToCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["QuotesToCustomer"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateQuotesToCustomerById = () => {
  const api = useQuotesToCustomerApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateQuotesToCustomerById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quotesToCustomer"] });
    },
  });
};
// export const useConvertQuotesToCustomer = () => {
//   const api = useQuotesToCustomerApiHook();

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.convertToQuotesToCustomer,
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({
//         queryKey: ["convertToQuotesToCustomer"],
//       });
//     },
//   });
// };

// console.log("check")
