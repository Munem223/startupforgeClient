import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { getErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { isAuthenticated, finalizeAuthentication } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const location = useLocation(); const navigate = useNavigate();
  const intended = location.state?.from || "/dashboard";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const result = await authClient.signIn.email({ email: form.email, password: form.password, rememberMe: true });
      if (result.error) throw new Error(result.error.message);
      await finalizeAuthentication();
      toast.success("Welcome back to StartupForge");
      navigate(intended, { replace: true });
    } catch (error) { toast.error(getErrorMessage(error, "Unable to sign in")); } finally { setLoading(false); }
  };

  const googleLogin = async () => {
    localStorage.setItem("sf_intended_route", intended);
    await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/auth/callback`, errorCallbackURL: `${window.location.origin}/login` });
  };

  return <section className="auth-page"><div className="auth-art"><div className="auth-art-content"><span className="eyebrow"><Sparkles size={15} /> Build with the right people</span><h1>Your next team could begin with one login.</h1><p>Return to your workspace, review applications, discover opportunities, and keep the momentum moving.</p><div className="auth-quote">“Great companies start when complementary people decide to build together.”</div></div></div><div className="auth-form-wrap"><div className="auth-form-card"><span className="eyebrow">Welcome back</span><h2>Sign in to StartupForge</h2><p>Use your email and password, or continue securely with Google.</p>
    <button className="google-button" type="button" onClick={googleLogin}><span>G</span> Continue with Google</button><div className="divider"><span>or use email</span></div>
    <form onSubmit={submit} className="form-stack"><label>Email address<div className="input-with-icon"><Mail size={18} /><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label><label>Password<div className="input-with-icon"><LockKeyhole size={18} /><input type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" /><button type="button" onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><button className="button button-primary button-block" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button></form>
    <p className="auth-switch">New to StartupForge? <Link to="/register">Create an account</Link></p></div></div></section>;
}
