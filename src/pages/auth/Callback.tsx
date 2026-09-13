import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  navigate("/", { replace: true });
  return null;
}
