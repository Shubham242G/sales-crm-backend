


import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/reassign-task";
export interface IReassignTask {
    id?: string;
    reAssignedTo: string;
    department: string;
    remark: string;
    previousAssignee: string;
    description: string;
    reAssignmentDate: string;
    taskTitle: string;
    // startTime: string;
    // timeType: string;
    // timeValue: number | "";
    // completionTime: string;
    // options: number[];
}



export const useReassignTaskApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addReassignTask = async (obj: any) => {

        return axios.post<GeneralApiResponse<IReassignTask>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateReassignTaskById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteReassignTaskById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<IReassignTask>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllReassignTask = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IReassignTask>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const convertToContact = async (id: any) => {
        return axios.post<GeneralApiResponse<IReassignTask>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllReassignTask,
        updateReassignTaskById,
        deleteReassignTaskById,
        getContactById,
        addReassignTask,
        convertToContact

    };
};

export const useAddReassignTask = () => {
    const queryClient = useQueryClient();
    const api = useReassignTaskApiHook();
    return useMutation({
        mutationFn: api.addReassignTask,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["ReassignTask"] });
        },
    });
};

export const useReassignTaskById = (id: string) => {
    const api = useReassignTaskApiHook();

    return useQuery({
        queryKey: ["ReassignTask_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useReassignTask = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useReassignTaskApiHook();


    return useQuery({
        queryKey: ["ReassignTask", pagination, searchObj],
        queryFn: () => api.getAllReassignTask(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IReassignTask>,
    });
};

export const usedeleteReassignTaskById = () => {
    const api = useReassignTaskApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteReassignTaskById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["ReassignTask"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateReassignTaskById = () => {
    const api = useReassignTaskApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateReassignTaskById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["ReassignTask"] });
        },
    });
};


export const convertToContact = async (id: any) => {
    return axios.post<GeneralApiResponse<IReassignTask>>(
      `${BASE_URL}${prefix}/convert/${id}`
    );
  };







