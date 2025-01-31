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
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
    isLoading: boolean;
}

// Define default values
const defaultContextValue: AuthContextType = {
    isAuthorized: false,
    setIsAuthorized: () => {},
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
   

    return (<>
        {/* <AuthContext.Provider value={isAuthorized, setIsAuthorized, token, isLoading} >
            {children}
        </AuthContext.Provider> */}
    </>);
};

// Custom hook to use the AuthContext
