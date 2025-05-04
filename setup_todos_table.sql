-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select only their own todos
CREATE POLICY todos_select_policy ON todos 
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert only their own todos
CREATE POLICY todos_insert_policy ON todos 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update only their own todos
CREATE POLICY todos_update_policy ON todos 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete only their own todos
CREATE POLICY todos_delete_policy ON todos 
  FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 