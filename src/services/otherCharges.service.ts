import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/otherCharges";
export interface IOtherCharges {
    _id: string;
    label: string;
    value: string;
    name: string;
    chargeType: CHARGE_TYPE;
    tax: number;
    status: boolean;
    createdAt: Date;
    updateAt: Date;
}

export const useOtherChargesApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addOtherCharges = async (obj: any) => {
        return axios.post<GeneralApiResponse<IOtherCharges>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateOtherChargesById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteOtherChargesById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getOtherChargesById = async (id: any) => {
        return axios.get<GeneralApiResponse<IOtherCharges>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllOtherCharges = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IOtherCharges>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addOtherCharges,
        deleteOtherChargesById,
        updateOtherChargesById,
        getOtherChargesById,
        getAllOtherCharges,
    };
};

export const useAddOtherCharges = () => {
    const queryClient = useQueryClient();
    const api = useOtherChargesApiHook();
    return useMutation({
        mutationFn: api.addOtherCharges,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["OtherCharges"] });
        },
    });
};

export const useOtherChargesById = (id: string) => {
    const api = useOtherChargesApiHook();

    return useQuery({
        queryKey: ["OtherCharges_id", id],
        queryFn: () => api.getOtherChargesById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useOtherCharges = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useOtherChargesApiHook();

    return useQuery({
        queryKey: ["OtherCharges", pagination, searchObj],
        queryFn: () => api.getAllOtherCharges(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IOtherCharges>,
    });
};

export const usedeleteOtherChargesById = () => {
    const api = useOtherChargesApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteOtherChargesById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["OtherCharges"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateOtherChargesById = () => {
    const api = useOtherChargesApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateOtherChargesById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["OtherCharges"] });
        },
    });
};
