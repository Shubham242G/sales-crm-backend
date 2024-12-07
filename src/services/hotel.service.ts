import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/hotel";
export interface IHotel {
    name : string,
    vendorId : string,
    noOfRooms : string,
    size : String,
    price : string,
    imagesArr : {
        image : string
    }[]
};


export const useHotelApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addHotel = async (obj: any) => {
        console.log(obj,"add images service")
        return axios.post<GeneralApiResponse<IHotel>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateHotelById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteHotelById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getHotelById = async (id: any) => {
        return axios.get<GeneralApiResponse<IHotel>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllHotel = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IHotel>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addHotel,
        updateHotelById,
        deleteHotelById,
        getHotelById,
        getAllHotel,
    };
};

export const useAddHotel = () => {
    const queryClient = useQueryClient();
    const api = useHotelApiHook();
    return useMutation({
        mutationFn: api.addHotel,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["hotel"] });
        },
    });
};

export const useHotelById = (id: string) => {
    const api = useHotelApiHook();

    return useQuery({
        queryKey: ["hotel_id", id],
        queryFn: () => api.getHotelById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useHotel = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useHotelApiHook();

    return useQuery({
        queryKey: ["hotel", pagination, searchObj],
        queryFn: () => api.getAllHotel(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IHotel>,
    });
};

export const usedeleteHotelById = () => {
    const api = useHotelApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteHotelById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["hotel"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateHotelById = () => {
    const api = useHotelApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateHotelById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["hotel"] });
        },
    });
};
