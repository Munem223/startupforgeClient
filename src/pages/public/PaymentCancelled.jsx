import { CreditCard, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
export default function PaymentCancelled() { return <section className="payment-result"><div className="surface-card"><CreditCard size={58} /><span className="eyebrow">Checkout cancelled</span><h1>No payment was made.</h1><p>Your account remains unchanged. You can return whenever you are ready to unlock unlimited founder opportunities.</p><Link className="button button-primary" to="/dashboard"><LayoutDashboard size={18} /> Return to dashboard</Link></div></section>; }
