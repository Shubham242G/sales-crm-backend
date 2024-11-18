import { useRouter } from "next/navigation";

export const useNavigate = () => {
 if(typeof window !== "undefined"){
   
   const router = useRouter();
   
   const navigate = (str: string | undefined) => {
    if(!str){
      return
    }
     router.push(str);
    };
    return navigate;
  }
};

export const useNavigateReplace = () => {
  if(typeof window !== "undefined"){
    const router = useRouter();
    
    const navigate = (str: string) => {
      router.replace(str);
    };
    return navigate;
  }
};
