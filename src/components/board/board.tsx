import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./column";
import { Box, CircularProgress } from "@mui/material";
import useUpdateTask from "../../hooks/useUpdateTask";
import useGetTasks from "../../hooks/useGetTasks";
import { useEffect } from "react";
import type { DragEndResult } from "../../types/task";
import type { UpdateTaskBody } from "../../types/updateTask";
import { useTaskStore } from "../../store/taskStore";

export default function Board() {
  // Get state and actions from Zustand store
  const columns = useTaskStore((state) => state.columns);
  const setColumns = useTaskStore((state) => state.setColumns);
  const moveTask = useTaskStore((state) => state.moveTask);
  const reorderTask = useTaskStore((state) => state.reorderTask);
  const debouncedSearchQuery = useTaskStore((state) => state.debouncedSearchQuery);

  // Fetch tasks for each column
  const backlogQuery = useGetTasks("backlog", debouncedSearchQuery);
  const inProgressQuery = useGetTasks("inProgress", debouncedSearchQuery);
  const reviewQuery = useGetTasks("review", debouncedSearchQuery);
  const doneQuery = useGetTasks("done", debouncedSearchQuery);

  const { mutate: updateTask } = useUpdateTask();

  // Update columns state when queries complete
  useEffect(() => {
    const backlogData =
      backlogQuery.data?.pages.flatMap((page) => page.data) ?? [];
    const inProgressData =
      inProgressQuery.data?.pages.flatMap((page) => page.data) ?? [];
    const reviewData =
      reviewQuery.data?.pages.flatMap((page) => page.data) ?? [];
    const doneData = doneQuery.data?.pages.flatMap((page) => page.data) ?? [];

    setColumns({
      backlog: {
        name: "backlog",
        items: backlogData || [],
        serverData: backlogQuery,
      },
      inProgress: {
        name: "inProgress",
        items: inProgressData || [],
        serverData: inProgressQuery,
      },
      review: {
        name: "review",
        items: reviewData || [],
        serverData: reviewQuery,
      },
      done: { 
        name: "done", 
        items: doneData || [], 
        serverData: doneQuery 
      },
    });
  }, [
    backlogQuery.data,
    inProgressQuery.data,
    reviewQuery.data,
    doneQuery.data,
    debouncedSearchQuery,
    setColumns,
  ]);

  const calculatePosition = (items: any[], index: number) => {
    if (index === 0) {
      return (items[1]?.position ?? 2000) - 1000;
    } else if (index === items.length - 1) {
      const prevPosition = items[index - 1]?.position ?? 0;
      return prevPosition + 1000;
    } else {
      const before = items[index - 1]?.position ?? 0;
      const after = items[index + 1]?.position ?? before + 2000;
      return (before + after) / 2;
    }
  };

  const onDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Move between columns
      moveTask(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );

      const destColumn = columns[destination.droppableId];
      const destItems = [...destColumn.items];
      const newPosition = calculatePosition(destItems, destination.index);

      updateTask({
        body: {
          id: result.draggableId,
          column: destination.droppableId,
          position: newPosition,
        } as UpdateTaskBody,
        prevColumn: source.droppableId,
      });
    } else {
      // Reorder within same column
      reorderTask(source.droppableId, source.index, destination.index);

      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const newPosition = calculatePosition(copiedItems, destination.index);

      updateTask({
        body: {
          id: result.draggableId,
          position: newPosition,
        } as UpdateTaskBody,
        invalidateQueryTriger: false,
      });
    }
  };

  // Loading state
  const isLoading =
    backlogQuery.isLoading ||
    inProgressQuery.isLoading ||
    reviewQuery.isLoading ||
    doneQuery.isLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result as unknown as DragEndResult)}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        {Object.entries(columns).map(([columnId, columnData]) => (
          <Column
            key={columnId}
            columnId={columnId}
            columnHeader={columnData.name}
            items={columnData.items}
            serverData={columnData.serverData}
          />
        ))}
      </Box>
    </DragDropContext>
  );
}