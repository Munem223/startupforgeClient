import { ArrowUpRight, Layers3, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function StartupCard({ startup }) {
  return (
    <article className="startup-card surface-card">
      <div className="startup-card-top">
        <img src={startup.logo} alt={`${startup.startup_name} logo`} />
        <span className="pill">{startup.industry}</span>
      </div>
      <div className="startup-card-body">
        <h3>{startup.startup_name}</h3>
        <p className="muted">Founded by {startup.founder_name}</p>
        <p className="line-clamp-3">{startup.description}</p>
        <div className="mini-meta">
          <span><Users size={16} /> {startup.team_size_needed} roles</span>
          <span><Layers3 size={16} /> {startup.funding_stage}</span>
        </div>
      </div>
      <Link className="card-link" to={`/startups/${startup._id}`}>Explore startup <ArrowUpRight size={17} /></Link>
    </article>
  );
}
