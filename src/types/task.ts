export interface Task {
    id: string;
    title?: string;
    description?: string;
    column?: ColumnId;
    position?: number;
}

export interface Column {
    name: string;
    items: Task[];
    serverData: any; // You can type this more specifically based on your query return type
}

export interface ColumnsState {
    backlog: Column;
    inProgress: Column;
    review: Column;
    done: Column;
}

export type ColumnId = 'backlog' | 'inProgress' | 'review' | 'done';

export interface DragEndResult {
    draggableId: string;
    type: string;
    source: {
        droppableId: ColumnId;
        index: number;
    };
    destination: {
        droppableId: ColumnId;
        index: number;
    } | null;
}