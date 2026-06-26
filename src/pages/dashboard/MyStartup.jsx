import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Building2, Save, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import PageHeader from "../../components/PageHeader";
import ImageUploader from "../../components/ImageUploader";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";

const blank = { startup_name: "", logo: "", industry: "", description: "", funding_stage: "Bootstrapped", team_size_needed: 1 };

export default function MyStartup() {
  const client = useQueryClient(); const [form, setForm] = useState(blank); const [saving, setSaving] = useState(false);
  const { data: startup, isLoading } = useQuery({ queryKey: ["my-startup"], queryFn: () => api.get("/founder/startup").then((r) => r.data.data) });
  useEffect(() => { if (startup) setForm({ startup_name: startup.startup_name, logo: startup.logo, industry: startup.industry, description: startup.description, funding_stage: startup.funding_stage, team_size_needed: startup.team_size_needed }); }, [startup]);
  if (isLoading) return <Loader />;
  const submit = async (event) => { event.preventDefault(); if (!form.logo) return toast.error("Upload a startup logo"); setSaving(true); try { if (startup) await api.patch(`/founder/startup/${startup._id}`, form); else await api.post("/founder/startup", form); await client.invalidateQueries({ queryKey: ["my-startup"] }); toast.success(startup ? "Startup updated" : "Startup created"); } catch (error) { toast.error(getErrorMessage(error)); } finally { setSaving(false); } };
  const remove = async () => { if (!confirm("Delete this startup and every related opportunity/application?")) return; try { await api.delete(`/founder/startup/${startup._id}`); setForm(blank); await client.invalidateQueries({ queryKey: ["my-startup"] }); toast.success("Startup deleted"); } catch (error) { toast.error(getErrorMessage(error)); } };
  return <><PageHeader eyebrow="Founder workspace" title={startup ? "Manage your startup" : "Create your startup profile"} description="This is the public company story collaborators will use to decide whether your mission fits them." action={startup && <StatusBadge status={startup.status} />} /><form className="entity-form surface-card" onSubmit={submit}><div className="entity-form-media"><ImageUploader value={form.logo} onChange={(logo) => setForm({ ...form, logo })} label="Upload startup logo" /><div><Building2 size={25} /><p>Use a clean square logo. It will appear on cards, opportunity pages, and applications.</p></div></div><div className="form-grid"><label>Startup name<input required minLength={2} value={form.startup_name} onChange={(e) => setForm({ ...form, startup_name: e.target.value })} /></label><label>Industry<input required value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Artificial Intelligence" /></label><label>Funding stage<select value={form.funding_stage} onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}>{["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B+", "Not disclosed"].map((v) => <option key={v}>{v}</option>)}</select></label><label>Team size needed<input type="number" min="1" max="100" required value={form.team_size_needed} onChange={(e) => setForm({ ...form, team_size_needed: e.target.value })} /></label><label className="full-span">Description<textarea rows="8" required minLength={50} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Explain the problem, your solution, current stage, and the kind of team you want to build." /></label><div className="form-actions full-span"><button className="button button-primary" disabled={saving}><Save size={18} /> {saving ? "Saving..." : startup ? "Update startup" : "Create startup"}</button>{startup && <button type="button" className="button button-danger" onClick={remove}><Trash2 size={18} /> Delete startup</button>}</div></div></form></>;
}
