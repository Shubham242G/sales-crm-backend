import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination, ReactSelectFormat } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/monthlyPlanner";
export interface ImonthlyPlanner {
    // Basic Details
    salutation: string,
    leadId: string,
    clientName: string,
    agenda: string,
    email: string,
    phone: string,
    company: string,
    status: string
    date:Date,
    _id: string,
    isRemark: boolean
    remark: string
}



export const usemonthlyPlannerApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addmonthlyPlanner = async (obj: any) => {

        return axios.post<GeneralApiResponse<ImonthlyPlanner>>(`${BASE_URL}${prefix}`, obj);
    };
    const updatemonthlyPlannerById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse<ImonthlyPlanner>>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deletemonthlyPlannerById = async (id: any) => {
        return axios.delete<GeneralApiResponse<ImonthlyPlanner>>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllmonthlyPlanner = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ImonthlyPlanner>>(`${BASE_URL}${prefix}/?${query}`);
    };



    const convertToContact = async (id: any) => {
        return axios.post<GeneralApiResponse<ImonthlyPlanner>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    const getAllmonthlyPlannerName = async (searchObj: any) => {
        const query = new URLSearchParams({
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ReactSelectFormat[]>>(`${BASE_URL}${prefix}?${query}`);
    };

    const getCompanyName = async (fullName: string) => {


        return axios.get<GeneralApiResponse<ImonthlyPlanner>>(`${BASE_URL}${prefix}/getCompanyName/${fullName}`);
    };






    return {
        getAllmonthlyPlanner,
        updatemonthlyPlannerById,
        deletemonthlyPlannerById,
        getContactById,
        addmonthlyPlanner,
        convertToContact,
        getAllmonthlyPlannerName,
        getCompanyName

    };
};

export const useAddmonthlyPlanner = () => {
    const queryClient = useQueryClient();
    const api = usemonthlyPlannerApiHook();
    return useMutation({
        mutationFn: api.addmonthlyPlanner,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["monthlyPlanner"] });
        },
    });
};

export const usemonthlyPlannerById = (id: string, enabled: boolean = true) => {
    const api = usemonthlyPlannerApiHook();

    return useQuery({
        queryKey: ["monthlyPlanner_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id && enabled,
    });
};

export const usemonthlyPlanner = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = usemonthlyPlannerApiHook();


    return useQuery({
        queryKey: ["monthlyPlanner", pagination, searchObj],
        queryFn: () => api.getAllmonthlyPlanner(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ImonthlyPlanner>,
    });
};

export const usedeletemonthlyPlannerById = () => {
    const api = usemonthlyPlannerApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deletemonthlyPlannerById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["monthlyPlanner"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdatemonthlyPlannerById = () => {
    const api = usemonthlyPlannerApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updatemonthlyPlannerById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["monthlyPlanner"] });
        },
    });
};


export const convertToContact = async (id: any) => {
    return axios.post<GeneralApiResponse<ImonthlyPlanner>>(
        `${BASE_URL}${prefix}/convert/${id}`
    );
};


export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addmonthlyPlannerExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadmonthlyPlanners`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const usemonthlyPlannerName = (
    searchObj: Record<string, any> = {},
) => {



    const api = usemonthlyPlannerApiHook();
    return useQuery({
        queryKey: ["monthlyPlannerName", searchObj],
        queryFn: () =>
            api.getAllmonthlyPlannerName(searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ReactSelectFormat[]>
    });
};

export const useCompanyName = (fullName: string,

) => {



    const api = usemonthlyPlannerApiHook();
    return useQuery({
        queryKey: ["monthlyPlannerCompanyName", fullName],
        queryFn: () =>
            api.getCompanyName(fullName).then((res) => res?.data),
        initialData: {
            data: [],
            message: "",
        } as unknown as GeneralApiResponse<ImonthlyPlanner>,
    });
};




