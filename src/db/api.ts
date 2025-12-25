import { supabase } from './supabase';
import type { Task, TaskPriority } from '@/types/types';

export interface CreateTaskInput {
  title: string;
  description?: string;
  date_time?: string;
  deadline?: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  date_time?: string;
  deadline?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

// Fetch all tasks for the current user
export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

// Create a new task
export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description || null,
      date_time: input.date_time || null,
      deadline: input.deadline || null,
      priority: input.priority,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create task');
  }

  return data;
}

// Update a task
export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description || null;
  if (input.date_time !== undefined) updateData.date_time = input.date_time || null;
  if (input.deadline !== undefined) updateData.deadline = input.deadline || null;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.completed !== undefined) updateData.completed = input.completed;

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update task');
  }

  return data;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

// Toggle task completion status
export async function toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
  return updateTask(taskId, { completed });
}
