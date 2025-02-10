import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";

const prefix = "/departmentMaster";
export interface IDepartmentMaster {
    _id:string,
    department:string,
    subDepartment:string
};


export const useDepartmentMasterApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addDepartmentMaster = async (obj: any) => {
        console.log(obj,"add images service")
        return axios.post<GeneralApiResponse<IDepartmentMaster>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateDepartmentMasterById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteDepartmentMasterById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getDepartmentMasterById = async (id: any) => {
        return axios.get<GeneralApiResponse<IDepartmentMaster>>(`${BASE_URL}${prefix}/getById/${id}`);
    };

    const getAllDepartmentMaster = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IDepartmentMaster>>(`${BASE_URL}${prefix}/?${query}`);
    };

    return {
        addDepartmentMaster,
        updateDepartmentMasterById,
        deleteDepartmentMasterById,
        getDepartmentMasterById,
        getAllDepartmentMaster,
    };
};

export const useAddDepartmentMaster = () => {
    const queryClient = useQueryClient();
    const api = useDepartmentMasterApiHook();
    return useMutation({
        mutationFn: api.addDepartmentMaster,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["DepartmentMaster"] });
        },
    });
};

export const useDepartmentMasterById = (id: string) => {
    const api = useDepartmentMasterApiHook();

    return useQuery({
        queryKey: ["departmentMaster_id", id],
        queryFn: () => api.getDepartmentMasterById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useDepartmentMaster = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useDepartmentMasterApiHook();

    return useQuery({
        queryKey: ["departmentMaster", pagination, searchObj],
        queryFn: () => api.getAllDepartmentMaster(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IDepartmentMaster>,
    });
};

export const usedeleteDepartmentMasterById = () => {
    const api = useDepartmentMasterApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteDepartmentMasterById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["departmentMaster"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateDepartmentMasterById = () => {
    const api = useDepartmentMasterApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateDepartmentMasterById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["departmentMaster"] });
        },
    });
};
