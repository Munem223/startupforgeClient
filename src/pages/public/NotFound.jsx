import { ArrowLeft, Home, Orbit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return <section className="not-found"><div className="not-found-art"><Orbit size={84} /><span>4</span><div className="planet" /><span>4</span></div><span className="eyebrow">Lost in the idea universe</span><h1>This route has not been forged yet.</h1><p>The page may have moved, been removed, or never existed. Let’s get you back to something useful.</p><div><button className="button button-secondary" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Go back</button><Link className="button button-primary" to="/"><Home size={18} /> Back home</Link></div></section>;
}
