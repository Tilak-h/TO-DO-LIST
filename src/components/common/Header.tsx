import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LogOut, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateDailySummary, isAIConfigured } from '@/services/ai';
import { fetchTasks } from '@/db/api';
import { toast } from 'sonner';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDailySummary = async () => {
    if (!user) return;
    if (!isAIConfigured()) {
      toast.error('AI not configured', {
        description: 'Please add VITE_GEMINI_API_KEY to your .env file to use AI features.'
      });
      return;
    }

    setSummaryOpen(true);
    setSummaryLoading(true);
    setSummary('');

    try {
      const tasks = await fetchTasks(user.id);
      const activeTasks = tasks.filter(t => !t.completed);

      if (activeTasks.length === 0) {
        setSummary("You have no active tasks! Enjoy your day! 🎉");
      } else {
        const text = await generateDailySummary(activeTasks);
        setSummary(text || "Could not generate summary.");
      }
    } catch (error) {
      console.error(error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={handleDailySummary}
              >
                <Sparkles className="w-4 h-4" />
                Daily Brief
              </Button>
            )}

            <ThemeCustomizer />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.username || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.email || user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Daily Task Summary
            </DialogTitle>
            <DialogDescription>
              AI-powered insights for your day
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {summaryLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin text-4xl">✨</div>
                <p className="text-muted-foreground animate-pulse">Analyzing your tasks...</p>
              </div>
            ) : (
              <div className="prose dark:prose-invert">
                <p className="leading-relaxed whitespace-pre-line">{summary}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
