import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/confirmedQuotes";
export interface IConfirmedQuotes {
    banquetEventOrders: {
        eventCoordinatorName: string;
        eventDate: Date;
        hotelName: string;
        eventCoordinatorReportingTime: string;
        clientsCompanyName: string;
        onsiteClientName: string;
        salesPersonName: string;
        expectedPax: string;
        quotesId: string;
        rfpId: string;
        vendorList: {
            label: string,
            value: string
        }
        serviceType : [];
        amount: string;
        receivedDate: string;
        status: string;
        attachment: string[];
      };
  
    banquetEventOrdersSecond: {
      eventStartTime: string;
      eventEndTime: string;
      btr: string;
      venueHandoveTime: string;
      welcomeDrinkStartTime: string;
      venueName: string;
      setup: string;
      avVendorName: string;
      avVendorNo: string;
      expNumberOfSeating: string;
      hotelCoordinationName: string;
      hotelCoordinationNo: string;
      linerColor: string;
      startersPlacement: string;
      startersEventTime: string;
    };
  
    menuSelection: {
      srNo: string;
      veg: string;
      nonVeg: string;
      actions: string;
    };
  
    eventFlow: {
      srNo: string;
      text1: string;
      text2: string;
      actions: string;
    };
  
    audioVisual: {
      srNo: string;
      text1: string;
      text2: string;
      actions: string;
    };
  
    checklist: {
      srNo: string;
      checks: string;
      actions: string;
    }[];
  }

  // Confirmed Quotes From Vendors
export const getConfirmedQuotesFromVendorsExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getConfirmedQuotesFromVendorsExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addConfirmedQuotesFromVendorsExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadConfirmedQuotesFromVendors`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const useConfirmedQuotesApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addConfirmedQuotes = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateConfirmedQuotesById = async ({ id, obj }: { id: string; obj: any }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };
  const deleteConfirmedQuotesById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getConfirmedQuotesById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllConfirmedQuotes = async (pagination: PaginationState, searchObj: any) => {
    
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
  }).toString();
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}?${query}`);
  };

  const convertConfirmedQuotesToSalesContact = async (id: string) => {
    return axios.post<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/convert-to-sales-contact/${id}`
    );
  };

  const getAllConfirmedQuotesName = async () => {
   
  
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}/getAllConfirmedQuotesName`);
  };

  const getAllQuotesId = async () => {
    

    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}/getAllQuoteId`);
  };


  const getByQuoteIdData = async (quoteId: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getByQuoteId/${quoteId}`
    );
  };

 

  return {
    addConfirmedQuotes,
    deleteConfirmedQuotesById,
    updateConfirmedQuotesById,
    getConfirmedQuotesById,
    getAllConfirmedQuotes,
    convertConfirmedQuotesToSalesContact,
    getAllConfirmedQuotesName,
    getAllQuotesId,
    getByQuoteIdData

  };
};

export const useAddConfirmedQuotes = () => {
  const queryClient = useQueryClient();
  const api = useConfirmedQuotesApiHook();
  return useMutation({
    mutationFn: api.addConfirmedQuotes,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotes"] });
    },
  });
};

export const useConfirmedQuotesById = (id: string) => {
  const api = useConfirmedQuotesApiHook();

  return useQuery({
    queryKey: ["ConfirmedQuotes_id", id],
    queryFn: () => api.getConfirmedQuotesById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useConfirmedQuotes = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useConfirmedQuotesApiHook();

  return useQuery({
    queryKey: ["confirmedQuotes", pagination, searchObj],
    queryFn: () =>
      api.getAllConfirmedQuotes(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteConfirmedQuotesById = () => {
  const api = useConfirmedQuotesApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteConfirmedQuotesById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotes"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateConfirmedQuotesById = () => {
  const api = useConfirmedQuotesApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateConfirmedQuotesById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotes"] });
    },
  });
};

export const useConvertConfirmedQuotesToSalesContact = () => {
  const api = useConfirmedQuotesApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.convertConfirmedQuotesToSalesContact,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Sales Contact"] }); 
      queryClient.invalidateQueries({ queryKey: ["confirmedQuotes"] }); 
    },
  });
};


export const useConfirmedQuotesName = (
 
) => {
  


  const api = useConfirmedQuotesApiHook();
  return useQuery({
    queryKey: ["ConfirmedQuotesName"],
    queryFn: () =>
      api.getAllConfirmedQuotesName().then((res:any) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};


export const useConfirmedQuotesId = (
 
  ) => {
    
  
    const api = useConfirmedQuotesApiHook();
  
    return useQuery({
      queryKey: ["confirmedQuotesId"],
      queryFn: () =>
        api.getAllQuotesId().then((res) => res?.data),
      initialData: {
        data: [],
        total: 0,
        message: "",
      } as unknown as GeneralApiResponsePagination<any>,
    });
  };

  export const useConfirmedQuotesByIdData= (quoteId: string) => {
    const api = useConfirmedQuotesApiHook();
  
    return useQuery({
      queryKey: ["ConfirmedQuotes_data", quoteId],
      queryFn: () => api.getByQuoteIdData(quoteId).then((res) => res.data),
      enabled: !!quoteId,
    });
  };
  

