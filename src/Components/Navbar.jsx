import "../Styles/Navbar.css";

export default function Navbar({ children }) {
  return (
    <nav>
      <Logo />
      {children}
    </nav>
  );
}

/// components of nav bar

export function Logo() {
  return (
    <div>
      <div className="logo">
        <span rol="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </div>
  );
}

export function Search({ quary, setQuary }) {
  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search movies..."
        value={quary}
        onChange={(e) => setQuary(e.target.value)}
      />
    </div>
  );
}

export function NumResult({ movies }) {
  return (
    <div>
      <p className="num-results">
        Found <strong>{movies.length}</strong> Results
      </p>
    </div>
  );
}
