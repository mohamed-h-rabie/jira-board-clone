import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Typography, Box } from "@mui/material";
import { useRef, useEffect } from "react";

interface ColumnProps {
  items: Array<any>;
  columnHeader: string;
  serverData: any;
  columnId: string;
}

const getHeaderColor = (header: string) => {
  const colors: { [key: string]: string } = {
    backlog: "#E3F2FD", // Light Blue
    inProgress: "#FFF3E0", // Light Orange
    review: "#F3E5F5", // Light Purple
    done: "#E8F5E9", // Light Green
  };
  return colors[header] || "#F5F5F5"; // Default gray
};
export default function Column({
  columnHeader,
  items,
  serverData,
}: ColumnProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ✅ Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && serverData.hasNextPage) {
          serverData.fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [serverData.hasNextPage]);

  
  return (
    <Box
      sx={{
        minWidth: 280,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          gap: "30px",
          flexDirection: "row",
          alignItems: "center",
          bgcolor: getHeaderColor(columnHeader),
          mb: 1,
          p: 2,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,

            borderRadius: 1,
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {" "}
          {columnHeader}
        </Typography>
        <Typography
          //   variant="h6"
          sx={{
            fontWeight: 500,
            backgroundColor: "#e9eaeb",
            paddingInline: 1,
            borderRadius: 1,
            textAlign: "center",
            textTransform: "capitalize",
            fontSize: 15,
          }}
        >
          {items.length}
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#f8f8f8",
          paddingTop: 2,
          paddingBottom: 2,
          borderRadius: 3,
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <Droppable droppableId={columnHeader}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                backgroundColor: snapshot.isDraggingOver
                  ? "#e3f2fd"
                  : "transparent",
                minHeight: 100,
                p: 2,
                borderRadius: 1,
                transition: "background-color 0.2s ease",
              }}
            >
              {items?.map((quote: any, index: number) => (
                <TaskCard key={quote.id} task={quote} index={index} />
              ))}

              {provided.placeholder}

              {/* ✅ Observer target */}
              <Box ref={loaderRef} sx={{ height: 40, textAlign: "center" }}>
                {serverData.isFetchingNextPage
                  ? "Loading more..."
                  : !serverData.hasNextPage && items?.length > 0
                  ? "No more tasks"
                  : ""}
              </Box>
            </Box>
          )}
        </Droppable>
      </Box>

      {serverData.isLoading && (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          Loading initial data...
        </Box>
      )}
    </Box>
  );
}
