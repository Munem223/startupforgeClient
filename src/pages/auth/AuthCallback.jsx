import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/api";

export default function AuthCallback() {
  const { finalizeAuthentication } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const role = localStorage.getItem("sf_pending_role");
        const intended = localStorage.getItem("sf_intended_route") || "/dashboard";
        await finalizeAuthentication(role || undefined);
        localStorage.removeItem("sf_pending_role");
        localStorage.removeItem("sf_intended_route");
        toast.success("Signed in successfully");
        navigate(intended, { replace: true });
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not complete authentication"));
        navigate("/login", { replace: true });
      }
    };
    run();
  }, [finalizeAuthentication, navigate]);

  return <Loader fullPage label="Completing secure sign-in" />;
}
