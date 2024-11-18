import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/section";
export interface ISection {
    _id?: string;
    label?: string;
    value?: string;
    name: string;
    location: string;
    status: boolean;
    createdAt?: Date;
    updateAt?: Date;
}

export const useSectionApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addSection = async (obj: any) => {
        return axios.post<GeneralApiResponse<ISection>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateSectionById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteSectionById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getSectionById = async (id: any) => {
        return axios.get<GeneralApiResponse<ISection>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllSection = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ISection>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addSection,
        deleteSectionById,
        updateSectionById,
        getSectionById,
        getAllSection,
    };
};

export const useAddSection = () => {
    const queryClient = useQueryClient();
    const api = useSectionApiHook();
    return useMutation({
        mutationFn: api.addSection,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Section"] });
        },
    });
};

export const useSectionById = (id: string) => {
    const api = useSectionApiHook();

    return useQuery({
        queryKey: ["Section_id", id],
        queryFn: () => api.getSectionById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useSection = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useSectionApiHook();

    return useQuery({
        queryKey: ["Section", pagination, searchObj],
        queryFn: () => api.getAllSection(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ISection>,
    });
};

export const usedeleteSectionById = () => {
    const api = useSectionApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteSectionById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Section"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateSectionById = () => {
    const api = useSectionApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateSectionById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["Section"] });
        },
    });
};
