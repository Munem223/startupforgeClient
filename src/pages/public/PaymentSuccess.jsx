import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgeCheck, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

export default function PaymentSuccess() {
  const [params] = useSearchParams(); const [state, setState] = useState("loading");
  const { refreshProfile } = useAuth();
  useEffect(() => {
    const verify = async () => {
      try {
        const sessionId = params.get("session_id");
        const response = await api.get("/payments/verify", { params: { session_id: sessionId } });
        if (!response.data.data.paid) throw new Error("Payment is not marked as paid");
        await refreshProfile(); setState("success");
      } catch (error) { toast.error(getErrorMessage(error)); setState("error"); }
    };
    verify();
  }, [params, refreshProfile]);
  if (state === "loading") return <Loader fullPage label="Confirming your payment" />;
  return <section className="payment-result"><div className="surface-card"><BadgeCheck size={64} /><span className="eyebrow">{state === "success" ? "Payment confirmed" : "Verification issue"}</span><h1>{state === "success" ? "Your founder workspace is now premium." : "We could not verify this payment."}</h1><p>{state === "success" ? "You can now publish unlimited opportunities for the next year. Your transaction has been saved securely." : "Please return to the dashboard and try again. No access was granted without a verified Stripe payment."}</p><Link className="button button-primary" to="/dashboard"><LayoutDashboard size={18} /> Open dashboard</Link></div></section>;
}
