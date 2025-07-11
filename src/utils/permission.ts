import { useEffect, useState } from "react";
import { getAuth } from "./auth";
import { useRolesByRole } from "@/services/roles.service";
import { useMemo } from "react";

interface Permissions {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
  isRouteShow: boolean;
}
interface RoutePermission {
  routeName: string;
  permissions: Permissions;
  isEditing?: boolean;
}
export const getPermissions = () => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<RoutePermission[]>([]);

  const getRole = async () => {
    const decodedToken = await getAuth();

    setUserId(decodedToken.userId);
    setRole(decodedToken.role);
  };

  useEffect(() => {
    getRole();
  }, []);

  const { data: roleDataByRole } = useRolesByRole(role || "");

  useEffect(() => {
    if (roleDataByRole) {
      setPermissions(
        roleDataByRole?.data?.routePermissions as RoutePermission[]
      );

      // setPermissions(roleDataById?.data?);
    }
  }, [roleDataByRole]);

  return permissions;
};

export const RoutePermission = (route: string) => {
  const permissionsData = getPermissions();

  console.log(permissionsData, "permissionsData");

  const result = permissionsData?.find((item) => item.routeName === route)
    ?.permissions?.isRouteShow;

  console.log(result, "check for route");
  if (result) {
    return route;
  }
};

export const checkPermissionsForButtons = (routeName: string) => {
  const permissions = getPermissions();
  // console.log(permissions, "permissions");

  const filterData = permissions.filter((item) => item.routeName === routeName);
  // const routePermissions = useMemo(() => {
  //   const permissionsFound = permissions.find(
  //     (Permission) => Permission.routeName === routeName
  //   );
  //   return permissionsFound?.permissions || {
  //     create: false,
  //     view: false,
  //     update: false,
  //     delete: false,
  //   }
  // }, [permissions,  routeName]);

  // return {
  //   canCreate: routePermissions?.create,
  //   canView: routePermissions?.view,
  //   canUpdate: routePermissions?.update,
  //   canDelete: routePermissions?.delete,
  //   hasAnyPermission: Object.values(routePermissions).some(Boolean)
  // }

  return {
    canCreate: filterData[0]?.permissions?.create,
    canView: filterData[0]?.permissions?.view,
    canUpdate: filterData[0]?.permissions?.update,
    canDelete: filterData[0]?.permissions?.delete,
  };
};

export const CreateRoutePermission = (route: string, item: any) => {
  const permissionsData = getPermissions();

  const result = permissionsData?.find((item) => item.routeName === route);

  if (result && result?.permissions) {
    return {
      view: result.permissions.create || result.permissions.view,
      create: result.permissions.create,
    };
  }

  return {
    view: false,
    create: false,
  };
};
