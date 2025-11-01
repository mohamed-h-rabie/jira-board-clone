import { Modal, Box, Typography, Button } from "@mui/material";

interface Task {
  id: string;
  title: string;
  description: string;
  column: "backlog" | "inProgress" | "review" | "done";
}

interface DeleteTaskModalProps {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
  task: Task | null;
}

const DeleteTaskModal = ({
  open,
  onClose,
  handleDelete,
  task,
}: DeleteTaskModalProps) => {
  const handleConfirmDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="delete-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Delete Task
        </Typography>

        <Typography
          id="delete-modal-description"
          variant="body1"
          sx={{ mb: 3 }}
        >
          Are you sure you want to delete <strong>"{task?.title}"</strong>? This
          action cannot be undone.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteTaskModal;
