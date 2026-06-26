export default function Loader({ fullPage = false, label = "Loading" }) {
  return (
    <div className={fullPage ? "loader-page" : "loader-inline"} role="status" aria-live="polite">
      <div className="forge-loader"><span /><span /><span /></div>
      <p>{label}...</p>
    </div>
  );
}
