import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardContent, Typography } from "@mui/material";
import UpdateTaskModal from "../components/UpdateTaskModal";
import { useCallback, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import useUpadateTask from "../hooks/useUpdateTask";
import DeleteTaskModal from "../components/DeleteTaskModal";
import useDeleteTask from "../hooks/useDeleteTask";

interface QuoteItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    column: "backlog" | "inProgress" | "review" | "done";
  };
  index: number;
}

export default function QuoteItem({ task, index }: QuoteItemProps) {
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const handleOpen = () => setOpenUpdateModel(true);
  const handleClose = () => setOpenUpdateModel(false);
  const handleOpenDeleteModel = () => setOpenDeleteModel(true);
  const handleCloseDeleteModel = () => setOpenDeleteModel(false);

  const { mutate: updateTask } = useUpadateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const handleModalSubmit = useCallback(
    (data: any) => {
      const prevColumn = task.column;
      updateTask({
        body: { id: task.id, ...data },
        prevColumn,
        invalidateQueryTriger: true,
      });
    },
    [task, updateTask]
  );
  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 1,
              bgcolor: snapshot.isDragging
                ? "primary.light"
                : "background.paper",
              boxShadow: snapshot.isDragging ? 6 : 1,
              // transition: "all 0.2s ease",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {task.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  flex: 1,
                }}
              >
                {task.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1,
                  mt: "auto",
                  // zIndex: 99999,
                }}
              >
                <button onClick={() => handleOpen()}>
                  <Edit
                    sx={{
                      fontSize: 30,
                      cursor: "pointer",
                      color: "primary.main",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  />
                </button>
                <button onClick={() => handleOpenDeleteModel()}>
                  <Delete
                    sx={{
                      fontSize: 30,
                      cursor: "pointer",
                      color: "error.main",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  />
                </button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Draggable>
      {openUpdateModel && (
        <UpdateTaskModal
          open={openUpdateModel}
          onClose={() => handleClose()}
          handleModalSubmit={handleModalSubmit}
          task={task}
        />
      )}
      {openDeleteModel && (
        <DeleteTaskModal
          open={openDeleteModel}
          onClose={() => handleCloseDeleteModel()}
          handleDelete={() => deleteTask({ id: task.id, column: task.column })}
          task={task}
        />
      )}
    </>
  );
}
