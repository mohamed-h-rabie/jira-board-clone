import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const postTask = async (body: {
  title: string;
  description: string;
  column: "inProgress" | "backlog" | "review" | "done";
}) => {
  const res = await axios.post(`http://localhost:4000/tasks`, {
    title: body.title,
    description: body.description,
    column: body.column,
  });
  return res.data;
};
const usePostTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.column] });
    },
  });
};

export default usePostTask;
