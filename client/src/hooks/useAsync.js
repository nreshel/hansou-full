import { useState, useEffect } from 'react';

const useAsync = ({ asyncFunction, immediate = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      console.log(result);
      setData(result);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, immediate]); // Only re-run the effect if asyncFunction or immediate changes

  return { data, setData, loading, error, fetchData };
};

export default useAsync;
