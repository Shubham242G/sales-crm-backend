import React,{useContext, useEffect} from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthorizedRoutes from "./AuthorizedRoutes";
import UnauthorizedRoutes from "./UnauthorizedRoutes";
import { AuthContext } from "../context/AuthProvider";
import { getAuth } from "@/utils/auth";


export default function RootRouter() {
    const { isAuthorized, setIsAuthorized } = useContext(AuthContext);


const checkAuth =  async() => {
  try {
    const decodedToken = await getAuth();

    console.log(decodedToken);
    if (decodedToken?.token) {
      setIsAuthorized(true);
  } else {
      setIsAuthorized(false);
  }
    
  } catch (error) {
    
  }
}

console.log(isAuthorized, "isAuthorized");
useEffect(() => {
  checkAuth()
},[])

 

  // if (isLoading) {
  //   // return <div><AuthorizedRoutes /></div>; // Replace with a loading spinner or other UI
  //   return <div>Loading...</div>;
  // }

  return (<>
    
      {isAuthorized ? <Router><AuthorizedRoutes /> </Router>:<Router><UnauthorizedRoutes /></Router> }
      {/* {<AuthorizedRoutes />} */}
      </>
  );
}