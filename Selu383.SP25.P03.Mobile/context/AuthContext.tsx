import React, { Children, createContext, useEffect, useState, ReactNode} from 'react';
import AuthServices from '@/services/AuthServices';

const authServices = new AuthServices();

interface AuthType{
    isAuthenticated: boolean,
    signin: (username:string, password:string) => Promise<void>
    signout: () => Promise<void>;
}

export const AuthContext = createContext<AuthType |undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) =>{
    const[isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    
    useEffect(()=>{
        const checkAuth = async ()=>{
            const authStatus = await authServices.isAuthenticated();
            setIsAuthenticated(!!authStatus)
        }
        checkAuth();
    },[])

    const signin = async (username:string, password:string)=>{
        await authServices.login({username, password})
        setIsAuthenticated(true)
    }
    const signout = async ()=>{
        await authServices.logout();
        setIsAuthenticated(false);
    }
    return(
        <AuthContext.Provider value={{isAuthenticated, signin, signout}}>
            {children}
        </AuthContext.Provider>
    )
}

