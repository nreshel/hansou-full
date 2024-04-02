import { useState, useEffect } from "react";

const useAsync = ({ asyncFunction, immediate = false, exitFunction }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (...params) => {
    try {
      setLoading(true);
      const result = await asyncFunction(...params);
      console.log(result);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    if (!!exitFunction) {
      return async () => await exitFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, immediate]); // Only re-run the effect if asyncFunction or immediate changes

  return { data, setData, loading, error, fetchData };
};

export default useAsync;
