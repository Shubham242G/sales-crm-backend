import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/hsn";
export interface IHsn  {
    _id: string;
    hsnCode : string,
    rangesArr:{    
        startFrom : number,
        endAt : number,
        taxId : string
    }[],
     label: string,
    value: string,
    name: string,
    status: boolean,
    createdAt: Date;
    updateAt: Date;
}



export const useHsnApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addHsn = async (obj: any,) => {
        return axios.post<GeneralApiResponse<IHsn>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateHsnById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteHsnById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getHsnById = async (id: any) => {
        return axios.get<GeneralApiResponse<IHsn>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllHsn = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IHsn>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addHsn, deleteHsnById, updateHsnById, getHsnById, getAllHsn
    };
};

export const useAddHsn = () => {

    const queryClient = useQueryClient();
    const api = useHsnApiHook()
    return useMutation({
        mutationFn: api.addHsn,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Hsn"] });
        },
    });
};

export const useHsnById = (id: string) => {
    const api = useHsnApiHook()

    return useQuery({
        queryKey: ["Hsn_id", id],
        queryFn: () => api.getHsnById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useHsn = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useHsnApiHook()

    return useQuery({
        queryKey: ["Hsn", pagination, searchObj],
        queryFn: () => api.getAllHsn(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IHsn>,
    });
};



export const usedeleteHsnById = () => {
    const api = useHsnApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteHsnById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Hsn"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateHsnById = () => {
    const api = useHsnApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateHsnById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Hsn"] });
        },
    });
};


