import { axiosClient } from "@/axios/axios";
import { AxiosInstance } from "axios";
import { useEffect, useRef, useState } from "react";

interface UseFetchOptions<T> {
  axiosInstance?: AxiosInstance;
  debounceDelay?: number;
  refreshTime?: number;
  callback?: (data: T) => void;
  // you can add more options here in the future (e.g., headers, transformData, etc.)
}

export const useFetch = <T = any,>(
  url: string | null,
  dependencies: any[] = [],
  {
    debounceDelay = 500,
    refreshTime,
    callback,
    axiosInstance = axiosClient,
  }: //if axios instance not provided defaults to axios app axios instance
  UseFetchOptions<T> = {}
) => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<any>(null);
  const [data, setData] = useState<T>();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const refetch = async () => {
    if (!url) return;
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    if (!refreshTime) setLoading(true);
    setErr(null);

    try {
      const response = await axiosInstance.get<T>(url);
      callback?.(response.data);
      setData(response.data);
    } catch (error) {
      setErr(error);
    } finally {
      setLoading(false);
    }

    if (refreshTime) {
      refreshTimer.current = setTimeout(refetch, refreshTime);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      refetch();
    }, debounceDelay);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, dependencies);

  return { loading, err, data, refetch };
};
