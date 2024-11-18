import { createContext, ReactNode, useContext, useState } from "react"

 interface SidebarContextProps{
    showSlim:boolean,
    setShowSlim:any,
    toggleSlim:()=>void,
 }

const SidebarContext = createContext<SidebarContextProps| undefined>(undefined)

export const SidebarProvider = ({children}:{children:ReactNode}) => {

    
const [showSlim,setShowSlim] = useState(true)


const toggleSlim = () => 
{
    setShowSlim(!showSlim)
}


  return (
    <SidebarContext.Provider value={{showSlim,toggleSlim,setShowSlim}}>
    
    {children}
    </SidebarContext.Provider>
  )
}


export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
      throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
  };

