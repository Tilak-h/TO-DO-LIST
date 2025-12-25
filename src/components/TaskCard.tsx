import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Trash2, Edit } from 'lucide-react';
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
import { getUrgencyLabel, getUrgencyColor } from '@/lib/taskSort';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
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

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
  const urgencyLabel = getUrgencyLabel(task);
  const urgencyColor = getUrgencyColor(task);

  return (
    <Card className={`transition-all hover:shadow-lg hover-lift animate-slide-up ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {urgencyLabel && (
                  <Badge variant="outline" className={`${urgencyColor} border-current`}>
                    {urgencyLabel}
                  </Badge>
                )}
                <Badge className={priorityColors[task.priority]}>
                  {priorityLabels[task.priority]}
                </Badge>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}

            {task.categories && task.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.categories.map(category => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    style={{ 
                      borderColor: category.color,
                      color: category.color,
                      backgroundColor: `${category.color}15`
                    }}
                    className="text-xs"
                  >
                    {category.icon && <span className="mr-1">{category.icon}</span>}
                    {category.name}
                  </Badge>
                ))}
              </div>
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
      <CardFooter className="pt-0 pb-4 gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
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
