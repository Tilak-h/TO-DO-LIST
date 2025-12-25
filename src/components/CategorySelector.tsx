import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/types';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateNew?: () => void;
}

export default function CategorySelector({
  categories,
  selectedIds,
  onChange,
  onCreateNew,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedCategories = categories.filter(cat => selectedIds.includes(cat.id));

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter(id => id !== categoryId));
    } else {
      onChange([...selectedIds, categoryId]);
    }
  };

  const removeCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== categoryId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-left font-normal"
          >
            {selectedCategories.length === 0 ? (
              <span className="text-muted-foreground">Select categories...</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map(cat => (
                  <Badge
                    key={cat.id}
                    style={{ backgroundColor: cat.color }}
                    className="text-white"
                  >
                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                    {cat.name}
                    <button
                      onClick={(e) => removeCategory(cat.id, e)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="text-muted-foreground mb-2">No categories found</p>
                  {onCreateNew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        onCreateNew();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Category
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedIds.includes(category.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full ml-auto"
                      style={{ backgroundColor: category.color }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {onCreateNew && categories.length > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  onCreateNew();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Category
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
