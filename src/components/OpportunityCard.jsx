import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/format";

export default function OpportunityCard({ opportunity }) {
  return (
    <article className="opportunity-card surface-card">
      <div className="opportunity-company">
        <img src={opportunity.startup_logo} alt="" />
        <div><span>{opportunity.startup_name}</span><small>{opportunity.industry}</small></div>
      </div>
      <h3>{opportunity.role_title}</h3>
      <div className="skill-row">
        {opportunity.required_skills?.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <div className="opportunity-meta">
        <span><MapPin size={16} /> {opportunity.work_type}</span>
        <span><BriefcaseBusiness size={16} /> {opportunity.commitment_level}</span>
        <span><CalendarDays size={16} /> {formatDate(opportunity.deadline)}</span>
      </div>
      <Link className="card-link" to={`/opportunities/${opportunity._id}`}>View opportunity <ArrowUpRight size={17} /></Link>
    </article>
  );
}
