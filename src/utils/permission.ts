import { useEffect, useState } from "react";
import { getAuth } from "./auth";
import { useRolesByRole } from "@/services/roles.service";


interface Permissions {
    create: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
   
  }
interface RoutePermission {
    routeName: string;
    permissions: Permissions;
    isEditing?: boolean;
  }
export const getPermissions =() =>  {

      const [userId, setUserId] = useState("");
      const [role, setRole] = useState("");
      const [permissions, setPermissions] = useState<RoutePermission[]>([]);


      const getRole = async () => {
        const decodedToken = await getAuth();
        console.log(decodedToken, "check decode toke for side bar role");
        setUserId(decodedToken.userId);
        setRole(decodedToken.role);
      };
    
      useEffect(() => {
        getRole();
      }, []);
    
      const { data: roleDataByRole } = useRolesByRole(role || "");
    
      useEffect(() => {
        if (roleDataByRole) {
          console.log(roleDataByRole, "check roleDataById");
          setPermissions(roleDataByRole?.data?.routePermissions as RoutePermission[])
          // setPermissions(roleDataById?.data?);
        }
      }, [roleDataByRole]);
    
return permissions;

}



export const RoutePermission = (route: string)=> {

    
   const permissionsData  = getPermissions()
console.log(permissionsData,route,"permissions")
   const result = permissionsData?.some((item) => item.routeName === route);


  if(result){
    return route
  }


}



// export const PermissionForButton = () => {


// }

