"use client";
import useSWRLib from "swr";

export const useSWR = <T>(
  key: string,
  fetcher: (...args: any[]) => Promise<T>,
) => {
  return useSWRLib<T>(key, fetcher);
};
