import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, ExternalLink, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";

export default function AdminStartups() {
  const client = useQueryClient(); const { data = [], isLoading } = useQuery({ queryKey: ["admin-startups"], queryFn: () => api.get("/admin/startups").then((r) => r.data.data) });
  const setStatus = async (id, status) => { try { await api.patch(`/admin/startups/${id}/status`, { status }); await client.invalidateQueries({ queryKey: ["admin-startups"] }); toast.success(`Startup ${status}`); } catch (error) { toast.error(getErrorMessage(error)); } };
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Content moderation" title="Manage startups" description="Approve founder submissions or remove companies that should no longer appear publicly." /><div className="table-card surface-card"><div className="responsive-table"><table><thead><tr><th>Startup</th><th>Founder</th><th>Industry</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.map((item) => <tr key={item._id}><td><div className="table-company"><img src={item.logo} alt="" /><strong>{item.startup_name}</strong></div></td><td><strong>{item.founder_name}</strong><small>{item.founder_email}</small></td><td>{item.industry}</td><td>{formatDate(item.createdAt)}</td><td><StatusBadge status={item.status} /></td><td><div className="table-actions">{item.status === "approved" && <a className="icon-button" href={`/startups/${item._id}`} target="_blank" rel="noreferrer"><ExternalLink size={17} /></a>}<button className="icon-button success" onClick={() => setStatus(item._id, "approved")}><Check size={17} /></button><button className="icon-button danger" onClick={() => setStatus(item._id, "removed")}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div></div></>;
}
