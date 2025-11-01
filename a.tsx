import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragIndicator as DragIcon } from "@mui/icons-material";

const initialTasks = {
  backlog: [
    {
      id: 1,
      title: "Design login page",
      description: "Create a mockup for the new login page",
    },
    {
      id: 2,
      title: "Draft user survey",
      description: "Prepare questions for the user feedback survey",
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "Implement authentication",
      description: "Add OAuth2 support for user logins",
    },
    {
      id: 4,
      title: "Update dependencies",
      description: "Upgrade project to use latest libraries",
    },
  ],
  review: [
    {
      id: 5,
      title: "Code cleanup",
      description: "Refactor code to improve readability",
    },
    {
      id: 6,
      title: "Write documentation",
      description: "Document the API endpoints and usage",
    },
  ],
  done: [
    {
      id: 7,
      title: "Fix login bug",
      description: "Resolve the issue with login errors",
    },
    {
      id: 8,
      title: "Deploy to production",
      description: "Push the latest changes to the live server",
    },
  ],
};

const KanbanColumn = ({ title, tasks }) => {
  return (
    <Box sx={{ minWidth: 280 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {title}
      </Typography>

      {/* Wrap tasks in SortableContext */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
};
// Replace your current task card with this sortable version
const SortableTaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderRadius: 2,
        cursor: isDragging ? "grabbing" : "grab",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              display: "flex",
              alignItems: "center",
              color: "#999",
            }}
          >
            <DragIcon fontSize="small" />
          </Box>

          {/* Task Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <IconButton size="small" sx={{ color: "#666" }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
export default function KanbanDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null); // For drag overlay
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag starts after moving 8px
      },
    })
  );
  const findContainer = (id) => {
    if (id in tasks) {
      return id;
    }
    return Object.keys(tasks).find((key) =>
      tasks[key].some((task) => task.id === id)
    );
  };
  const handleDragStart = (event) => {
    const { active } = event;
    const container = findContainer(active.id);
    const task = tasks[container].find((t) => t.id === active.id);
    setActiveTask(task);
  };
  // Handle dragging over different columns (live updates)
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    // Update UI while dragging between columns
    setTasks((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.findIndex((t) => t.id === active.id);
      const overIndex = overItems.findIndex((t) => t.id === over.id);

      const [movedTask] = activeItems.splice(activeIndex, 1);

      if (over.id in prev) {
        overItems.push(movedTask);
      } else {
        overItems.splice(overIndex, 0, movedTask);
      }

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    // Different column - MAKE SERVER REQUEST HERE
    if (activeContainer !== overContainer) {
      const newPosition = tasks[overContainer].findIndex(
        (t) => t.id === active.id
      );

      // 🔥 YOUR SERVER REQUEST
      try {
        await updateTaskOnServer(
          active.id,
          activeContainer,
          overContainer,
          newPosition
        );
        console.log(
          `✅ Task moved from ${activeContainer} to ${overContainer}`
        );
      } catch (error) {
        // If server fails, revert the UI (optional)
        console.error("Failed to update server");
      }
    }
    // Same column reordering
    else {
      const items = tasks[activeContainer];
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);

      if (oldIndex !== newIndex) {
        setTasks((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        }));
      }
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", bgcolor: "#f5f5f5", p: 4 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by task title or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#1d4ed8",
              },
            }}
          >
            Add Task
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={12}>
        <Grid item xs={12} sm={6} lg={3}>
          <KanbanColumn title="Backlog" tasks={tasks.backlog} />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <KanbanColumn title="In Progress" tasks={tasks.inProgress} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KanbanColumn title="Review" tasks={tasks.review} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KanbanColumn title="Done" tasks={tasks.done} />
        </Grid>
      </Grid>
    </Box>
  );
}
