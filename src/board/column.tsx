import { Droppable } from "@hello-pangea/dnd";
import QuoteItem from "./quote-item";
import { Typography, Box } from "@mui/material";
import useGetTasks from "../hooks/useGetTasks";

interface ColumnProps {
  items: any;
  columnHeader: string;
}

export default function Column({ columnHeader, items }: ColumnProps) {
  //   const { data: quotes, isLoading } = useGetTasks(columnHeader);
  //   console.log(quotes, columnHeader);
  //   if (isLoading) return <p>Loading ....</p>;

  return (
    <Box sx={{ minWidth: 280 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {columnHeader}
      </Typography>
      <Droppable droppableId={columnHeader}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              backgroundColor: snapshot.isDraggingOver
                ? "primary.light"
                : "transparent",
              minHeight: 100,
              p: 1,
              borderRadius: 1,
              transition: "background-color 0.2s ease",
            }}
          >
            {items?.map((quote: any, index: number) => (
              <QuoteItem key={quote.id} task={quote} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
