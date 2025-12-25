import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import type { Task } from '@/types/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  high: 'bg-priority-high text-white',
  medium: 'bg-priority-medium text-white',
  low: 'bg-priority-low text-white',
};

const priorityLabels = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export default function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  return (
    <Card className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <Badge className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
            </div>
            
            {task.description && (
              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {task.date_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(task.date_time), 'MMM d, yyyy h:mm a')}</span>
                </div>
              )}
              {task.deadline && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  <span>Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                  {isOverdue && <span className="text-xs">(Overdue)</span>}
                </div>
              )}
            </div>

            {task.completed && (
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                ✓ Completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
