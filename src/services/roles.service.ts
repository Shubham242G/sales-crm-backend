import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";

// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";

const prefix = "/roles";

interface Permissions {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
}

// Role model
interface IRoles {
  roleName: string;
  description: string;
  name: string;
  email: string;
  phoneNo: string;
  designation: string;
  department: string;
  routePermissions: RoutePermission[];
}

// Permissions for each route
interface RoutePermission {
  routeName: string;
  permissions: Permissions;
  isEditing?: boolean;
}

export const useRolesApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addRoles = async (obj: any) => {
    return axios.post<GeneralApiResponse<IRoles>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateRolesById = async ({ id, obj }: { id: string; obj: any }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };
  const deleteRolesById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getRolesById = async (id: any) => {
    return axios.get<GeneralApiResponse<IRoles>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };


  const getRolesByRole = async (role: any) => {
    return axios.get<GeneralApiResponse<IRoles>>(
      `${BASE_URL}${prefix}/getByRole/${role}`
    );
  };

  const getAllRoles = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axios.get<GeneralApiResponsePagination<IRoles>>(
      `${BASE_URL}${prefix}/?${query}`
    );
  };

  return {
    getAllRoles,
    updateRolesById,
    deleteRolesById,
    getRolesById,
    addRoles,
    getRolesByRole
  };
};

export const useAddRoles = () => {
  const queryClient = useQueryClient();
  const api = useRolesApiHook();
  return useMutation({
    mutationFn: api.addRoles,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
    },
  });
};

export const useRolesById = (id: string) => {
  const api = useRolesApiHook();

  return useQuery({
    queryKey: ["Roles_id", id],
    queryFn: () => api.getRolesById(id).then((res) => res.data),
    enabled: !!id,
  });
};


export const useRolesByRole = (role: string) => {
  const api = useRolesApiHook();

  return useQuery({
    queryKey: ["Roles_id", role],
    queryFn: () => api.getRolesByRole(role).then((res) => res.data),
    enabled: !!role,
  });
};

export const useRoles = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useRolesApiHook();

  return useQuery({
    queryKey: ["Roles", pagination, searchObj],
    queryFn: () =>
      api.getAllRoles(pagination, searchObj).then((res: any) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<IRoles>,
  });
};

export const usedeleteRolesById = () => {
  const api = useRolesApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteRolesById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateRolesById = () => {
  const api = useRolesApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateRolesById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
    },
  });
};
