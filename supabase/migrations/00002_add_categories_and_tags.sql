-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create task_categories junction table (many-to-many)
CREATE TABLE task_categories (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, category_id)
);

-- Create indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_task_categories_task_id ON task_categories(task_id);
CREATE INDEX idx_task_categories_category_id ON task_categories(category_id);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable RLS on task_categories
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;

-- Task_categories policies (check ownership through task)
CREATE POLICY "Users can view their task categories" ON task_categories
  FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_categories.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their task categories" ON task_categories
  FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_categories.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their task categories" ON task_categories
  FOR DELETE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_categories.task_id AND tasks.user_id = auth.uid()
  ));

-- Insert default categories for existing users
INSERT INTO categories (user_id, name, color, icon)
SELECT DISTINCT user_id, 'Work', '#F59E0B', '💼' FROM tasks
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (user_id, name, color, icon)
SELECT DISTINCT user_id, 'Personal', '#10B981', '🏠' FROM tasks
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (user_id, name, color, icon)
SELECT DISTINCT user_id, 'Shopping', '#8B5CF6', '🛒' FROM tasks
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (user_id, name, color, icon)
SELECT DISTINCT user_id, 'Health', '#EF4444', '❤️' FROM tasks
ON CONFLICT (user_id, name) DO NOTHING;