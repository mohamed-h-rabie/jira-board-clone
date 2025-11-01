import { create } from 'zustand';
import type { ColumnsState, ColumnId, Task } from '../types/task';

interface TaskStore {
  columns: ColumnsState;
  searchQuery: string;
  debouncedSearchQuery: string;

  setColumns: (columns: ColumnsState) => void;
  updateColumn: (columnId: ColumnId, items: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setDebouncedSearchQuery: (query: string) => void;

  moveTask: (
    sourceColumnId: ColumnId,
    destColumnId: ColumnId,
    sourceIndex: number,
    destIndex: number
  ) => void;

  reorderTask: (
    columnId: ColumnId,
    sourceIndex: number,
    destIndex: number
  ) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  columns: {
    backlog: { name: 'Backlog', items: [], serverData: {} },
    inProgress: { name: 'In Progress', items: [], serverData: {} },
    review: { name: 'Review', items: [], serverData: {} },
    done: { name: 'Done', items: [], serverData: {} },
  },
  searchQuery: '',
  debouncedSearchQuery: '',

  setColumns: (columns) => set({ columns }),

  updateColumn: (columnId, items) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          items,
        },
      },
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDebouncedSearchQuery: (query) => set({ debouncedSearchQuery: query }),

  moveTask: (sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    const { columns } = get();
    const sourceColumn = columns[sourceColumnId];
    const destColumn = columns[destColumnId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [removed] = sourceItems.splice(sourceIndex, 1);
    destItems.splice(destIndex, 0, removed);

    set({
      columns: {
        ...columns,
        [sourceColumnId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destColumnId]: {
          ...destColumn,
          items: destItems,
        },
      },
    });
  },

  reorderTask: (columnId, sourceIndex, destIndex) => {
    const { columns } = get();
    const column = columns[columnId];
    const copiedItems = [...column.items];

    const [removed] = copiedItems.splice(sourceIndex, 1);
    copiedItems.splice(destIndex, 0, removed);

    set({
      columns: {
        ...columns,
        [columnId]: {
          ...column,
          items: copiedItems,
        },
      },
    });
  },
}));
