import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import OpportunityCard from "../../components/OpportunityCard";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { api } from "../../lib/api";
import { useDebounce } from "../../hooks/useDebounce";

export default function BrowseOpportunities() {
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("");
  const [industry, setIndustry] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);
  const { data, isLoading } = useQuery({
    queryKey: ["opportunities", debounced, workType, industry, page],
    queryFn: () => api.get("/public/opportunities", { params: { search: debounced, workType, industry, page, limit: 9 } }).then((res) => res.data.data)
  });

  const reset = () => { setSearch(""); setWorkType(""); setIndustry(""); setPage(1); };

  return (
    <section className="section-pad page-section">
      <div className="container">
        <PageHeader eyebrow="Make an impact" title="Browse startup opportunities" description="Search by role title or skill, then filter by work style and industry. Pagination is handled securely on the server." />
        <div className="opportunity-filters surface-card">
          <label className="search-field"><Search size={19} /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search roles or skills, e.g. React" /></label>
          <label><Filter size={17} /><select value={workType} onChange={(e) => { setWorkType(e.target.value); setPage(1); }}><option value="">All work types</option>{data?.filters.workTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><select value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }}><option value="">All industries</option>{data?.filters.industries.map((item) => <option key={item}>{item}</option>)}</select></label>
          {(search || workType || industry) && <button className="button button-ghost button-sm" onClick={reset}><X size={16} /> Reset</button>}
        </div>
        <div className="results-summary"><strong>{data?.pagination.total ?? 0}</strong> opportunities found</div>
        {isLoading ? <Loader /> : data?.items.length ? <>
          <div className="card-grid card-grid-3">{data.items.map((item) => <OpportunityCard key={item._id} opportunity={item} />)}</div>
          <div className="pagination"><button disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button disabled={page >= data.pagination.totalPages} onClick={() => setPage((v) => v + 1)}>Next</button></div>
        </> : <EmptyState title="No opportunities matched" description="Change the search or clear a filter to see more roles." />}
      </div>
    </section>
  );
}
