
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "./provider/SidebarContext";
import RoutesPage from "./router/RoutesPage";

import { AuthProvider } from "@/context/AuthProvider";

function App() {
  return (<div className="h-screen">
    <AuthProvider>
      <Toaster />
      <SidebarProvider>
        <RoutesPage />
      </SidebarProvider>
    </AuthProvider>
  </div>



  );
}

export default App;
