import { PaginationState } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { STATUS_TYPE } from "@/common/constant.common";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
  ReactSelectFormat,
} from "./urls.service";
import { usePagination } from "@/libs/hooks/usePagination";
import axios from "axios";
import axiosAuth from "./axios.service";

const prefix = "/users";

export interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  stateId?: string;
  cityId?: string;
  leadId?: string;
  status?: STATUS_TYPE;
  countryId?: string;
  regionId?: string;
  locationId?: string;
  countryName?: string;
  stateName?: string;
  regionName?: string;
  cityName?: string;
  locationName?: string;
  address?: string;
  password?: string;
  role?: string;
  createdAt?: Date;
  updateAt?: Date;
  isFirstLogin?: boolean;
}

export const changePasswordApi = async (obj: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  id: string;
}) => {
  return axiosAuth.patch<GeneralApiResponse>(
    `${BASE_URL}${prefix}/changePassword`,
    obj
  );
};

export const loginApi = async (obj: IUser) => {
  return axios.post(`${BASE_URL}${prefix}/login`, obj);
};

export const refreshTokenApi = async (obj: any) => {
  return axios.post(`${BASE_URL}${prefix}/refreshToken`, obj);
};

export const useUserApiHook = () => {
  const addUser = async (obj: IUser) => {
    return axiosAuth.post<GeneralApiResponse>(
      `${BASE_URL}${prefix}/create-user`,
      obj
    );
  };

  const updateUser = async (obj: any) => {
    return axiosAuth.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${obj.id}`,
      obj
    );
  };

  const deleteUser = async (id: string | undefined) => {
    return axiosAuth.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteUserById/${id}`
    );
  };

  const getUserById = async (id: string | undefined) => {
    return axiosAuth.get<GeneralApiResponse<IUser>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getUsers = async (
    pagination: PaginationState,
    searchObj: Record<string, unknown> = {}
  ) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axiosAuth.get<GeneralApiResponsePagination<IUser>>(
      `${BASE_URL}${prefix}/getAllUsers?${query}`
    );
  };

  const getUserForSelect = async (
    searchObj: Record<string, boolean | unknown> = {}
  ) => {
    const query = new URLSearchParams({
      isForSelectInput: "true",
      ...searchObj,
    }).toString();
    return axiosAuth.get<GeneralApiResponsePagination<ReactSelectFormat>>(
      `${BASE_URL}${prefix}/getAllUsers?${query}`
    );
  };

  const getAllUserName = async () => {
    return axios.get<GeneralApiResponsePagination<any>>(
      `${BASE_URL}${prefix}/getAllUserName`
    );
  };

  const addExcelData = async (obj: IUser) => {
    return axios.post<GeneralApiResponse>(
      `${BASE_URL}/sportsCenter/excelImportForSportcenter`,
      obj,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  };

  return {
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsers,
    getUserForSelect,
    addExcelData,
    changePasswordApi,
    getAllUserName,
  };
};

export const getUserExcel = async (searchParams?: any) => {
    try {
        const response = await axios.post(`${BASE_URL}${prefix}/getExcel`, searchParams);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addUserExcel = async (obj: any) => {
    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadEnquiry`, obj, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const useAddExcelData = () => {
  const queryClient = useQueryClient();
  const api = useUserApiHook();
  return useMutation({
    mutationFn: api.addExcelData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
  });
};

export const useAddUser = () => {
  const apis = useUserApiHook();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apis.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
      // toastSuccess(res);
    },
  });
};

export const useUserById = (id?: string, enabled: boolean = true) => {
  const apis = useUserApiHook();
  return useQuery({
    queryKey: ["User_id", id],
    queryFn: () => apis.getUserById(id).then((res) => res.data.data),
    enabled: !!id && enabled,
  });
};

export const useUserForSelect = (searchObj: Record<string, unknown> = {}) => {
  const apis = useUserApiHook();
  return useQuery({
    queryKey: ["User_for_select", searchObj],
    queryFn: () => apis.getUserForSelect(searchObj).then((res) => res.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    },
  });
};

export const useUserName = () => {
  const api = useUserApiHook();
  return useQuery({
    queryKey: ["UserName"],
    queryFn: () => api.getAllUserName().then((res: any) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const useUser = (
  searchObj: Record<string, unknown> = {},
  getPaginationFromParams = false
) => {
  const pagination = usePagination(getPaginationFromParams);
  const apis = useUserApiHook();

  return useQuery({
    queryKey: ["User", pagination, searchObj],
    queryFn: () => apis.getUsers(pagination, searchObj).then((res) => res.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    },
  });
};

export const useDeleteUser = () => {
  const apis = useUserApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apis.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateUser = () => {
  const apis = useUserApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apis.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
      // toastSuccess(res);
    },
  });
};


// export const useChangePassword = ( obj: any) => {
//     const queryClient = useQueryClient();
//     const api = useUserApiHook();
//     return useMutation({
//         mutationFn: api.changePasswordApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["UserPasswordChange" ,obj] });
//             // toastSuccess(res);
//         },
//     });
// };
