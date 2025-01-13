import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuth, storeAuthData } from "@/utils/auth";
import { refreshTokenApi } from "@/services/user.service";

interface DecodedToken {
  exp: number; // Token expiry timestamp in seconds
}

// A global variable to track whether a refresh is in progress
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export const useRefreshToken = () => {
  const data: any = getAuth();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  const refreshToken = useCallback(async () => {
    // If a refresh request is already in progress, return the same promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    // Set refreshing flag
    isRefreshing = true;
    setIsTokenRefreshing(true);

    refreshPromise = new Promise<void>(async (resolve, reject) => {
      try {
        if (data?.refreshToken) {
          const res = await refreshTokenApi({
            refresh: data.token,
            email: data.user.email,
          });

          if (res.data?.token) {
            // Silent sign-in to refresh tokens
            let decodedToken: any = await jwtDecode(res.data.token);

            let authToken = {
              ...res.data,
              token: res.data.token,
              role: decodedToken.role,
              userId: decodedToken.userId,
              user: decodedToken.user,
            };
            await storeAuthData(authToken);
            // Update session manually after refreshing tokens
            ;

            resolve(); // Resolve the promise when done
          } else {
            reject(new Error("Failed to refresh token"));
          }
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        reject(error);
      } finally {
        // Reset the global flags after the request is done
        isRefreshing = false;
        setIsTokenRefreshing(false);
      }
    });

    return refreshPromise;
  }, [data?.refreshToken, data?.user?.email]);

  useEffect(() => {
    // Function to check token expiry
    const checkTokenExpiry = () => {
      if (data?.token) {
        const decodedToken: DecodedToken = jwtDecode(data?.token);
        const currentTime = Math.floor(Date.now() / 1000);

        // Only refresh if the token is about to expire (e.g., less than 5 minutes left)
        if (decodedToken.exp - currentTime < 300) {
          refreshToken();
        }
      }
    };

    // Set an interval to check token expiry every 5 minutes only if authenticated
    if (status === "authenticated" && data?.token) {
      checkTokenExpiry(); // Initial check

      // Check every 5 minutes
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

      return () => clearInterval(interval); // Cleanup the interval
    }
  }, [status, data?.token, refreshToken]);

  return refreshToken;
};
