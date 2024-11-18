import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/city";

export interface ICity  {
    name:string,
    stateId:string,
    stateName:string,
    status:boolean,
    _id:string;
    createdAt:Date;
    updateAt:Date;
    label:string;
    value:string;
}



export const useCityApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addCity = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ICity>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateCityById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteCityById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getCityById = async (id: any) => {
        return axios.get<GeneralApiResponse<ICity>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
   
    const getAllCity = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ICity>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addCity, deleteCityById, updateCityById, getCityById, getAllCity
    };
};

export const useAddCity = () => {

    const queryClient = useQueryClient();
    const api = useCityApiHook()
    return useMutation({
        mutationFn: api.addCity,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["City"] });
        },
    });
};

export const useCityById = (id: string) => {
    const api = useCityApiHook()

    return useQuery({
        queryKey: ["City_id", id],
        queryFn: () => api.getCityById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useCitys = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useCityApiHook()

    return useQuery({
        queryKey: ["City", pagination, searchObj],
        queryFn: () => api.getAllCity(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ICity>,
    });
};



export const usedeleteCityById = () => {
    const api = useCityApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteCityById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["City"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateCityById = () => {
    const api = useCityApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateCityById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["City"] });
        },
    });
};


