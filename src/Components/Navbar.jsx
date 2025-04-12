import { useEffect, useRef } from "react";
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
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuary("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setQuary]
  );

  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);
  return (
    <div>
      <input
        type="text"
        className="search"
        placeholder="Search movies..."
        value={quary}
        onChange={(e) => setQuary(e.target.value)}
        ref={inputEl}
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
