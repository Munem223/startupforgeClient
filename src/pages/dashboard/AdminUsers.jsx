import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Ban, ShieldCheck } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import Avatar from "../../components/Avatar";
import StatusBadge from "../../components/StatusBadge";

export default function AdminUsers() {
  const client = useQueryClient(); const { data = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => api.get("/admin/users").then((r) => r.data.data) });
  const toggle = async (user) => { try { await api.patch(`/admin/users/${user.id}/block`, { isBlocked: !user.isBlocked }); await client.invalidateQueries({ queryKey: ["admin-users"] }); toast.success(user.isBlocked ? "User unblocked" : "User blocked"); } catch (error) { toast.error(getErrorMessage(error)); } };
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Platform moderation" title="Manage users" description="View every account and block or restore access. Blocking also invalidates active sessions." /><div className="table-card surface-card"><div className="responsive-table"><table><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Account</th><th>Action</th></tr></thead><tbody>{data.map((user) => <tr key={user._id}><td><div className="table-user"><Avatar user={user} size="sm" /><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td><span className="pill">{user.role}</span></td><td>{formatDate(user.createdAt)}</td><td>{user.isBlocked ? <StatusBadge status="blocked" /> : <StatusBadge status="active" />}</td><td><button className={`button button-sm ${user.isBlocked ? "button-success" : "button-danger"}`} onClick={() => toggle(user)}>{user.isBlocked ? <ShieldCheck size={16} /> : <Ban size={16} />}{user.isBlocked ? "Unblock" : "Block"}</button></td></tr>)}</tbody></table></div></div></>;
}
