import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

export default function MyApplications() {
  const { data = [], isLoading } = useQuery({ queryKey: ["my-applications"], queryFn: () => api.get("/collaborator/applications").then((r) => r.data.data) });
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Your journey" title="Track my applications" description="Follow every application from pending review to the founder's final decision." />{data.length ? <div className="table-card surface-card"><div className="responsive-table"><table><thead><tr><th>Opportunity</th><th>Startup</th><th>Applied</th><th>Status</th><th>Portfolio</th></tr></thead><tbody>{data.map((item) => <tr key={item._id}><td><strong>{item.opportunity_name}</strong></td><td><div className="table-company"><img src={item.startup_logo} alt="" />{item.startup_name}</div></td><td>{formatDate(item.applied_at)}</td><td><StatusBadge status={item.status} /></td><td><a className="icon-button" href={item.portfolio_link} target="_blank" rel="noreferrer"><ExternalLink size={17} /></a></td></tr>)}</tbody></table></div></div> : <EmptyState title="You have not applied yet" description="Explore startup roles and submit a thoughtful application." action={<Link className="button button-primary" to="/opportunities">Browse opportunities</Link>} />}</>;
}
