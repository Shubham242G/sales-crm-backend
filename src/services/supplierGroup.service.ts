import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/supplierGroup";
export interface ISupplierGroup  {
    name: string,
}

// export interface ISupplierGroupSelect {
//     label: string;
//     value: string;
// }

export const useSupplierGroupApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addSupplierGroup = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ISupplierGroup>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateSupplierGroupById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteSupplierGroupById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getSupplierGroupById = async (id: any) => {
        return axios.get<GeneralApiResponse<ISupplierGroup>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
    // const getSupplierGroupForSelect = async (pagination: PaginationState, searchObj: any) => {
    //     const query = new URLSearchParams({
    //         pageIndex: String(pagination.pageIndex),
    //         pageSize: String(pagination.pageSize),
    //         ...searchObj,
    //     }).toString();
    //     return axiosAuth.get<GeneralApiResponse<ISupplierGroupSelect | any>>(`${BASE_URL}${prefix}/getSupplierGroupForSelectInput/?${query}`);
    // };

    const getAllSupplierGroup = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ISupplierGroup>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const addNewAccountDocumentVersion = async (obj: any) => {
        return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/addNewAccountDocumentVersion`, obj)
    }
    return {
        addSupplierGroup, deleteSupplierGroupById, updateSupplierGroupById, getSupplierGroupById, getAllSupplierGroup
    };
};

export const useAddSupplierGroup = () => {

    const queryClient = useQueryClient();
    const api = useSupplierGroupApiHook()
    return useMutation({
        mutationFn: api.addSupplierGroup,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SupplierGroup"] });
            // toastSuccess(res);
        },
    });
};

export const useSupplierGroupById = (id: string) => {
    const api = useSupplierGroupApiHook()

    return useQuery({
        queryKey: ["SupplierGroup_id", id],
        queryFn: () => api.getSupplierGroupById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useSupplierGroup = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useSupplierGroupApiHook()

    return useQuery({
        queryKey: ["SupplierGroup", pagination, searchObj],
        queryFn: () => api.getAllSupplierGroup(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ISupplierGroup>,
    });
};

// export const useInspirationForSelect = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

//     const pagination = usePagination(getPaginationFromParams);

//     const api = useSupplierGroupApiHook()

//     return useQuery({
//         queryKey: ["SupplierGroup", pagination, searchObj],
//         queryFn: () => api.getSupplierGroupForSelect(pagination, searchObj).then((res) => res?.data),
//     });
// };

export const usedeleteSupplierGroupById = () => {
    const api = useSupplierGroupApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteSupplierGroupById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SupplierGroup"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateSupplierGroupById = () => {
    const api = useSupplierGroupApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateSupplierGroupById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["SupplierGroup"] });
            // toastSuccess(res);
        },
    });
};

// export const useAccountNewVersionAdd = () => {
//     const api = useSupplierGroupApiHook()

//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: api.addNewAccountDocumentVersion,
//         onSuccess: (res) => {
//             queryClient.invalidateQueries({ queryKey: ["SupplierGroup"] });
//             // toastSuccess(res);
//         },
//     });
// };

