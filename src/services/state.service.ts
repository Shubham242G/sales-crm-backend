import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/state";

export interface IState  {
    name:string,
    stateCode:string,
    status:boolean,
    _id:string;
    createdAt:Date;
    updateAt:Date;
    label:string;
    value:string;
}



export const useStateApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addState = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IState>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateStateById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteStateById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getStateById = async (id: any) => {
        return axios.get<GeneralApiResponse<IState>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllState = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IState>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addState, deleteStateById, updateStateById, getStateById, getAllState
    };
};

export const useAddState = () => {

    const queryClient = useQueryClient();
    const api = useStateApiHook()
    return useMutation({
        mutationFn: api.addState,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["State"] });
        },
    });
};

export const useStateById = (id: string) => {
    const api = useStateApiHook()

    return useQuery({
        queryKey: ["State_id", id],
        queryFn: () => api.getStateById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useStates = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useStateApiHook()

    return useQuery({
        queryKey: ["State", pagination, searchObj],
        queryFn: () => api.getAllState(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IState>,
    });
};



export const usedeleteStateById = () => {
    const api = useStateApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteStateById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["State"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateStateById = () => {
    const api = useStateApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateStateById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["State"] });
        },
    });
};


