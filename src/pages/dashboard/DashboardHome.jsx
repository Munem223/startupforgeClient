import { useQuery } from "@tanstack/react-query";
import { BarChart3, BriefcaseBusiness, CheckCircle2, Clock3, DollarSign, FileUser, Rocket, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";

function FounderOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["founder-overview"], queryFn: () => api.get("/founder/overview").then((r) => r.data.data) });
  if (isLoading) return <Loader />;
  return <><div className="stats-grid"><StatCard icon={BriefcaseBusiness} label="Total opportunities" value={data.totals.opportunities} /><StatCard icon={FileUser} label="Total applications" value={data.totals.applications} /><StatCard icon={CheckCircle2} label="Accepted members" value={data.totals.acceptedMembers} /></div><div className="dashboard-grid-2"><Chart title="Application pipeline" data={data.statusBreakdown} type="bar" /><div className="surface-card insight-card"><Rocket size={28} /><h3>{data.startup ? data.startup.startup_name : "Create your startup profile"}</h3><p>{data.startup ? `Current review status: ${data.startup.status}. Keep your company story and open roles current.` : "Before publishing an opportunity, create the startup profile collaborators will explore."}</p></div></div></>;
}

function CollaboratorOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["collaborator-overview"], queryFn: () => api.get("/collaborator/overview").then((r) => r.data.data) });
  if (isLoading) return <Loader />;
  return <><div className="stats-grid stats-grid-4"><StatCard icon={FileUser} label="Applications" value={data.totals.applications} /><StatCard icon={Clock3} label="Pending" value={data.totals.pending} /><StatCard icon={CheckCircle2} label="Accepted" value={data.totals.accepted} /><StatCard icon={BarChart3} label="Rejected" value={data.totals.rejected} /></div><Chart title="Application outcomes" data={data.chart} type="pie" /></>;
}

function AdminOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: () => api.get("/admin/overview").then((r) => r.data.data) });
  if (isLoading) return <Loader />;
  return <><div className="stats-grid stats-grid-4"><StatCard icon={Users} label="Total users" value={data.totals.users} /><StatCard icon={Rocket} label="Total startups" value={data.totals.startups} /><StatCard icon={BriefcaseBusiness} label="Opportunities" value={data.totals.opportunities} /><StatCard icon={DollarSign} label="Revenue" value={`$${data.totals.revenue.toFixed(2)}`} /></div><div className="dashboard-grid-2"><Chart title="Users by role" data={data.roleStats} type="pie" /><Chart title="Monthly revenue" data={data.monthlyPayments} type="bar" /></div></>;
}

function Chart({ title, data = [], type }) {
  return <article className="surface-card chart-card"><h3>{title}</h3><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%">{type === "pie" ? <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>{data.map((_, index) => <Cell key={index} className={`chart-cell chart-cell-${index % 4}`} />)}</Pie><Tooltip /></PieChart> : <BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" radius={[8, 8, 0, 0]} /></BarChart>}</ResponsiveContainer></div></article>;
}

export default function DashboardHome() {
  const { user } = useAuth();
  return <><PageHeader eyebrow={`${user.role} dashboard`} title={`Good to see you, ${user.name.split(" ")[0]}.`} description="Here is the clearest view of what is happening in your StartupForge workspace." />{user.role === "founder" && <FounderOverview />}{user.role === "collaborator" && <CollaboratorOverview />}{user.role === "admin" && <AdminOverview />}</>;
}
