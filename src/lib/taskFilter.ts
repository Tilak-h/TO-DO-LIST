import type { Task, TaskFilters } from '@/types/types';
import { isWithinInterval, parseISO } from 'date-fns';

/**
 * Filter tasks based on multiple criteria
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  let filtered = [...tasks];

  // Search filter (title and description)
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }

  // Priority filter
  if (filters.priorities && filters.priorities.length > 0) {
    filtered = filtered.filter(task => 
      filters.priorities!.includes(task.priority)
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(task => 
      task.categories?.some(cat => filters.categories!.includes(cat.id))
    );
  }

  // Date range filter
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter(task => {
      if (!task.deadline) return false;
      
      try {
        const deadline = parseISO(task.deadline);
        return isWithinInterval(deadline, {
          start: parseISO(start),
          end: parseISO(end)
        });
      } catch {
        return false;
      }
    });
  }

  return filtered;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: TaskFilters): boolean {
  return !!(
    (filters.search && filters.search.trim()) ||
    (filters.priorities && filters.priorities.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.dateRange
  );
}

/**
 * Get count of active filters
 */
export function getActiveFilterCount(filters: TaskFilters): number {
  let count = 0;
  
  if (filters.search && filters.search.trim()) count++;
  if (filters.priorities && filters.priorities.length > 0) count++;
  if (filters.categories && filters.categories.length > 0) count++;
  if (filters.dateRange) count++;
  
  return count;
}
