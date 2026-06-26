import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, MapPin, Send } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";

export default function OpportunityDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ portfolio_link: "", motivation: "" });
  const navigate = useNavigate(); const location = useLocation();
  const { data: opportunity, isLoading } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => api.get(`/public/opportunities/${id}`).then((res) => res.data.data)
  });
  if (isLoading) return <Loader fullPage />;

  const apply = () => {
    if (!isAuthenticated) return navigate("/login", { state: { from: location.pathname } });
    if (user.role !== "collaborator") return toast.error("Only collaborator accounts can apply");
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true);
    try {
      await api.post(`/collaborator/opportunities/${id}/apply`, form);
      toast.success("Application submitted successfully"); setOpen(false); setForm({ portfolio_link: "", motivation: "" });
    } catch (error) { toast.error(getErrorMessage(error)); } finally { setSubmitting(false); }
  };

  return <section className="section-pad page-section"><div className="container detail-narrow">
    <Link className="back-link" to="/opportunities"><ArrowLeft size={17} /> Back to opportunities</Link>
    <article className="job-detail surface-card">
      <div className="job-detail-company"><img src={opportunity.startup_logo} alt="" /><div><span>{opportunity.industry}</span><strong>{opportunity.startup_name}</strong></div></div>
      <h1>{opportunity.role_title}</h1>
      <div className="detail-meta"><span><MapPin size={18} /> {opportunity.work_type}</span><span><BriefcaseBusiness size={18} /> {opportunity.commitment_level}</span><span><CalendarDays size={18} /> Apply by {formatDate(opportunity.deadline)}</span></div>
      <div className="job-detail-grid"><div><h2>About the opportunity</h2><p>{opportunity.description}</p><h2>Required skills</h2><div className="skill-row large">{opportunity.required_skills.map((skill) => <span key={skill}><CheckCircle2 size={14} /> {skill}</span>)}</div></div><aside className="apply-panel"><span className="eyebrow">Ready to contribute?</span><h3>Put your work in front of the founding team.</h3><p>Share your strongest portfolio link and explain why this mission fits you.</p><button className="button button-primary button-block" onClick={apply}><Send size={18} /> Apply now</button></aside></div>
    </article>
    <Modal open={open} onClose={() => setOpen(false)} title={`Apply for ${opportunity.role_title}`}>
      <form onSubmit={submit} className="form-stack"><label>Portfolio link<input type="url" required value={form.portfolio_link} onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })} placeholder="https://yourportfolio.com" /></label><label>Motivation message<textarea required minLength={80} rows="7" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} placeholder="Explain what excites you about this startup and how you can contribute..." /></label><button disabled={submitting} className="button button-primary button-block">{submitting ? "Submitting..." : "Submit application"}</button></form>
    </Modal>
  </div></section>;
}
