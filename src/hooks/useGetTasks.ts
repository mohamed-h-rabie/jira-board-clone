import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
const LIMIT = 10;

export const fetchTasks = async (
  query: string,
  pageParam = 1,
  searchQuery: string
) => {
  const res = await axios.get(
    `http://localhost:4000/tasks?column=${query}&_page=${pageParam}&_limit=${LIMIT}&_sort=position&_order=asc${
      searchQuery.length > 0 ? `&q=${searchQuery}` : ""
    }`
  );

  return {
    data: res.data,
    nextPage: pageParam + 1,
    hasMore: res.data.length > 0, // Adjust based on your API response
  };
};

const useGetTasks = (query: string, searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ["tasks", query, searchQuery],
    queryFn: ({ pageParam = 1 }) => fetchTasks(query, pageParam, searchQuery),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export default useGetTasks;
