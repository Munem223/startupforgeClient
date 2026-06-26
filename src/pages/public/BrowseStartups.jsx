import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StartupCard from "../../components/StartupCard";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { api } from "../../lib/api";
import { useDebounce } from "../../hooks/useDebounce";

export default function BrowseStartups() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);
  const { data, isLoading } = useQuery({
    queryKey: ["startups", debounced, page],
    queryFn: () => api.get("/public/startups", { params: { search: debounced, page, limit: 9 } }).then((res) => res.data.data)
  });

  return (
    <section className="section-pad page-section">
      <div className="container">
        <PageHeader eyebrow="Discover teams" title="Browse startup ideas" description="Explore approved startups, learn what they are building, and find a mission you want to help move forward." />
        <div className="browse-toolbar"><label className="search-field"><Search size={19} /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by startup, founder, or industry" /></label><span>{data?.pagination.total ?? 0} startups</span></div>
        {isLoading ? <Loader /> : data?.items.length ? <>
          <div className="card-grid card-grid-3">{data.items.map((startup) => <StartupCard key={startup._id} startup={startup} />)}</div>
          <div className="pagination"><button disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button disabled={page >= data.pagination.totalPages} onClick={() => setPage((v) => v + 1)}>Next</button></div>
        </> : <EmptyState title="No startups matched" description="Try a broader search phrase." />}
      </div>
    </section>
  );
}
