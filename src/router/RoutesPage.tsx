import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthorizedRoutes from "./AuthorizedRoutes";
import UnauthorizedRoutes from "./UnauthorizedRoutes";
import { AuthContext } from "../context/AuthProvider";
import { getAuth } from "@/utils/auth";

export default function RootRouter() {
  const { isAuthorized, setIsAuthorized } = useContext(AuthContext);

  const checkAuth = async () => {
    try {
      const decodedToken = await getAuth();
      console.log(decodedToken, "check decode token");
      if (decodedToken?.token) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
    console.log(isAuthorized);
  }, [isAuthorized]);

  // if (isLoading) {
  //   // return <div><AuthorizedRoutes /></div>; // Replace with a loading spinner or other UI
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Router>
        {isAuthorized ? <AuthorizedRoutes /> : <UnauthorizedRoutes />}
      </Router>
    </>
  );
}
