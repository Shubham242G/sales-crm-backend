import { useCallback, useEffect, useState } from "react";
import { refreshTokenApi } from "@/services/user.service";
import { signIn, useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // Token expiry timestamp in seconds
}

// A global variable to track whether a refresh is in progress
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export const useRefreshToken = () => {
  const { data: session, status }: any = useSession();
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
        if (session?.user?.refreshToken) {
          const res = await refreshTokenApi({
            refresh: session.user.refreshToken,
            email: session.user.email,
          });

          if (res.data?.token) {
            // Silent sign-in to refresh tokens
            await signIn("credentials", {
              email: session.user.email,
              accessToken: res.data.token,
              refreshToken: res.data.refreshToken,
              redirect: false, // Prevent page redirect
            });

            // Update session manually after refreshing tokens
            session.user.accessToken = res.data.token;
            session.user.refreshToken = res.data.refreshToken;

            resolve(); // Resolve the promise when done
          } else {
            signIn(); // Trigger sign-in if no token is returned
            reject(new Error("Failed to refresh token"));
          }
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        signIn(); // Trigger sign-in if refresh fails
        reject(error);
      } finally {
        // Reset the global flags after the request is done
        isRefreshing = false;
        setIsTokenRefreshing(false);
      }
    });

    return refreshPromise;
  }, [session?.user?.refreshToken, session?.user?.email]);

  useEffect(() => {
    // Function to check token expiry
    const checkTokenExpiry = () => {
      if (session?.user?.accessToken) {
        const decodedToken: DecodedToken = jwtDecode(session.user.accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        // Only refresh if the token is about to expire (e.g., less than 5 minutes left)
        if (decodedToken.exp - currentTime < 300) {
          refreshToken();
        }
      }
    };

    // Set an interval to check token expiry every 5 minutes only if authenticated
    if (status === "authenticated" && session?.user?.accessToken) {
      checkTokenExpiry(); // Initial check

      // Check every 5 minutes
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

      return () => clearInterval(interval); // Cleanup the interval
    }
  }, [status, session?.user?.accessToken, refreshToken]);

  return refreshToken;
};
