
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "./provider/SidebarContext";
import RoutesPage from "./router/RoutesPage";


function App() {
  return (
    <>
     <Toaster />
    <SidebarProvider>

    <RoutesPage/>
    </SidebarProvider>
   
    </>
  );
}

export default App;
