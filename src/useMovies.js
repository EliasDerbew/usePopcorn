import { useEffect, useState } from "react";

const key = "ccbce268";
export function useMovies(quary) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      MovieFetching();

      return function () {
        controllar.abort();
      };
    },
    [quary]
  );

  return { movies, isLoading, error };
}
