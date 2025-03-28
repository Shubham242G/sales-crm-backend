import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/dailyActivityReport";

interface customerName{label: string, value: string}
export interface IDailyActivityReport {
// Basic Details

    companyName:string;
    purposeOfVisit:string;
    dateOfVisit:string;
    modeOfMeeting:string;
    customerName:customerName;
    scheduleMeeting:string;
    description:string,
    status:string;
   
}



export const useDailyActivityReportApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addDailyActivityReport = async (obj: any) => {

        return axios.post<GeneralApiResponse<IDailyActivityReport>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateDailyActivityReportById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteDailyActivityReportById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getDailyActivityReportById = async (id: any) => {
        return axios.get<GeneralApiResponse<IDailyActivityReport>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllDailyActivityReport = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IDailyActivityReport>>(`${BASE_URL}${prefix}/?${query}`);
    };

 

    // const convertToContact = async (id: any) => {
    //     return axios.post<GeneralApiResponse<IdailyActivityReport>>(`${BASE_URL}${prefix}/convert/${id}`);
    // }

    return {
        addDailyActivityReport,
        updateDailyActivityReportById,
        deleteDailyActivityReportById,
        getDailyActivityReportById,
        getAllDailyActivityReport,
        // convertToContact

    };
};

export const useAddDailyActivityReport = () => {
    const queryClient = useQueryClient();
    const api = useDailyActivityReportApiHook();
    return useMutation({
        mutationFn: api.addDailyActivityReport,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["dailyActivityReport"] });
        },
    });
};

export const useDailyActivityReportById = (id: string) => {
    const api = useDailyActivityReportApiHook();

    return useQuery({
        queryKey: ["dailyActivityReport_id", id],
        queryFn: () => api.getDailyActivityReportById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useDailyActivityReport = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useDailyActivityReportApiHook();


    return useQuery({
        queryKey: ["dailyActivityReport", pagination, searchObj],
        queryFn: () => api.getAllDailyActivityReport(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IDailyActivityReport>,
    });
};

export const useDeleteDailyActivityReportById = () => {
    const api = useDailyActivityReportApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteDailyActivityReportById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["dailyActivityReport"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateDailyActivityReportById = () => {
    const api = useDailyActivityReportApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateDailyActivityReportById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["dailyActivityReport"] });
        },
    });
};


// export const convertToContact = async (id: any) => {
//     return axios.post<GeneralApiResponse<IDailyActivityReport>>(
//       `${BASE_URL}${prefix}/convert/${id}`
//     );
//   };


  export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addDailyActivityReportExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploaddailyActivityReports`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};







