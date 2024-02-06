import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const [cookies] = useCookies(["auth"]);

  const redirect = useNavigate();

  if (!cookies.auth) {
    redirect("/auth");
    return "";
  }

  return cookies.auth;
};
