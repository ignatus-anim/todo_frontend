/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from '@/lib/types';
import { TodoList } from '@/components/todo-list';
import { TodoForm } from '@/components/todo-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import * as api from '@/lib/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load todos',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTodo = async (data: TodoFormData) => {
    try {
      const newTodo = await api.createTodo(data);
      setTodos([...todos, newTodo]);
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Todo created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create todo',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!editingTodo) return;
    try {
      const updatedTodo = await api.updateTodo(editingTodo.id, data);
      setTodos(todos.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo)));
      setEditingTodo(null);
      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await api.updateTodo(id, { completed });
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Todo App</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Todo
        </Button>
      </div>

      <TodoList
        todos={todos}
        onEdit={setEditingTodo}
        onDelete={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
      />

      <Dialog open={isFormOpen || !!editingTodo} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setEditingTodo(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
          </DialogHeader>
          <TodoForm
            initialData={editingTodo || undefined}
            onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}