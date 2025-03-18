import { useEffect, useState } from "react";
import Navbar, { Search, NumResult } from "./Components/Navbar";
import StarRating from "./Components/StarRating";
import Main, {
  ListBox,
  WatchedBox,
  MoviesList,
  WatchedSummary,
  WatchedMoviesList,
} from "./Components/Main";
import "./App.css";

const key = "ccbce268";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [quary, setQuary] = useState("");
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMovies, setShowMovies] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

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
  }

  useEffect(
    function () {
      const controllar = new AbortController();

      async function MovieFetching() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${quary}`,
            { signal: controllar.signal }
          );

          if (!res.ok) throw new Error("something went wrong . . .");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movies Not Found");

          setMovies(data.Search);
          setError("");

          setIsLoading(false);
        } catch (err) {
          console.error(err.message);

          if (err.name !== "AbortError") {
            setError(err.message);
          }
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (quary.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handlCloseSelection();
      MovieFetching();

      return function () {
        controllar.abort();
      };
    },
    [quary]
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
