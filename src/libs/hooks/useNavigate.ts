import { useNavigate } from "react-router-dom";

// export const useNavigate = () => {
//   const navigate = useNavigate();
//   return navigate;
// };

export const useNavigateReplace = () => {
  const navigate = useNavigate();
  const navigateReplace = (str: string) => {
    navigate(str, { replace: true });
  };
  return navigateReplace;
};

