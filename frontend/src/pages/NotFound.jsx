import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="page-shell">
      <div className="card state-card">
        <p className="eyebrow">404</p>
        <h1 className="title-xl">Page not found</h1>
        <p className="text-muted">The page you requested does not exist or may have moved.</p>
        <Link className="btn btn-primary" to="/marketplace">Browse marketplace</Link>
      </div>
    </section>
  );
}

export default NotFound;
