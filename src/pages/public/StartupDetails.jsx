import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Layers3, Mail, Users } from "lucide-react";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";
import OpportunityCard from "../../components/OpportunityCard";
import EmptyState from "../../components/EmptyState";

export default function StartupDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["startup", id],
    queryFn: () => api.get(`/public/startups/${id}`).then((res) => res.data.data)
  });
  if (isLoading) return <Loader fullPage />;
  const startup = data.startup;
  return <section className="section-pad page-section"><div className="container">
    <Link className="back-link" to="/startups"><ArrowLeft size={17} /> Back to startups</Link>
    <div className="detail-hero surface-card">
      <img className="detail-logo" src={startup.logo} alt={`${startup.startup_name} logo`} />
      <div className="detail-main"><span className="eyebrow">{startup.industry}</span><h1>{startup.startup_name}</h1><p>{startup.description}</p><div className="detail-meta"><span><Users size={18} /> Needs {startup.team_size_needed} teammates</span><span><Layers3 size={18} /> {startup.funding_stage}</span><span><Mail size={18} /> {startup.founder_name}</span></div></div>
    </div>
    <div className="section-heading compact"><div><span className="eyebrow">Join the mission</span><h2>Open opportunities</h2></div><span className="pill"><BriefcaseBusiness size={15} /> {data.opportunities.length} roles</span></div>
    {data.opportunities.length ? <div className="card-grid card-grid-3">{data.opportunities.map((item) => <OpportunityCard key={item._id} opportunity={item} />)}</div> : <EmptyState title="No open roles yet" description="This startup has not published an opportunity." />}
  </div></section>;
}
