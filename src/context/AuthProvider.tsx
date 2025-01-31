import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

// Define the shape of the context
interface AuthContextType {
    isAuthorized: boolean;
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define default values
const defaultContextValue: AuthContextType = {
    isAuthorized: false,
    setIsAuthorized: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

   

    return (<>
        <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }} >
            {children}
        </AuthContext.Provider>
    </>);
};

// Custom hook to use the AuthContext
