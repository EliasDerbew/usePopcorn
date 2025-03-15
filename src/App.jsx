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
  const [quary, setQuary] = useState("inception");
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMovies, setShowMovies] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

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
      async function MovieFetching() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${quary}`
          );

          if (!res.ok) throw new Error("something went wrong . . .");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movies Not Found");

          setMovies(data.Search);
          console.log(data.Search);

          setIsLoading(false);
        } catch (err) {
          console.error(err.message);
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
      MovieFetching();
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
            />
          ) : (
            <>
              <WatchedSummary movies={watched} />
              <WatchedMoviesList movies={watched} />
            </>
          )}
        </WatchedBox>
      </Main>
    </div>
  );
}

function MovieDetails({ selectedId, onCloseSelection, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

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
      imdbId: selectedId,
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
              <StarRating
                maxRating={10}
                size={24}
                defaultRating={imdbRating}
                onSetRating={setUserRating}
              />
              <button onClick={handleAdd} className="add__Movie__btn">
                {" "}
                + Add To List
              </button>
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
