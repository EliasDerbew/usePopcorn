import { useEffect, useState, useRef } from "react";
import Navbar, { Search, NumResult } from "./Components/Navbar";
import StarRating from "./Components/StarRating";
import { useMovies } from "./useMovies";
import Main, {
  ListBox,
  WatchedBox,
  MoviesList,
  WatchedSummary,
  WatchedMoviesList,
} from "./Components/Main";
import "./App.css";

export default function App() {
  const [quary, setQuary] = useState("");
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [showMovies, setShowMovies] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(quary);

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  function handleShowMovies() {
    setShowMovies(() => !showMovies);
  }

  function handleSelection(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handlCloseSelection(id) {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <div className="app">
      <Navbar>
        {" "}
        <Search quary={quary} setQuary={setQuary} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        {" "}
        <ListBox onHandleShowMovies={handleShowMovies} showMovies={showMovies}>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <MoviesList
              isOpen={showMovies}
              movies={movies}
              onHandleSelection={handleSelection}
              onAddWatched={handleAddWatched}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </ListBox>
        <WatchedBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseSelection={handlCloseSelection}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={handleDeleteWatched}
              />
            </>
          )}
        </WatchedBox>
      </Main>
    </div>
  );
}

function MovieDetails({ selectedId, onCloseSelection, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRating = useRef(0);

  useEffect(
    function () {
      if (userRating) countRating.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      ratingDecision: countRating.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseSelection();
  }

  useEffect(
    function () {
      async function getMoviesDetail() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMoviesDetail();
    },
    [selectedId]
  );

  //dynamic title

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      // the clean up function
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      document.addEventListener("keydown", function (e) {
        if (e.code === "Escape") {
          onCloseSelection();
        }
      });

      return function () {
        document.removeEventListener("keydown", function (e) {
          if (e.code === "Escape") {
            onCloseSelection();
          }
        });
      };
    },
    [onCloseSelection]
  );

  return (
    <div className="detail">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="detail__header">
            {userRating > 0 && (
              <button onClick={onCloseSelection} className="close--btn">
                &larr;
              </button>
            )}

            <img src={poster} alt={`Poster of ${movie}`} className="poster" />
            <div className="side__movie__info">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span> {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section className="movie__discription">
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAdd} className="add__Movie__btn">
                      {" "}
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>you rated this movie {watchedUserRating} ⭐️</p>
              )}
            </div>
            <p className="plot">
              <em>{plot}</em>
            </p>
            <p className="actors">Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div>
      <p>Loading ...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}
