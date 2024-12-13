export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  duedate: string;
  completed: boolean;
  category: string;
}

export type TodoFormData = Omit<Todo, 'id'>;