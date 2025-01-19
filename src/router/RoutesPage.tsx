import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthorizedRoutes from "./AuthorizedRoutes";
import UnauthorizedRoutes from "./UnauthorizedRoutes";
import { useAuth } from "../context/AuthProvider";

export default function RootRouter() {
  const { isAuthorized, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a loading spinner or other UI
  }

  return (
    <>
      {/* {isAuthorized ? <AuthorizedRoutes /> : <UnauthorizedRoutes />} */}
      {<AuthorizedRoutes />}
    </>
  );
}