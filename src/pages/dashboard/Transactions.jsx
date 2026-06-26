import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";

export default function Transactions() {
  const { data = [], isLoading } = useQuery({ queryKey: ["transactions"], queryFn: () => api.get("/admin/transactions").then((r) => r.data.data) });
  if (isLoading) return <Loader />;
  return <><PageHeader eyebrow="Financial records" title="Stripe transactions" description="Review premium founder payments saved from verified Stripe Checkout sessions and webhooks." />{data.length ? <div className="table-card surface-card"><div className="responsive-table"><table><thead><tr><th>User</th><th>Amount</th><th>Transaction</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.map((item) => <tr key={item._id}><td>{item.user_email}</td><td><strong>{formatCurrency(item.amount, item.currency?.toUpperCase())}</strong></td><td><code>{item.transaction_id}</code></td><td>{formatDate(item.paid_at, { hour: "2-digit", minute: "2-digit" })}</td><td><StatusBadge status={item.payment_status} /></td></tr>)}</tbody></table></div></div> : <EmptyState title="No transactions yet" description="Verified Stripe payments will appear here." />}</>;
}
