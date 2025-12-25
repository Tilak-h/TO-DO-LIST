import { supabase } from './supabase';
import type { Task, TaskPriority, Category } from '@/types/types';

export interface CreateTaskInput {
  title: string;
  description?: string;
  date_time?: string;
  deadline?: string;
  priority: TaskPriority;
  categoryIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  date_time?: string;
  deadline?: string;
  priority?: TaskPriority;
  completed?: boolean;
  categoryIds?: string[];
}

// Fetch all tasks for the current user with categories
export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  if (!tasks || tasks.length === 0) {
    return [];
  }

  // Fetch categories for all tasks
  const taskIds = tasks.map(t => t.id);
  const { data: taskCategories, error: tcError } = await supabase
    .from('task_categories')
    .select('task_id, category_id, categories(*)')
    .in('task_id', taskIds);

  if (tcError) {
    console.error('Error fetching task categories:', tcError);
    return tasks;
  }

  // Map categories to tasks
  const tasksWithCategories = tasks.map(task => ({
    ...task,
    categories: (taskCategories
      ?.filter(tc => tc.task_id === task.id)
      .map(tc => tc.categories)
      .filter(Boolean) || []) as unknown as Category[]
  }));

  return tasksWithCategories;
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

  // Add categories if provided
  if (input.categoryIds && input.categoryIds.length > 0) {
    await addTaskCategories(data.id, input.categoryIds);
  }

  // Fetch the task with categories
  const tasks = await fetchTasks(userId);
  const createdTask = tasks.find(t => t.id === data.id);
  return createdTask || { ...data, categories: [] };
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

  // Update categories if provided
  if (input.categoryIds !== undefined) {
    await removeTaskCategories(taskId);
    if (input.categoryIds.length > 0) {
      await addTaskCategories(taskId, input.categoryIds);
    }
  }

  // Fetch updated task with categories
  const { data: taskData } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .maybeSingle();

  if (!taskData) return { ...data, categories: [] };

  const { data: taskCategories } = await supabase
    .from('task_categories')
    .select('category_id, categories(*)')
    .eq('task_id', taskId);

  return {
    ...taskData,
    categories: (taskCategories?.map(tc => tc.categories).filter(Boolean) || []) as unknown as Category[]
  };
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

// Category Management Functions

export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

export async function createCategory(userId: string, name: string, color: string, icon?: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name,
      color,
      icon: icon || null,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create category');
  }

  return data;
}

export async function updateCategory(categoryId: string, name: string, color: string, icon?: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ name, color, icon: icon || null })
    .eq('id', categoryId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update category');
  }

  return data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Task-Category Association Functions

async function addTaskCategories(taskId: string, categoryIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('task_categories')
    .insert(categoryIds.map(categoryId => ({ task_id: taskId, category_id: categoryId })));

  if (error) {
    console.error('Error adding task categories:', error);
    throw error;
  }
}

async function removeTaskCategories(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('task_categories')
    .delete()
    .eq('task_id', taskId);

  if (error) {
    console.error('Error removing task categories:', error);
    throw error;
  }
}
