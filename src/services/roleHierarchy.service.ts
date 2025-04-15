// roleHierarchy.service.ts
import { useQuery } from "@tanstack/react-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "../libs/hooks/axios";
import BASE_URL, { GeneralApiResponse } from "./urls.service";

const prefix = "/roles";
interface Role {
    id: string;
    name: string;
    reportsTo: string | null;
    description?: string;
    children?: Role[];
}

export const useRoleHierarchyApi = () => {
  const getRoleHierarchy = async () => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/hierarchy`
    );
  };

  return {
    getRoleHierarchy,
  };
};

export const useRoleHierarchy = () => {
  const api = useRoleHierarchyApi();
  return useQuery({
    queryKey: ["RoleHierarchy"],
    queryFn: () => api.getRoleHierarchy().then((res) => res.data),
  });
};
