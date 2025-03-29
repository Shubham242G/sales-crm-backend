import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/resturant";
export interface IResturant {
    _id: string,
    foodOptions: string,
    noOfOccupancy: string,
    floor: string,
    swimmingPool: string,
    imagesArr: {
        image: string
    }[]
};

export const useResturantApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addResturant = async (obj: any) => {
        return axios.post<GeneralApiResponse<IResturant>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateResturantById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteResturantById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getResturantById = async (id: any) => {
        return axios.get<GeneralApiResponse<IResturant>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllResturant = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IResturant>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        getAllResturant,
        addResturant,
        updateResturantById,
        deleteResturantById,
        getResturantById,
    };
};

export const useAddResturant = () => {
    const queryClient = useQueryClient();
    const api = useResturantApiHook();
    return useMutation({
        mutationFn: api.addResturant,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Resturant"] });
        },
    });
};

export const useResturantById = (id: string) => {
    const api = useResturantApiHook();

    return useQuery({
        queryKey: ["resturant_id", id],
        queryFn: () => api.getResturantById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useResturant = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useResturantApiHook();

    return useQuery({
        queryKey: ["resturant", pagination, searchObj],
        queryFn: () => api.getAllResturant(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IResturant>,
    });
};

export const usedeleteResturantById = () => {
    const api = useResturantApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteResturantById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["resturant"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateResturantById = () => {
    const api = useResturantApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateResturantById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["resturant"] });
        },
    });
};
