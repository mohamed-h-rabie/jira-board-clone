/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchTasks = async (query: any, pageParam = 0) => {
  //   if (query === "all") {
  //     const res = await axios.get(
  //       `http://localhost:3000/posts?_limit=5&_page=${paginate}`
  //     );
  //     return res.data;
  //   } else {
  //     console.log(query, "query");
  //     const res = await axios.get(`http://localhost:3000/posts?status=${query}`);
  //     return res.data;
  //   }
  const res = await axios.get(`http://localhost:4000/tasks?column=${query}`);
  return res.data;
};
const useGetTasks = (query: any) => {
  return useQuery({
    queryKey: ["tasks", query],
    queryFn: () => fetchTasks(query),
    // staleTime: 1000 * 3 * 60,
    // refetchInterval: 7000,
  });
};

export default useGetTasks;
