import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/transaction";
export interface ITransaction  {
    name: string,
    balance: number,
    status: boolean,
    _id?: string;
    createdAt?: Date;
    updateAt?: Date;
    label?:string;
    value?:string;
}

export const useTransactionApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addTransaction = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ITransaction>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateTransactionById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteTransactionById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getTransactionById = async (id: any) => {
        return axios.get<GeneralApiResponse<ITransaction>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllTransaction = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ITransaction>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addTransaction, deleteTransactionById, updateTransactionById, getTransactionById, getAllTransaction
    };
};

export const useAddTransaction = () => {

    const queryClient = useQueryClient();
    const api = useTransactionApiHook()
    return useMutation({
        mutationFn: api.addTransaction,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Transaction"] });
        },
    });
};

export const useTransactionById = (id: string) => {
    const api = useTransactionApiHook()

    return useQuery({
        queryKey: ["Transaction_id", id],
        queryFn: () => api.getTransactionById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useTransaction = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useTransactionApiHook()

    return useQuery({
        queryKey: ["Transaction", pagination, searchObj],
        queryFn: () => api.getAllTransaction(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ITransaction>,
    });
};



export const usedeleteTransactionById = () => {
    const api = useTransactionApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteTransactionById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Transaction"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateTransactionById = () => {
    const api = useTransactionApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateTransactionById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Transaction"] });
        },
    });
};


