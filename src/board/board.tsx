import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./column";
import { Box, CircularProgress } from "@mui/material";
import useUpdateTask from "../hooks/useUpdateTask";
import useGetTasks from "../hooks/useGetTasks";
import { useState, useEffect } from "react";

export default function Board() {
  //   const columnIds = ["backlog", "inProgress", "review", "done"];

  // Fetch tasks for each column
  const backlogQuery = useGetTasks("backlog");
  const inProgressQuery = useGetTasks("inProgress");
  const reviewQuery = useGetTasks("review");
  const doneQuery = useGetTasks("done");

  const [columns, setColumns] = useState({
    backlog: { name: "Backlog", items: [] },
    inProgress: { name: "In Progress", items: [] },
    review: { name: "Review", items: [] },
    done: { name: "Done", items: [] },
  });

  const { mutate: updateTask } = useUpdateTask();
  console.log(backlogQuery.data);

  // Update columns state when queries complete
  useEffect(() => {
    setColumns({
      backlog: { name: "backlog", items: backlogQuery.data || [] },
      inProgress: { name: "inProgress", items: inProgressQuery.data || [] },
      review: { name: "review", items: reviewQuery.data || [] },
      done: { name: "done", items: doneQuery.data || [] },
    });
  }, [
    backlogQuery.data,
    inProgressQuery.data,
    reviewQuery.data,
    doneQuery.data,
  ]);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    console.log(result, columns, "sourceColumn");

    if (source.droppableId !== destination.droppableId) {
      // Moving between columns
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
      console.log(destination);

      // Update on server
      updateTask({
        body: { id: result.draggableId, column: destination.droppableId },
      });
    } else {
      // Reordering within same column
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

      // Optionally update order on server
      //   mutate({ id: result.draggableId, column: source.droppableId });
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
        onDragEnd(result, columns, setColumns);
      }}
    >
      {" "}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          p: 2,
          bgcolor: "#e1e5ea",
          minHeight: "80vh",
          borderRadius: 2,
          gap: 2,
        }}
      >
        {Object.entries(columns).map(([columnId, columnData]) => (
          <Column
            key={columnId}
            columnId={columnId}
            columnHeader={columnData.name}
            items={columnData.items}
          />
        ))}
      </Box>
    </DragDropContext>
  );
}
