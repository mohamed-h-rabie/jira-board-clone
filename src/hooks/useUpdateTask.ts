import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const updateTask = async ({
  body,
  prevColumn,
  invalidateQueryTriger = true,
}: {
  body: {
    id: string;
    title?: string;
    description?: string;
    column?: "inProgress" | "backlog" | "review" | "done";
  };
  prevColumn?: "inProgress" | "backlog" | "review" | "done";
  invalidateQueryTriger?: boolean;
}) => {
  const res = await axios.patch(`http://localhost:4000/tasks/${+body.id}`, {
    ...body,
  });
  return { ...res.data, prevColumn, invalidateQueryTriger };
};

const useUpadateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      if (data.invalidateQueryTriger) {
        if (data.prevColumn) {
          queryClient.invalidateQueries({
            queryKey: ["tasks", data.prevColumn],
          });
        }
        queryClient.invalidateQueries({
          queryKey: ["tasks", data.column],
        });
      }
    },
  });
};

export default useUpadateTask;
