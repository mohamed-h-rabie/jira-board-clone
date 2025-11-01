import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const deleteTask = async ({ id, column }: any) => {
  const res = await axios.delete(`http://localhost:4000/tasks/${id}`);
  return { ...res.data, column };
};
const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.column] });
    },
  });
};

export default useDeleteTask;
