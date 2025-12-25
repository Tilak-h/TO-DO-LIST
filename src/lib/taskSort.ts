import type { Task, TaskPriority, SortOption } from '@/types/types';
import { differenceInDays, isPast, parseISO } from 'date-fns';

// Priority weights for smart sorting
const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Calculate urgency score based on deadline proximity
 * Returns higher scores for more urgent tasks
 */
function calculateUrgencyScore(task: Task): number {
  if (!task.deadline) return 0;
  
  const deadline = parseISO(task.deadline);
  const daysUntilDeadline = differenceInDays(deadline, new Date());
  
  // Overdue tasks get highest urgency
  if (isPast(deadline)) {
    return 100 + Math.abs(daysUntilDeadline);
  }
  
  // Tasks due soon get high urgency (inverse relationship)
  if (daysUntilDeadline <= 1) return 50;
  if (daysUntilDeadline <= 3) return 30;
  if (daysUntilDeadline <= 7) return 20;
  if (daysUntilDeadline <= 14) return 10;
  
  return 5;
}

/**
 * Smart sorting algorithm that combines:
 * - Urgency (deadline proximity)
 * - Priority level
 * - Creation time
 */
function smartSort(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Calculate composite scores
    const scoreA = calculateUrgencyScore(a) * 2 + PRIORITY_WEIGHTS[a.priority] * 10;
    const scoreB = calculateUrgencyScore(b) * 2 + PRIORITY_WEIGHTS[b.priority] * 10;
    
    // Higher score = more important (should come first)
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    
    // If scores are equal, sort by creation time (newer first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/**
 * Sort tasks by deadline (earliest first)
 */
function sortByDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Tasks without deadline go to bottom
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    
    // Sort by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}

/**
 * Sort tasks by priority (high to low)
 */
function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority weight
    const diff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    if (diff !== 0) return diff;
    
    // If same priority, sort by creation time
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/**
 * Sort tasks by creation date (newest first)
 */
function sortByCreated(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/**
 * Sort tasks alphabetically by title
 */
function sortAlphabetically(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return a.title.localeCompare(b.title);
  });
}

/**
 * Main sorting function that applies the selected sort option
 */
export function sortTasks(tasks: Task[], sortOption: SortOption): Task[] {
  switch (sortOption) {
    case 'smart':
      return smartSort(tasks);
    case 'deadline':
      return sortByDeadline(tasks);
    case 'priority':
      return sortByPriority(tasks);
    case 'created':
      return sortByCreated(tasks);
    case 'alphabetical':
      return sortAlphabetically(tasks);
    default:
      return tasks;
  }
}

/**
 * Get urgency label for a task
 */
export function getUrgencyLabel(task: Task): string | null {
  if (!task.deadline || task.completed) return null;
  
  const deadline = parseISO(task.deadline);
  const daysUntilDeadline = differenceInDays(deadline, new Date());
  
  if (isPast(deadline)) return 'Overdue';
  if (daysUntilDeadline === 0) return 'Due Today';
  if (daysUntilDeadline === 1) return 'Due Tomorrow';
  if (daysUntilDeadline <= 3) return 'Due Soon';
  
  return null;
}

/**
 * Get urgency color class for a task
 */
export function getUrgencyColor(task: Task): string {
  if (!task.deadline || task.completed) return '';
  
  const deadline = parseISO(task.deadline);
  const daysUntilDeadline = differenceInDays(deadline, new Date());
  
  if (isPast(deadline)) return 'text-destructive';
  if (daysUntilDeadline <= 1) return 'text-destructive';
  if (daysUntilDeadline <= 3) return 'text-warning';
  
  return '';
}
