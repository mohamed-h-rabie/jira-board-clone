import { useEffect, useState } from "react";
import Board from "./board/board";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import AddTaskModel from "./components/AddTaskModel";
import usePostTask from "./hooks/usePostTask";

// Debounce hook - Fixed to use useEffect instead of useMemo
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const { mutate: postTask } = usePostTask();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleModalSubmit = (data: any) => {
    console.log("Submitted data:", data);
    postTask(data);
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "white", p: 4 }}>
        <Container>
          <Box sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
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
                onClick={() => handleOpen()}
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
          </Box>
        </Container>

        <Board searchQuery={debouncedSearchQuery} />
      </Box>

      <AddTaskModel
        open={openModel}
        onClose={() => handleClose()}
        handleModalSubmit={handleModalSubmit}
      />
    </>
  );
}