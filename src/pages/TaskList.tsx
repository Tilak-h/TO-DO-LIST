import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTasks, 
  createTask, 
  deleteTask, 
  toggleTaskCompletion, 
  updateTask,
  fetchCategories,
  createCategory,
} from '@/db/api';
import type { Task, Category, TaskFilters, SortOption } from '@/types/types';
import type { CreateTaskInput, UpdateTaskInput } from '@/db/api';
import TaskCard from '@/components/TaskCard';
import AddTaskDialog from '@/components/AddTaskDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import CategoryDialog from '@/components/CategoryDialog';
import TaskToolbar from '@/components/TaskToolbar';
import TaskStats from '@/components/TaskStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { sortTasks } from '@/lib/taskSort';
import { filterTasks } from '@/lib/taskFilter';

export default function TaskList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('smart');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        fetchTasks(user.id),
        fetchCategories(user.id),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (input: CreateTaskInput) => {
    if (!user) return;

    try {
      const newTask = await createTask(user.id, input);
      setTasks([newTask, ...tasks]);
      toast({
        title: 'Success',
        description: 'Task added successfully',
      });
    } catch (error) {
      console.error('Failed to add task:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: string, input: UpdateTaskInput) => {
    try {
      const updatedTask = await updateTask(taskId, input);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await toggleTaskCompletion(taskId, completed);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      ));
      toast({
        title: completed ? 'Task completed!' : 'Task reopened',
        description: completed ? 'Great job! Keep it up!' : 'Task marked as incomplete',
      });
    } catch (error) {
      console.error('Failed to toggle task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: 'Task deleted',
        description: 'Task has been removed',
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleCreateCategory = async (name: string, color: string, icon: string) => {
    if (!user) return;

    try {
      const newCategory = await createCategory(user.id, name, color, icon);
      setCategories([...categories, newCategory]);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    } catch (error) {
      console.error('Failed to create category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Apply filters and sorting
  const filteredTasks = filterTasks(tasks, filters);
  const sortedTasks = sortTasks(filteredTasks, sortOption);

  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  const renderTaskList = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-bg mx-auto mb-4 flex items-center justify-center opacity-20">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            {filters.search || filters.priorities || filters.categories
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {taskList.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={setEditingTask}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">My Tasks</h1>
            <p className="text-muted-foreground">
              Stay organized and productive
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCategoryDialogOpen(true)}
              title="Manage Categories"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <AddTaskDialog
              onAddTask={handleAddTask}
              categories={categories}
              onCreateCategory={() => setCategoryDialogOpen(true)}
            />
          </div>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32 bg-muted" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-6">
                  <Skeleton className="h-6 w-3/4 mb-4 bg-muted" />
                  <Skeleton className="h-4 w-full mb-2 bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Statistics */}
            <TaskStats tasks={tasks} />

            {/* Toolbar */}
            <TaskToolbar
              filters={filters}
              onFiltersChange={setFilters}
              sortOption={sortOption}
              onSortChange={setSortOption}
              categories={categories}
            />

            {/* Task Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">
                  All ({sortedTasks.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedTasks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {renderTaskList(sortedTasks)}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                {renderTaskList(pendingTasks)}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {renderTaskList(completedTasks)}
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Edit Task Dialog */}
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onUpdateTask={handleUpdateTask}
          categories={categories}
          onCreateCategory={() => setCategoryDialogOpen(true)}
        />

        {/* Category Dialog */}
        <CategoryDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          onSave={handleCreateCategory}
        />
      </div>
    </div>
  );
}

