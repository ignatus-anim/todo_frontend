'use client';

import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { Todo } from '@/lib/types';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export function TodoCard({ todo, onEdit, onDelete, onToggleComplete }: TodoCardProps) {
  // Memoized date formatting to prevent unnecessary recalculations
  const formattedDate = useMemo(() => {
    console.log(todo.duedate)
    return format(new Date(todo.duedate), 'MMMM dd, yyyy');
  }, [todo.duedate]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
          >
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
            {todo.title}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{todo.category}</Badge>
          <Badge className={`${todo.priority === 'Medium' ? priorityColors.medium  : todo.priority === 'High' ? priorityColors.high : priorityColors.low}`}>{todo.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${todo.completed ? 'text-muted-foreground' : ''}`}>
          {todo.description}
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(todo)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onDelete(todo.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
