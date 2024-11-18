import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/paymentMode";
export interface IPaymentMode {
    _id?: string;
    label?: string;
    value?: string;
    name: string;
    status: boolean;
    createdAt?: Date;
    updateAt?: Date;
}

export const usePaymentModeApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addPaymentMode = async (obj: any) => {
        return axios.post<GeneralApiResponse<IPaymentMode>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updatePaymentModeById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deletePaymentModeById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getPaymentModeById = async (id: any) => {
        return axios.get<GeneralApiResponse<IPaymentMode>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllPaymentMode = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IPaymentMode>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addPaymentMode,
        deletePaymentModeById,
        updatePaymentModeById,
        getPaymentModeById,
        getAllPaymentMode,
    };
};

export const useAddPaymentMode = () => {
    const queryClient = useQueryClient();
    const api = usePaymentModeApiHook();
    return useMutation({
        mutationFn: api.addPaymentMode,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["PaymentMode"] });
        },
    });
};

export const usePaymentModeById = (id: string) => {
    const api = usePaymentModeApiHook();

    return useQuery({
        queryKey: ["PaymentMode_id", id],
        queryFn: () => api.getPaymentModeById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const usePaymentMode = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = usePaymentModeApiHook();

    return useQuery({
        queryKey: ["PaymentMode", pagination, searchObj],
        queryFn: () => api.getAllPaymentMode(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IPaymentMode>,
    });
};

export const usedeletePaymentModeById = () => {
    const api = usePaymentModeApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deletePaymentModeById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["PaymentMode"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdatePaymentModeById = () => {
    const api = usePaymentModeApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updatePaymentModeById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["PaymentMode"] });
        },
    });
};
