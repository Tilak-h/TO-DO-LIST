import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Sparkles, Wand2 } from 'lucide-react';
import type { TaskPriority, Category } from '@/types/types';
import type { CreateTaskInput } from '@/db/api';
import CategorySelector from './CategorySelector';
import { suggestPriority, suggestDeadline, generateSubtasks, isAIConfigured } from '@/services/ai';
import { toast } from 'sonner';

interface AddTaskDialogProps {
  onAddTask: (task: CreateTaskInput) => Promise<void>;
  categories: Category[];
  onCreateCategory: () => void;
}

export default function AddTaskDialog({ onAddTask, categories, onCreateCategory }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<'priority' | 'deadline' | 'subtasks' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDateTime('');
    setDeadline('');
    setPriority('medium');
    setCategoryIds([]);
  };

  const checkAIConfiguration = () => {
    if (!isAIConfigured()) {
      toast.error('AI not configured', {
        description: 'Please add VITE_GEMINI_API_KEY to your .env file to use AI features.'
      });
      return false;
    }
    return true;
  };

  const handleAutoPriority = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }
    if (!checkAIConfiguration()) return;

    setAiLoading('priority');
    try {
      const suggested = await suggestPriority(title + (description ? `\n\n${description}` : ''));
      setPriority(suggested);
      toast.success(`Priority set to ${suggested}`, {
        icon: '✨'
      });
    } catch (error) {
      toast.error('Failed to suggest priority');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSmartDeadline = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }
    if (!checkAIConfiguration()) return;

    setAiLoading('deadline');
    try {
      const suggested = await suggestDeadline(title + (description ? `\n\n${description}` : ''));
      if (suggested) {
        setDeadline(suggested);
        toast.success('Deadline extracted from text', {
          icon: '📅'
        });
      } else {
        toast.info('No deadline found in text');
      }
    } catch (error) {
      toast.error('Failed to imply deadline');
    } finally {
      setAiLoading(null);
    }
  };

  const handleGenerateSubtasks = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }
    if (!checkAIConfiguration()) return;

    setAiLoading('subtasks');
    try {
      const subtasks = await generateSubtasks(title);
      if (subtasks.length > 0) {
        const checklist = subtasks.map(t => `- [ ] ${t}`).join('\n');
        setDescription(prev => (prev ? prev + '\n\n' : '') + '### Subtasks\n' + checklist);
        toast.success('Subtasks generated', {
          icon: '📝'
        });
      }
    } catch (error) {
      toast.error('Failed to generate subtasks');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        date_time: dateTime || undefined,
        deadline: deadline || undefined,
        priority,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      });
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg hover-lift">
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task to keep track of your to-dos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={handleGenerateSubtasks}
                  disabled={loading || aiLoading === 'subtasks'}
                >
                  {aiLoading === 'subtasks' ? (
                    <span className="animate-spin mr-1">✨</span>
                  ) : (
                    <Wand2 className="w-3 h-3 mr-1" />
                  )}
                  Auto-Breakdown
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Enter task description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="priority">Priority</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={handleAutoPriority}
                  disabled={loading || aiLoading === 'priority'}
                >
                  {aiLoading === 'priority' ? (
                    <span className="animate-spin mr-1">✨</span>
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Suggest
                </Button>
              </div>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)} disabled={loading}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <CategorySelector
                categories={categories}
                selectedIds={categoryIds}
                onChange={setCategoryIds}
                onCreateNew={onCreateCategory}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime">Date & Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="deadline">Deadline</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                  onClick={handleSmartDeadline}
                  disabled={loading || aiLoading === 'deadline'}
                >
                  {aiLoading === 'deadline' ? (
                    <span className="animate-spin mr-1">✨</span>
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Predict
                </Button>
              </div>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

