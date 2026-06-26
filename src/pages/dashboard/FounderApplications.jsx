import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, ExternalLink, X } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";

export default function FounderApplications() {
  const client = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["founder-applications"], queryFn: () => api.get("/founder/applications").then((r) => r.data.data) });
  const update = async (id, status) => { try { await api.patch(`/founder/applications/${id}/status`, { status }); await client.invalidateQueries({ queryKey: ["founder-applications"] }); await client.invalidateQueries({ queryKey: ["founder-overview"] }); toast.success(`Application ${status}`); } catch (error) { toast.error(getErrorMessage(error)); } };
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Hiring pipeline" title="Review applications" description="Read every motivation carefully, inspect the portfolio, and make a clear accepted or rejected decision." />{data.length ? <div className="application-list">{data.map((item) => <article className="application-card surface-card" key={item._id}><div className="application-person"><Avatar user={{ name: item.applicant_name, image: item.applicant_image }} /><div><h3>{item.applicant_name}</h3><span>{item.applicant_email}</span></div><StatusBadge status={item.status} /></div><div className="application-context"><strong>{item.opportunity_name}</strong><span>Applied {formatDate(item.applied_at)}</span></div><p>{item.motivation}</p><div className="application-actions"><a className="button button-ghost button-sm" href={item.portfolio_link} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Portfolio</a><button className="button button-success button-sm" onClick={() => update(item._id, "accepted")}><Check size={17} /> Accept</button><button className="button button-danger button-sm" onClick={() => update(item._id, "rejected")}><X size={17} /> Reject</button></div></article>)}</div> : <EmptyState title="No applications yet" description="Applications to your opportunities will appear here." />}</>;
}
