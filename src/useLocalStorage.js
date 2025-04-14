import { useEffect, useState } from "react";

export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const returnValue = localStorage.getItem(key);
    return returnValue ? JSON.parse(returnValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
