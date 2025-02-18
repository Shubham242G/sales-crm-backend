


import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import { ICustomer } from "./customer.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


const prefix = "/task";

export interface IReassignment {
    reAssignedTo: string;
    remark: string;
    previousAssignee: string;
    reAssignmentDate: string;
  }

export interface ITaskManagement {
    id?: string;
    assignedTo: string;
    department: string;
    taskType: string;
    taskTitle: string;
    description: string;
    startDate: string;
    startTime: string;
    timeType: string;
    timeValue: number | "";
    completionTime: string;
    options: number[];
    reassignments?: IReassignment[];
}




export const useTaskManagementApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addTaskManagement = async (obj: any) => {

        return axios.post<GeneralApiResponse<ITaskManagement>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateTaskManagementById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteTaskManagementById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getContactById = async (id: any) => {
        return axios.get<GeneralApiResponse<ITaskManagement>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllTaskManagement = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ITaskManagement>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const convertToContact = async (id: any) => {
        return axios.post<GeneralApiResponse<ITaskManagement>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllTaskManagement,
        updateTaskManagementById,
        deleteTaskManagementById,
        getContactById,
        addTaskManagement,
        convertToContact

    };
};

export const useAddTaskManagement = () => {
    const queryClient = useQueryClient();
    const api = useTaskManagementApiHook();
    return useMutation({
        mutationFn: api.addTaskManagement,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["TaskManagement"] });
        },
    });
};

export const useTaskManagementById = (id: string) => {
    const api = useTaskManagementApiHook();

    return useQuery({
        queryKey: ["TaskManagement_id", id],
        queryFn: () => api.getContactById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useTaskManagement = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useTaskManagementApiHook();


    return useQuery({
        queryKey: ["TaskManagement", pagination, searchObj],
        queryFn: () => api.getAllTaskManagement(pagination, searchObj).then((res: any) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ITaskManagement>,
    });
};

export const usedeleteTaskManagementById = () => {
    const api = useTaskManagementApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteTaskManagementById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["TaskManagement"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateTaskManagementById = () => {
    const api = useTaskManagementApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateTaskManagementById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["TaskManagement"] });
        },
    });
};


export const convertToContact = async (id: any) => {
    return axios.post<GeneralApiResponse<ITaskManagement>>(
      `${BASE_URL}${prefix}/convert/${id}`
    );
  };







