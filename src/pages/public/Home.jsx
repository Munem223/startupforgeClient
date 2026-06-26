import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Blocks, BriefcaseBusiness, CheckCircle2, Code2,
  Globe2, Lightbulb, Rocket, ShieldCheck, Sparkles, UsersRound
} from "lucide-react";
import { api } from "../../lib/api";
import Loader from "../../components/Loader";
import StartupCard from "../../components/StartupCard";
import OpportunityCard from "../../components/OpportunityCard";

const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Home() {
  const { data: startups, isLoading: startupsLoading } = useQuery({
    queryKey: ["featured-startups"],
    queryFn: () => api.get("/public/startups/featured").then((res) => res.data.data)
  });
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["featured-opportunities"],
    queryFn: () => api.get("/public/opportunities/featured").then((res) => res.data.data)
  });
  const { data: stats } = useQuery({
    queryKey: ["public-stats"],
    queryFn: () => api.get("/public/stats").then((res) => res.data.data)
  });

  return (
    <>
      <section className="hero-section section-pad">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="container hero-grid">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> Where ideas find their people</span>
            <h1>Build the startup you <span>cannot stop thinking about.</span></h1>
            <p>StartupForge brings founders, engineers, designers, and growth minds into one focused place to discover ideas, form teams, and build what matters.</p>
            <div className="hero-actions">
              <Link className="button button-primary button-lg" to="/register">Start building <ArrowRight size={19} /></Link>
              <Link className="button button-secondary button-lg" to="/opportunities">Explore opportunities</Link>
            </div>
            <div className="hero-trust"><span><CheckCircle2 size={16} /> Founder-led teams</span><span><CheckCircle2 size={16} /> Global talent</span><span><CheckCircle2 size={16} /> Real opportunities</span></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="hero-visual">
            <div className="hero-dashboard-card">
              <div className="mock-window-bar"><i /><i /><i /><span>startupforge / team-builder</span></div>
              <div className="mock-card-head"><div><small>Team momentum</small><strong>NovaGrid AI</strong></div><span className="live-dot">Live</span></div>
              <div className="mock-progress"><span style={{ width: "76%" }} /></div>
              <div className="mock-stats"><div><strong>12</strong><span>Applicants</span></div><div><strong>4</strong><span>Open roles</span></div><div><strong>3</strong><span>Matches</span></div></div>
              <div className="mock-team">
                <div className="mock-avatar">MR</div><div className="mock-avatar">AK</div><div className="mock-avatar">SL</div><div className="mock-avatar add">+5</div>
                <div><strong>Your future team</strong><span>is already looking for you</span></div>
              </div>
            </div>
            <div className="floating-card floating-role"><Code2 size={19} /><div><small>New role</small><strong>Frontend Engineer</strong></div></div>
            <div className="floating-card floating-match"><BadgeCheck size={20} /><div><small>Skill match</small><strong>92% fit</strong></div></div>
          </motion.div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-strip-grid">
          <div><strong>{stats?.startups ?? 0}+</strong><span>Approved startups</span></div>
          <div><strong>{stats?.opportunities ?? 0}+</strong><span>Open opportunities</span></div>
          <div><strong>{stats?.members ?? 0}+</strong><span>Community members</span></div>
          <div><strong>{stats?.successfulMatches ?? 0}+</strong><span>Successful matches</span></div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Fresh from the forge</span><h2>Startups building the next chapter</h2><p>Meet ambitious teams looking for the right people to grow with them.</p></div><Link to="/startups" className="text-link">View all startups <ArrowRight size={17} /></Link></div>
          {startupsLoading ? <Loader /> : <div className="card-grid card-grid-3">{startups?.map((startup) => <StartupCard key={startup._id} startup={startup} />)}</div>}
        </div>
      </section>

      <section className="section-pad section-tinted">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Find your place</span><h2>Opportunities worth showing up for</h2><p>Contribute your craft to teams where your work can shape the entire product.</p></div><Link to="/opportunities" className="text-link">Browse every role <ArrowRight size={17} /></Link></div>
          {opportunitiesLoading ? <Loader /> : <div className="card-grid card-grid-3">{opportunities?.map((item) => <OpportunityCard key={item._id} opportunity={item} />)}</div>}
        </div>
      </section>

      <section className="section-pad">
        <div className="container why-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
            <span className="eyebrow">Why StartupForge</span><h2>Less networking noise. More building momentum.</h2><p>Everything is designed around one outcome: helping committed people find each other and move from idea to action.</p>
            <Link className="button button-secondary" to="/register">Join the community <ArrowRight size={17} /></Link>
          </motion.div>
          <div className="feature-stack">
            {[
              [Lightbulb, "Ideas with context", "Understand the mission, stage, team needs, and working style before you apply."],
              [UsersRound, "Teams built intentionally", "Founders review structured applications and collaborators track every decision."],
              [ShieldCheck, "A moderated ecosystem", "Admin approval and platform controls keep opportunities useful and trustworthy."],
              [Globe2, "Built for global talent", "Remote, hybrid, and on-site roles help great collaborators contribute from anywhere."]
            ].map(([Icon, title, text], index) => (
              <motion.article key={title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="feature-row">
                <span><Icon size={22} /></span><div><h3>{title}</h3><p>{text}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-tinted">
        <div className="container">
          <div className="section-heading centered"><div><span className="eyebrow">Built together</span><h2>Small teams. Real outcomes.</h2><p>Community stories that show what happens when the right people meet at the right moment.</p></div></div>
          <div className="story-grid">
            {[
              [Rocket, "From pitch deck to pilot", "A climate founder met two engineers and launched a working pilot in eight weeks.", "GreenLoop team"],
              [Blocks, "A designer became co-builder", "One product critique became a long-term partnership and a completely stronger onboarding flow.", "CareBridge team"],
              [BriefcaseBusiness, "First startup role", "A junior marketer built a real growth portfolio while helping an early-stage team find its first users.", "SkillSpring team"]
            ].map(([Icon, title, text, author]) => (
              <article className="story-card surface-card" key={title}><Icon size={25} /><h3>{title}</h3><p>“{text}”</p><span>{author}</span></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container cta-panel">
          <div><span className="eyebrow">Your next chapter can start today</span><h2>Bring the idea. Bring the skill. Build the team.</h2><p>Create your profile and start meaningful conversations with people ready to make something real.</p></div>
          <Link className="button button-primary button-lg" to="/register">Create free account <ArrowRight size={19} /></Link>
        </div>
      </section>
    </>
  );
}
