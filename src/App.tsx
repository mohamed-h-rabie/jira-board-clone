import { useState } from "react";
import Board from "./board/board";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,

} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import AddTaskModel from "./components/AddTaskModel";
import usePostTask from "./hooks/usePostTask";
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const { mutate: postTask } = usePostTask();
  const handleModalSubmit = (data: any) => {
    console.log("Submitted data:", data);
    postTask(data)
    
    // Handle the data (save to state, API call, etc.)
  };
  return (
    <>
      {/* <CssBaseline /> */}
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 4 }}>
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
        </Paper>
        <Board />
      </Box>
      <AddTaskModel
        open={openModel}
        onClose={() => handleClose()}
        handleModalSubmit={handleModalSubmit}
      />
    </>
  );
}
