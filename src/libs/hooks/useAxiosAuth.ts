"use client";
import { useEffect, useCallback } from "react";
import { axiosAuth } from "./axios";
import { useRefreshToken } from "./useRefreshToken";
import { getAuth } from "@/utils/auth";
const useAxiosAuth = () => {
  const data: any = getAuth();
  const refreshToken = useRefreshToken();
  const setupInterceptors = useCallback(() => {
    if (data?.user?.accessToken) {
      const requestIntercept = axiosAuth.interceptors.request.use(
        async (config: any) => {
          if (!config.headers["authorization"]) {
            config.headers["authorization"] = `Bearer ${data?.token}`;
          }
          // Check if the token is about to expire in less than 5 minutes
          const tokenExpiresIn = data?.refreshToken;
          if (tokenExpiresIn && Date.now() > tokenExpiresIn - 5 * 60 * 1000) {
            console.log("Token is about to expire. Refreshing...");
            // Wait for the refresh token to complete before proceeding
            // await refreshToken();
            // Update the data with the new token if necessary
            // update({
            //   ...data,
            //   user: {
            //     ...data.user,
            //     accessToken: data.user.accessToken,
            //     accessTokenExpires: data.user.accessTokenExpires,
            //   },
            // });
            // Set the updated token in the headers
            config.headers["authorization"] = `Bearer ${data?.user?.accessToken}`;
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
            // update({
            //   ...session,
            //   user: {
            //     ...session.user,
            //     accessToken: session.user.accessToken,
            //     accessTokenExpires: session.user.accessTokenExpires,
            //   },
            // });
            // Set the updated token in the headers for the retried request
            // prevRequest.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
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
  }, [data?.token, data.refreshToken]);
  useEffect(() => {
    setupInterceptors();
  }, [setupInterceptors]);
  return axiosAuth;
};
export default useAxiosAuth;