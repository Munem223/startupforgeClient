import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreditCard, Edit3, ExternalLink, PlusCircle, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";

export default function ManageOpportunities() {
  const { user } = useAuth(); const location = useLocation(); const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); const [saving, setSaving] = useState(false); const [checkout, setCheckout] = useState(false);
  const { data = [], isLoading } = useQuery({ queryKey: ["my-opportunities"], queryFn: () => api.get("/founder/opportunities").then((r) => r.data.data) });
  useEffect(() => { if (location.state?.premiumRequired) toast("Upgrade to publish more than three opportunities", { icon: "⭐" }); }, [location.state]);
  const remove = async (id) => { if (!confirm("Delete this opportunity and its applications?")) return; try { await api.delete(`/founder/opportunities/${id}`); await queryClient.invalidateQueries({ queryKey: ["my-opportunities"] }); toast.success("Opportunity deleted"); } catch (error) { toast.error(getErrorMessage(error)); } };
  const save = async (event) => { event.preventDefault(); setSaving(true); try { await api.patch(`/founder/opportunities/${editing._id}`, editing); await queryClient.invalidateQueries({ queryKey: ["my-opportunities"] }); toast.success("Opportunity updated"); setEditing(null); } catch (error) { toast.error(getErrorMessage(error)); } finally { setSaving(false); } };
  const upgrade = async () => { setCheckout(true); try { const response = await api.post("/payments/checkout"); window.location.assign(response.data.data.url); } catch (error) { toast.error(getErrorMessage(error)); setCheckout(false); } };
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Founder workspace" title="Manage opportunities" description="Edit role details, remove closed positions, or unlock unlimited publishing with Stripe Checkout." action={<a className="button button-primary button-sm" href="/dashboard/add-opportunity"><PlusCircle size={17} /> Add role</a>} />
    {!user.isPremium && <div className="premium-banner"><div><span>Premium founder</span><h3>Publish beyond your first three opportunities.</h3><p>One secure payment unlocks unlimited roles for one year.</p></div><button className="button button-primary" disabled={checkout} onClick={upgrade}><CreditCard size={18} /> {checkout ? "Opening Stripe..." : "Upgrade now"}</button></div>}
    {data.length ? <div className="table-card surface-card"><div className="responsive-table"><table><thead><tr><th>Role</th><th>Work type</th><th>Commitment</th><th>Deadline</th><th>Actions</th></tr></thead><tbody>{data.map((item) => <tr key={item._id}><td><strong>{item.role_title}</strong><small>{item.required_skills.join(", ")}</small></td><td>{item.work_type}</td><td>{item.commitment_level}</td><td>{formatDate(item.deadline)}</td><td><div className="table-actions"><a className="icon-button" href={`/opportunities/${item._id}`} target="_blank" rel="noreferrer" title="View"><ExternalLink size={17} /></a><button className="icon-button" onClick={() => setEditing({ ...item, required_skills: item.required_skills.join(", ") })} title="Edit"><Edit3 size={17} /></button><button className="icon-button danger" onClick={() => remove(item._id)} title="Delete"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div></div> : <EmptyState title="No opportunities published" description="Create your first role to start recruiting collaborators." action={<a className="button button-primary" href="/dashboard/add-opportunity">Add opportunity</a>} />}
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit opportunity" size="lg">{editing && <form className="form-grid" onSubmit={save}><label>Role title<input required value={editing.role_title} onChange={(e) => setEditing({ ...editing, role_title: e.target.value })} /></label><label>Required skills<input required value={editing.required_skills} onChange={(e) => setEditing({ ...editing, required_skills: e.target.value })} /></label><label>Work type<select value={editing.work_type} onChange={(e) => setEditing({ ...editing, work_type: e.target.value })}>{["Remote", "Hybrid", "On-site"].map((v) => <option key={v}>{v}</option>)}</select></label><label>Commitment<select value={editing.commitment_level} onChange={(e) => setEditing({ ...editing, commitment_level: e.target.value })}>{["Part-time", "Full-time", "Project-based", "Flexible"].map((v) => <option key={v}>{v}</option>)}</select></label><label>Deadline<input type="date" required value={editing.deadline} onChange={(e) => setEditing({ ...editing, deadline: e.target.value })} /></label><label className="full-span">Description<textarea rows="7" required value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label><button className="button button-primary full-span" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></form>}</Modal>
  </>;
}
