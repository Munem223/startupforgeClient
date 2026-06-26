import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import ImageUploader from "../../components/ImageUploader";
import { useAuth } from "../../context/AuthContext";
import { api, getErrorMessage } from "../../lib/api";

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", skills: "", bio: "" });
  useEffect(() => setForm({ name: user.name || "", image: user.image || "", skills: user.skills || "", bio: user.bio || "" }), [user]);
  const submit = async (event) => { event.preventDefault(); setLoading(true); try { await api.patch("/users/me", form); await refreshProfile(); toast.success("Profile updated"); } catch (error) { toast.error(getErrorMessage(error)); } finally { setLoading(false); } };
  return <><PageHeader eyebrow="Personal profile" title="Make your profile memorable" description="A clear identity and specific skills help the right founders or collaborators understand your value quickly." /><form onSubmit={submit} className="profile-form surface-card"><div className="profile-form-aside"><ImageUploader value={form.image} onChange={(image) => setForm({ ...form, image })} label="Change profile photo" /><div><strong>{user.email}</strong><span className="pill">{user.role}</span>{user.isPremium && <span className="pill premium-pill">Premium founder</span>}</div></div><div className="form-stack"><label>Full name<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Skills <small>Separate skills with commas</small><input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Product Design, SEO" /></label><label>Professional bio<textarea rows="7" maxLength={700} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Describe what you do, what you care about, and the kind of startup work you want." /></label><button className="button button-primary" disabled={loading}><Save size={18} /> {loading ? "Saving..." : "Save profile"}</button></div></form></>;
}
