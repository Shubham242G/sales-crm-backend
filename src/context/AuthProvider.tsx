import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { axiosAuth } from "../libs/hooks/axios";
import { getAuth } from "../utils/auth";
import { toastError } from "../utils/toast";

// Define the shape of the context
interface AuthContextType {
    isAuthorized: boolean;
    token: string;
    isLoading: boolean;
}

// Define default values
const defaultContextValue: AuthContextType = {
    isAuthorized: false,
    token: "",
    isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAuthorization = async () => {
        try {
            const decodedToken = await getAuth();


            if (decodedToken?.token) {
                setToken(decodedToken.token);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            toastError("Failed to fetch authorization");
            setIsAuthorized(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchAuthorization();
    }, []);

    useEffect(() => {
        const requestInterceptor = axiosAuth.interceptors.request.use(
            (config) => {
                if (token && config.headers) {
                    config.headers["authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosAuth.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error("Interceptor error:", error);
                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.request.eject(requestInterceptor);
            axiosAuth.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    const contextValue: AuthContextType = {
        isAuthorized,
        token,
        isLoading,
    };

    return (<>
        <AuthContext.Provider value={contextValue} >
            {children}
        </AuthContext.Provider>
    </>);
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};