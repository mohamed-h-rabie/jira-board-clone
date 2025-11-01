import type { ColumnId } from './task';

export interface UpdateTaskBody {
    id: string;
    title?: string;
    description?: string;
    column?: ColumnId;
    position?: number;
}

export interface UpdateTaskParams {
    body: UpdateTaskBody;
    prevColumn?: ColumnId;
    invalidateQueryTriger?: boolean;
}