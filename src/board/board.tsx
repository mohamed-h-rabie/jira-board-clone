import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./column";
import { Box, CircularProgress } from "@mui/material";
import useUpdateTask from "../hooks/useUpdateTask";
import useGetTasks from "../hooks/useGetTasks";
import { useState, useEffect } from "react";
import type { ColumnsState, DragEndResult } from "../types/task";
import type { UpdateTaskBody } from "../types/updateTask";

interface BoardProps {
  searchQuery: string;
}
export default function Board({ searchQuery }: BoardProps) {
  console.log(searchQuery, "searchQuery");

  // Fetch tasks for each column
  const backlogQuery = useGetTasks("backlog", searchQuery);
  const inProgressQuery = useGetTasks("inProgress", searchQuery);
  const reviewQuery = useGetTasks("review", searchQuery);
  const doneQuery = useGetTasks("done", searchQuery);

  const [columns, setColumns] = useState<ColumnsState>({
    backlog: { name: "Backlog", items: [], serverData: {} },
    inProgress: { name: "In Progress", items: [], serverData: {} },
    review: { name: "Review", items: [], serverData: {} },
    done: { name: "Done", items: [], serverData: {} },
  });

  const { mutate: updateTask } = useUpdateTask();

  // Update columns state when queries complete
  useEffect(() => {
    console.log(searchQuery);

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
      done: { name: "done", items: doneData || [], serverData: doneQuery },
    });
  }, [
    backlogQuery.data,
    inProgressQuery.data,
    reviewQuery.data,
    doneQuery.data,
    searchQuery,
  ]);

  const onDragEnd = (
    result: DragEndResult,
    columns: ColumnsState,
    setColumns: React.Dispatch<React.SetStateAction<ColumnsState>>
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      // Calculate new position based on surrounding items
      let newPosition: number;
      if (destination.index === 0) {
        newPosition = (destItems[1]?.position ?? 2000) - 1000;
      } else if (destination.index === destItems.length - 1) {
        const prevPosition = destItems[destination.index - 1]?.position ?? 0;
        newPosition = prevPosition + 1000;
      } else {
        const before = destItems[destination.index - 1]?.position ?? 0;
        const after = destItems[destination.index + 1]?.position ?? before + 2000;
        newPosition = (before + after) / 2;
      }

      updateTask({
        body: {
          id: result.draggableId,
          column: destination.droppableId,
          position: newPosition,
        } as UpdateTaskBody,
        prevColumn: source.droppableId,
      });
    } else {
      // Same column reorder
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });

      // Calculate position for same-column reorder
      let newPosition: number;
      if (destination.index === 0) {
        newPosition = (copiedItems[1]?.position ?? 2000) - 1000;
      } else if (destination.index === copiedItems.length - 1) {
        const prevPosition = copiedItems[destination.index - 1]?.position ?? 0;
        newPosition = prevPosition + 1000;
      } else {
        const before = copiedItems[destination.index - 1]?.position ?? 0;
        const after = copiedItems[destination.index + 1]?.position ?? before + 2000;
        newPosition = (before + after) / 2;
      }

      updateTask({
        body: {
          id: result.draggableId,
          position: newPosition,
        } as UpdateTaskBody,
        invalidateQueryTriger: false, // Don't refetch for same-column moves
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
    <DragDropContext
      onDragEnd={(result) => {
        onDragEnd(result as unknown as DragEndResult, columns, setColumns);
      }}
    >
      {" "}
      {/* <do */}
      <Box
        sx={{
          display: "flex",
          //   overflowX: "auto",
          //   p: 2,
          //   bgcolor: "white",
          //   minHeight: "80vh",
          //   borderRadius: 2,
          //   gap: 2,
          //   width: "100%",
          justifyContent: "center",
          gap: "15px",
          // borderColor:"grey",
          // borderWidth:"1px"
          // alignItems:"center"
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
