// src/services/zohoInvoiceService.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../libs/hooks/axios";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";

// Prefix for invoice routes
const prefix = "/invoices";



// Invoice Type Definition (you can expand this with specific invoice fields)
export interface IInvoice {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  status: string;
  date: string;
  due_date: string;
  total: string;
  balance: string;
  currency_code: string;
  line_items: {
    name: string;
    rate: number;
    quantity: number;
    amount: string;
  }[];
  created_time: string;
  updated_time: string;
}

export const useInvoiceApiHook = () => {
  // Function to fetch all invoices with pagination
  const getAllInvoices = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();

    return axios.get<GeneralApiResponsePagination<IInvoice>>(`${BASE_URL}${prefix}?${query}`);
  };

  // Function to fetch a specific invoice by ID
  const getInvoiceById = async (id: string) => {
    return axios.get<GeneralApiResponse<IInvoice>>(`${BASE_URL}${prefix}/${id}`);
  };



  const getInvoiceToken = async () => {
    return axios.get<GeneralApiResponse<IInvoice>>(`${BASE_URL}${prefix}/zoho`);
  }

  // Function to create a new invoice
//   const addInvoice = async (invoice: IInvoice) => {
//     return axios.post<GeneralApiResponse<IInvoice>>(`${BASE_URL}${prefix}/`, invoice);
//   };

//   // Function to update an existing invoice by ID
//   const updateInvoiceById = async ({ id, invoice }: { id: string; invoice: IInvoice }) => {
//     return axios.patch<GeneralApiResponse<IInvoice>>(`${BASE_URL}${prefix}/updateById/${id}`, invoice);
//   };

//   // Function to delete an invoice by ID
//   const deleteInvoiceById = async (id: string) => {
//     return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
//   };

  return {
    getAllInvoices,
    getInvoiceById,
    getInvoiceToken
    // addInvoice,
    // updateInvoiceById,
    // deleteInvoiceById,
  };
};

export const useInvoiceById = (id: string) => {
    const api = useInvoiceApiHook();
    return useQuery({
      queryKey: ["invoice", id],
      queryFn: () => api.getInvoiceById(id).then((res) => res.data),
      enabled: !!id,
    });
  };


  export const useInvoiceToken = () => {
    const api = useInvoiceApiHook();
    return useQuery({
      queryKey: ["invoice_check" ],
      queryFn: () => api.getInvoiceToken().then((res) => res.data),
     
    });
  };

  export const useAllInvoices = (pagination: PaginationState, searchObj: any) => {
    const api = useInvoiceApiHook();
  
    return useQuery({
      queryKey: ["invoices", pagination, searchObj],
      queryFn: () => api.getAllInvoices(pagination, searchObj).then((res) => res.data),
      enabled: !!pagination, // Only fetch if pagination is defined
      initialData: {
        data: [],
        total: 0,
        message: "",
      },
    });
  };
  
  // Hook to add a new invoice
//   export const useAddInvoice = () => {
//     const queryClient = useQueryClient();
//     const api = useInvoiceApiHook();
  
//     return useMutation({
//       mutationFn: api.addInvoice,
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       },
//     });
//   };
  
//   // Hook to update an existing invoice by ID
//   export const useUpdateInvoiceById = () => {
//     const queryClient = useQueryClient();
//     const api = useInvoiceApiHook();
  
//     return useMutation({
//       mutationFn: api.updateInvoiceById,
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       },
//     });
//   };
  
//   // Hook to delete an invoice by ID
//   export const useDeleteInvoiceById = () => {
//     const queryClient = useQueryClient();
//     const api = useInvoiceApiHook();
  
//     return useMutation({
//       mutationFn: api.deleteInvoiceById,
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       },
//     });
//   };
