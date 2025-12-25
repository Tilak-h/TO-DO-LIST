import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, SortAsc, Search, X } from 'lucide-react';
import type { TaskFilters, SortOption, TaskPriority, Category } from '@/types/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getActiveFilterCount } from '@/lib/taskFilter';

interface TaskToolbarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: Category[];
}

const sortOptions: { value: SortOption; label: string; description: string }[] = [
  { value: 'smart', label: '🎯 Smart Sort', description: 'Urgency + Priority + Time' },
  { value: 'deadline', label: '📅 Deadline', description: 'Earliest deadline first' },
  { value: 'priority', label: '⚡ Priority', description: 'High to low priority' },
  { value: 'created', label: '🕐 Created', description: 'Newest first' },
  { value: 'alphabetical', label: '🔤 A-Z', description: 'Alphabetical order' },
];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High Priority', color: 'bg-priority-high' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-priority-medium' },
  { value: 'low', label: 'Low Priority', color: 'bg-priority-low' },
];

export default function TaskToolbar({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  categories,
}: TaskToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const activeFilterCount = getActiveFilterCount(filters);

  const togglePriority = (priority: TaskPriority) => {
    const current = filters.priorities || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    onFiltersChange({ ...filters, priorities: updated.length > 0 ? updated : undefined });
  };

  const toggleCategory = (categoryId: string) => {
    const current = filters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(c => c !== categoryId)
      : [...current, categoryId];
    onFiltersChange({ ...filters, categories: updated.length > 0 ? updated : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const currentSort = sortOptions.find(opt => opt.value === sortOption) || sortOptions[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
          className="pl-10 pr-10"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: undefined })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Toolbar Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              {currentSort.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={sortOption === option.value ? 'bg-accent' : ''}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Sheet */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Tasks</SheetTitle>
              <SheetDescription>
                Refine your task list with filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Priority Filter */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Priority</Label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${option.value}`}
                        checked={filters.priorities?.includes(option.value) || false}
                        onCheckedChange={() => togglePriority(option.value)}
                      />
                      <label
                        htmlFor={`priority-${option.value}`}
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Categories</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories?.includes(category.id) || false}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category.icon && <span>{category.icon}</span>}
                          <span>{category.name}</span>
                          <div
                            className="w-3 h-3 rounded-full ml-auto"
                            style={{ backgroundColor: category.color }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearFilters();
                    setFilterOpen(false);
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Display */}
      {(filters.priorities && filters.priorities.length > 0) || (filters.categories && filters.categories.length > 0) ? (
        <div className="flex flex-wrap gap-2">
          {filters.priorities?.map((priority) => {
            const option = priorityOptions.find(o => o.value === priority);
            return option ? (
              <Badge key={priority} variant="secondary" className="gap-1">
                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                {option.label}
                <button
                  onClick={() => togglePriority(priority)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filters.categories?.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <Badge key={categoryId} variant="secondary" className="gap-1">
                {category.icon && <span>{category.icon}</span>}
                {category.name}
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      ) : null}
    </div>
  );
}
