import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Where ambitious founders meet the people who can help turn bold ideas into real companies.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={19} /></a>
          </div>
        </div>
        <div><h4>Explore</h4><Link to="/startups">Startups</Link><Link to="/opportunities">Opportunities</Link><Link to="/register">Create account</Link></div>
        <div><h4>Platform</h4><Link to="/dashboard">Dashboard</Link><Link to="/login">Founder login</Link><Link to="/login">Collaborator login</Link></div>
        <div><h4>Contact</h4><p className="footer-contact"><Mail size={17} /> hello@startupforge.dev</p><p className="footer-contact"><MapPin size={17} /> Global startup community</p></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} StartupForge. All rights reserved.</span><span>Built for people who build.</span></div>
    </footer>
  );
}
