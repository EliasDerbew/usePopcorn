import "../Styles/main.css";
import { useState } from "react";

const average = (arr) =>
  arr.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

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

export function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary__header">
      <h2>Movies you watched</h2>
      <div className="m__info">
        <p>
          <span>🛋 </span>
          <span>{avgImdbRating.length} movies</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏰</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMoviesList({ watched, onRemoveWatched }) {
  return (
    <ul>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onRemoveWatched }) {
  return (
    <li className="watched__list">
      <div className="watched__info">
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
      </div>

      <div>
        <button
          className="remove__watched"
          onClick={() => onRemoveWatched(movie.imdbID)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
