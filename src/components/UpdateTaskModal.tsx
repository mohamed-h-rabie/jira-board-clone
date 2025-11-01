import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
type CombinedChangeEvent = InputChangeEvent | SelectChangeEvent;

interface Task {
  id: string;
  title: string;
  description: string;
  column: "backlog" | "inProgress" | "review" | "done";
}

interface ModalData {
  title: string;
  description: string;
  column: "backlog" | "inProgress" | "review" | "done";
}

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  handleModalSubmit: (data: ModalData) => void;
  task: Task | null;
}

const UpdateTaskModal = ({
  open,
  onClose,
  handleModalSubmit,
  task,
}: UpdateTaskModalProps) => {
  const [formData, setFormData] = useState<ModalData>({
    title: "",
    description: "",
    column: "backlog",
  });

  // Populate form with task data when modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        column: task.column,
      });
    }
  }, [task]);
  console.log(formData);

  const isFormValid = formData.title.trim() && formData.description.trim();

  const handleChange = (field: string) => (event: CombinedChangeEvent) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.title.trim() && formData.description.trim()) {
      handleModalSubmit(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
          Update Task
        </Typography>

        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={handleChange("title")}
          margin="normal"
          variant="outlined"
          required={true}
        />

        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={handleChange("description")}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          required={true}
        />

        <InputLabel id="update-column-select-label">column</InputLabel>
        <Select
          labelId="update-column-select-label"
          id="update-column-select"
          value={formData.column}
          label="column"
          onChange={handleChange("column")}
        >
          <MenuItem value="inProgress">inProgress</MenuItem>
          <MenuItem value="backlog">backlog</MenuItem>
          <MenuItem value="review">review</MenuItem>
          <MenuItem value="done">done</MenuItem>
        </Select>

        <Box
          sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!isFormValid}
            variant="contained"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateTaskModal;
