import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchTasks, createTask, deleteTask, toggleTaskCompletion } from '@/db/api';
import type { Task } from '@/types/types';
import type { CreateTaskInput } from '@/db/api';
import TaskCard from '@/components/TaskCard';
import AddTaskDialog from '@/components/AddTaskDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, ListTodo } from 'lucide-react';

export default function TaskList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchTasks(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
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

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const renderTaskList = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <ListTodo className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No tasks found</p>
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
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
            <p className="text-muted-foreground">
              {pendingTasks.length} pending, {completedTasks.length} completed
            </p>
          </div>
          <AddTaskDialog onAddTask={handleAddTask} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="h-6 w-3/4 mb-4 bg-muted" />
                <Skeleton className="h-4 w-full mb-2 bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">
                All ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderTaskList(tasks)}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {renderTaskList(pendingTasks)}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {renderTaskList(completedTasks)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
