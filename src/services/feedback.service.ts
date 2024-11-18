import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/feedback";
export interface IFeedback  {
    name: string,
    status: boolean,
    _id: string;
    createdAt: Date;
    updateAt: Date;
    label:string;
    value:string;
}

export const useFeedbackApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addFeedback = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IFeedback>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateFeedbackById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteFeedbackById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getFeedbackById = async (id: any) => {
        return axios.get<GeneralApiResponse<IFeedback>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllFeedback = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IFeedback>>(`${BASE_URL}${prefix}/?${query}`);
    };
    return {
        addFeedback, deleteFeedbackById, updateFeedbackById, getFeedbackById, getAllFeedback
    };
};

export const useAddFeedback = () => {
    const queryClient = useQueryClient();
    const api = useFeedbackApiHook()
    return useMutation({
        mutationFn: api.addFeedback,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Feedback"] });
        },
    });
};

export const useFeedbackById = (id: string) => {
    const api = useFeedbackApiHook()
    return useQuery({
        queryKey: ["Feedback_id", id],
        queryFn: () => api.getFeedbackById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useFeedback = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);
    const api = useFeedbackApiHook()
    return useQuery({
        queryKey: ["Feedback", pagination, searchObj],
        queryFn: () => api.getAllFeedback(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IFeedback>,
    });
};



export const usedeleteFeedbackById = () => {
    const api = useFeedbackApiHook()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteFeedbackById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Feedback"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateFeedbackById = () => {
    const api = useFeedbackApiHook()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateFeedbackById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Feedback"] });
        },
    });
};


