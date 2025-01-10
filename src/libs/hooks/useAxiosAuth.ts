"use client";
import { useSession } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { axiosAuth } from "./axios";
import { useRefreshToken } from "./useRefreshToken";
const useAxiosAuth = () => {
  const { data: session, update }: any = useSession();
  const refreshToken = useRefreshToken();
  const setupInterceptors = useCallback(() => {
    if (session?.user?.accessToken) {
      const requestIntercept = axiosAuth.interceptors.request.use(
        async (config: any) => {
          if (!config.headers["authorization"]) {
            config.headers["authorization"] = `Bearer ${session?.user?.accessToken}`;
          }
          // Check if the token is about to expire in less than 5 minutes
          const tokenExpiresIn = session?.user?.accessTokenExpires;
          if (tokenExpiresIn && Date.now() > tokenExpiresIn - 5 * 60 * 1000) {
            console.log("Token is about to expire. Refreshing...");
            // Wait for the refresh token to complete before proceeding
            await refreshToken();
            // Update the session with the new token if necessary
            update({
              ...session,
              user: {
                ...session.user,
                accessToken: session.user.accessToken,
                accessTokenExpires: session.user.accessTokenExpires,
              },
            });
            // Set the updated token in the headers
            config.headers["authorization"] = `Bearer ${session?.user?.accessToken}`;
          }
          return config;
        },
        (error: any) => Promise.reject(error)
      );
      const responseIntercept = axiosAuth.interceptors.response.use(
        (response: any) => response,
        async (error: any) => {
          const prevRequest = error?.config;
          if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            // Wait for the refresh token to complete before retrying the request
            await refreshToken();
            // Update the session after the refresh token
            update({
              ...session,
              user: {
                ...session.user,
                accessToken: session.user.accessToken,
                accessTokenExpires: session.user.accessTokenExpires,
              },
            });
            // Set the updated token in the headers for the retried request
            prevRequest.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
            return axiosAuth(prevRequest);
          }
          return Promise.reject(error);
        }
      );
      return () => {
        axiosAuth.interceptors.request.eject(requestIntercept);
        axiosAuth.interceptors.response.eject(responseIntercept);
      };
    }
  }, [session?.user?.accessToken, refreshToken, update]);
  useEffect(() => {
    setupInterceptors();
  }, [setupInterceptors]);
  return axiosAuth;
};
export default useAxiosAuth;
