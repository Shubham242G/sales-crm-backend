
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination, ReactSelectFormat } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/dashboard";
export interface IDashboard {
    // Basic Details
    costOfVendor: string;
    businessFromCustomer: string;
    revenue: string;
}



export const useDashboardApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addDashboard = async (obj: any) => {

        return axios.post<GeneralApiResponse<IDashboard>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateDashboardById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteDashboardById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<IDashboard>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllDashboard = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IDashboard>>(
            `${BASE_URL}${prefix}?${query}`
        );
    };



    const convertToContact = async (id: any) => {
        return axios.post<GeneralApiResponse<IDashboard>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    const getAllDashboardName = async (searchObj: any) => {
        const query = new URLSearchParams({
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ReactSelectFormat[]>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const getCompanyName = async (fullName: string) => {


        return axios.get<GeneralApiResponse<IDashboard>>(`${BASE_URL}${prefix}/getCompanyName/${fullName}`);
    };






    return {
        getAllDashboard,
        updateDashboardById,
        deleteDashboardById,
        getContactById,
        addDashboard,
        convertToContact,
        getAllDashboardName,
        getCompanyName,

    };
};

export const useAddDashboard = () => {
    const queryClient = useQueryClient();
    const api = useDashboardApiHook();
    return useMutation({
        mutationFn: api.addDashboard,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
        },
    });
};

export const useDashboardById = (id: string, enabled: boolean = true) => {
    const api = useDashboardApiHook();

    return useQuery({
        queryKey: ["Dashboard_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id && enabled,
    });
};

export const useDashboard = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useDashboardApiHook();


    return useQuery({
        queryKey: ["Dashboard", pagination, searchObj],
        queryFn: () => api.getAllDashboard(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IDashboard>,
    });
};

export const usedeleteDashboardById = () => {
    const api = useDashboardApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteDashboardById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateDashboardById = () => {
    const api = useDashboardApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateDashboardById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
        },
    });
};


export const convertToContact = async (id: any) => {
    return axios.post<GeneralApiResponse<IDashboard>>(
        `${BASE_URL}${prefix}/convert/${id}`
    );
};


export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addDashboardExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadDashboards`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const useDashboardName = (
    searchObj: Record<string, any> = {},
) => {



    const api = useDashboardApiHook();
    return useQuery({
        queryKey: ["DashboardName", searchObj],
        queryFn: () =>
            api.getAllDashboardName(searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ReactSelectFormat[]>
    });
};

export const useCompanyName = (fullName: string,

) => {



    const api = useDashboardApiHook();
    return useQuery({
        queryKey: ["DashboardCompanyName", fullName],
        queryFn: () =>
            api.getCompanyName(fullName).then((res) => res?.data),
        initialData: {
            data: [],
            message: "",
        } as unknown as GeneralApiResponse<IDashboard>,
    });
};




