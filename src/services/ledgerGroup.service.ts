import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/ledgerGroup";
console.log(BASE_URL)
export interface ILedgerGroup  {
    name: string,
}

// export interface ILedgerGroupSelect {
//     label: string;6
//     value: string;
// }

export const useAgentsApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addLeadgerGroup = async (obj: any,) => {
        return axios.post<GeneralApiResponse<ILedgerGroup>>(`${BASE_URL}${prefix}/`, obj);
    };
    const updateLeadgerGroupById = async ({ id, obj }: { id: string, obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteLeadgerGroupById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getLeadgerGroupById = async (id: any) => {
        return axios.get<GeneralApiResponse<ILedgerGroup>>(`${BASE_URL}${prefix}/getById/${id}`);
    };
    // const getAgentsForSelect = async (pagination: PaginationState, searchObj: any) => {
    //     const query = new URLSearchParams({
    //         pageIndex: String(pagination.pageIndex),
    //         pageSize: String(pagination.pageSize),
    //         ...searchObj,
    //     }).toString();
    //     return axiosAuth.get<GeneralApiResponse<ILedgerGroupSelect | any>>(`${BASE_URL}${prefix}/getAgentsForSelectInput/?${query}`);
    // };

    const getAllLeadgerGroup = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<ILedgerGroup>>(`${BASE_URL}${prefix}/?${query}`);
    };

    const addNewAccountDocumentVersion = async (obj: any) => {
        return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/addNewAccountDocumentVersion`, obj)
    }
    return {
        addLeadgerGroup, deleteLeadgerGroupById, updateLeadgerGroupById, getLeadgerGroupById, getAllLeadgerGroup
    };
};

export const useAddLedgerGroup = () => {

    const queryClient = useQueryClient();
    const api = useAgentsApiHook()
    return useMutation({
        mutationFn: api.addLeadgerGroup,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["LedgerGroup"] });
            // toastSuccess(res);
        },
    });
};

export const useLeadgerGroupById = (id: string) => {
    const api = useAgentsApiHook()

    return useQuery({
        queryKey: ["LedgerGroup_id", id],
        queryFn: () => api.getLeadgerGroupById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useLedgerGroup = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

    const pagination = usePagination(getPaginationFromParams);

    const api = useAgentsApiHook()

    return useQuery({
        queryKey: ["LedgerGroup", pagination, searchObj],
        queryFn: () => api.getAllLeadgerGroup(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<ILedgerGroup>,
    });
};

// export const useInspirationForSelect = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {

//     const pagination = usePagination(getPaginationFromParams);

//     const api = useAgentsApiHook()

//     return useQuery({
//         queryKey: ["Agents", pagination, searchObj],
//         queryFn: () => api.getAgentsForSelect(pagination, searchObj).then((res) => res?.data),
//     });
// };

export const usedeleteLeadgerGroupById = () => {
    const api = useAgentsApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteLeadgerGroupById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["LedgerGroup"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateLeadgerGroupById = () => {
    const api = useAgentsApiHook()
    
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateLeadgerGroupById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["LedgerGroup"] });
            // toastSuccess(res);
        },
    });
};

// export const useAccountNewVersionAdd = () => {
//     const api = useAgentsApiHook()

//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: api.addNewAccountDocumentVersion,
//         onSuccess: (res) => {
//             queryClient.invalidateQueries({ queryKey: ["Agents"] });
//             // toastSuccess(res);
//         },
//     });
// };

