import "../Styles/main.css";
import { useState } from "react";

export default function Main({ children }) {
  return <main className="main">{children}</main>;
}

export function ListBox({ children, onHandleShowMovies, showMovies }) {
  return (
    <div className="box">
      <button className="btn-toggle" onClick={onHandleShowMovies}>
        {showMovies ? "-" : "+"}
      </button>
      {children}
    </div>
  );
}

export function WatchedBox({ children }) {
  const [shown, setShown] = useState(true);

  function handlShown() {
    setShown(() => !shown);
  }

  return (
    <div className="box">
      <button className="btn-toggle" onClick={handlShown}>
        {shown ? "-" : "+"}
      </button>
      {shown && <>{children}</>}
    </div>
  );
}

export function MoviesList({ isOpen, movies, onHandleSelection }) {
  return (
    <>
      {isOpen && (
        <ul className="list">
          {movies.map((movie) => (
            <Movie
              movie={movie}
              key={movie.imdbID}
              onHandleSelection={onHandleSelection}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function Movie({ movie, onHandleSelection }) {
  return (
    <li
      onClick={() => onHandleSelection(movie.imdbID)}
      style={{ cursor: "pointer" }}
    >
      <img src={movie.Poster} alt={`${movie.Title}`} />

      <div>
        <h3>{movie.Title}</h3>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export function WatchedSummary({ movies }) {
  return (
    <div className="summary__header">
      <h2>Movies you watched</h2>
      <div className="m__info">
        <p>
          <span>🛋 </span>
          <span>{movies.length} movies</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movies.imdbRating}</span>
        </p>
        <p>
          <span>⏰</span>
          <span>{movies.runtime}</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMoviesList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title}`} />

      <div>
        <h3>{movie.title}</h3>
        <div className="movie-info">
          <p>
            <span>🌟</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏰</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </div>
    </li>
  );
}
