export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date_time: string | null;
  deadline: string | null;
  priority: TaskPriority;
  completed: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category[];
}

export type SortOption = 'smart' | 'deadline' | 'priority' | 'created' | 'alphabetical';

export interface TaskFilters {
  search?: string;
  priorities?: TaskPriority[];
  categories?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
