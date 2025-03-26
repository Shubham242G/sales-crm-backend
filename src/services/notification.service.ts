
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import axiosAuth from "./axios.service";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";


interface INotification {
    userId: string;
    title: string;
    message: string;
}

const prefix = "/notification";




export const useNotificationApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addNotification = async (obj: any) => {

        return axios.post<GeneralApiResponse<INotification>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateNotificationById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteNotificationById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getNotificationById = async (id: any) => {
        return axios.get<GeneralApiResponse<INotification>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getNotificationByUserId = async (userId: any) => {
        return axios.get<any>(`${BASE_URL}${prefix}/getByUserId/${userId}`);
    };

   

    const getAllNotification = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axiosAuth.get<GeneralApiResponsePagination<INotification>>(`${BASE_URL}${prefix}?${query}`);
    };

    return {
        getAllNotification,
        updateNotificationById,
        deleteNotificationById,
        getNotificationById,
        addNotification,
        getNotificationByUserId
        

    };
};

export const useAddNotification = () => {
    const queryClient = useQueryClient();
    const api = useNotificationApiHook();
    return useMutation({
        mutationFn: api.addNotification,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Notification"] });
        },
    });
};

export const useNotificationById = (id: string) => {
    const api = useNotificationApiHook();

    return useQuery({
        queryKey: ["Notification_id", id],
        queryFn: () => api.getNotificationById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useNotification = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useNotificationApiHook();


    return useQuery({
        queryKey: ["Notification", pagination, searchObj],
        queryFn: () => api.getAllNotification(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<INotification>,
    });
};

export const usedeleteNotificationById = () => {
    const api = useNotificationApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteNotificationById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Notification"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateNotificationById = () => {
    const api = useNotificationApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateNotificationById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Notification"] });
        },
    });
}



export const useNotificationByUserId = (userId: string) => {
    const api = useNotificationApiHook();

    return useQuery({
        queryKey: ["Notification_id", userId],
        queryFn: () => api.getNotificationByUserId(userId).then((res) => res.data),
        enabled: !!userId,
    });
};
