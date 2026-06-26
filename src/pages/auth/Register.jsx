import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BriefcaseBusiness, Eye, EyeOff, Lightbulb, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { getErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import ImageUploader from "../../components/ImageUploader";

export default function Register() {
  const { isAuthenticated, finalizeAuthentication } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "", role: "collaborator" });
  const navigate = useNavigate();
  const passwordState = useMemo(() => ({ length: form.password.length >= 6, upper: /[A-Z]/.test(form.password), lower: /[a-z]/.test(form.password) }), [form.password]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.image) return toast.error("Please upload a profile image");
    if (!Object.values(passwordState).every(Boolean)) return toast.error("Password does not meet all rules");
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name: form.name, email: form.email, password: form.password, image: form.image });
      if (result.error) throw new Error(result.error.message);
      await finalizeAuthentication(form.role);
      toast.success("Your StartupForge account is ready");
      navigate("/dashboard", { replace: true });
    } catch (error) { toast.error(getErrorMessage(error, "Registration failed")); } finally { setLoading(false); }
  };

  const googleRegister = async () => {
    localStorage.setItem("sf_pending_role", form.role);
    localStorage.setItem("sf_intended_route", "/dashboard");
    await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/auth/callback`, errorCallbackURL: `${window.location.origin}/register` });
  };

  return <section className="auth-page"><div className="auth-art register-art"><div className="auth-art-content"><span className="eyebrow">Choose how you want to build</span><h1>Found an idea or find your next mission.</h1><p>Founder accounts publish startups and recruit teams. Collaborator accounts discover roles and apply with their skills.</p><div className="role-preview"><div><Lightbulb /><strong>Founder</strong><span>Turn an idea into a team.</span></div><div><BriefcaseBusiness /><strong>Collaborator</strong><span>Bring your craft to bold teams.</span></div></div></div></div><div className="auth-form-wrap"><div className="auth-form-card register-card"><span className="eyebrow">Create your profile</span><h2>Join StartupForge</h2><p>Set up your identity, role, and secure login.</p>
    <div className="role-picker"><button type="button" className={form.role === "founder" ? "active" : ""} onClick={() => setForm({ ...form, role: "founder" })}><Lightbulb size={19} /><span><strong>Founder</strong><small>I want to build a team</small></span></button><button type="button" className={form.role === "collaborator" ? "active" : ""} onClick={() => setForm({ ...form, role: "collaborator" })}><BriefcaseBusiness size={19} /><span><strong>Collaborator</strong><small>I want to join a team</small></span></button></div>
    <button className="google-button" type="button" onClick={googleRegister}><span>G</span> Continue with Google</button><div className="divider"><span>or register with email</span></div>
    <form onSubmit={submit} className="form-stack"><ImageUploader value={form.image} onChange={(image) => setForm({ ...form, image })} label="Upload profile photo" /><label>Full name<div className="input-with-icon"><UserRound size={18} /><input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></div></label><label>Email address<div className="input-with-icon"><Mail size={18} /><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label><label>Password<div className="input-with-icon"><LockKeyhole size={18} /><input type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a strong password" /><button type="button" onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><div className="password-rules"><span className={passwordState.length ? "valid" : ""}>6+ characters</span><span className={passwordState.upper ? "valid" : ""}>Uppercase letter</span><span className={passwordState.lower ? "valid" : ""}>Lowercase letter</span></div><button className="button button-primary button-block" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button></form>
    <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p></div></div></section>;
}
