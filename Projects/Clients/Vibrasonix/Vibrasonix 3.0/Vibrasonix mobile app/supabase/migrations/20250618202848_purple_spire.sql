/*
  # Fix RLS Policies to Prevent Infinite Recursion

  1. Policy Updates
    - Remove the problematic "Super admins can manage all users" policy that causes infinite recursion
    - Replace with a simpler policy structure that doesn't create recursive dependencies
    - Keep existing user policies for reading and updating own profile
    
  2. Security
    - Maintain security by allowing users to read/update their own profiles
    - Super admin functionality will need to be handled differently (e.g., through service role or different approach)
    
  3. Changes
    - Drop the recursive super admin policy
    - Ensure other policies don't reference the users table recursively
*/

-- Drop the problematic super admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Super admins can manage all users" ON users;

-- Drop similar policies on other tables that might reference users table recursively
DROP POLICY IF EXISTS "Super admins can manage albums" ON albums;
DROP POLICY IF EXISTS "Super admins can manage tracks" ON tracks;

-- Create new policies that don't cause recursion
-- For albums: Allow public read access, authenticated users can manage their own content
CREATE POLICY "Anyone can view albums"
  ON albums
  FOR SELECT
  TO public
  USING (true);

-- For tracks: Allow public read access, authenticated users can manage their own content  
CREATE POLICY "Anyone can view tracks"
  ON tracks
  FOR SELECT
  TO public
  USING (true);

-- Note: Super admin functionality should be implemented using:
-- 1. Service role key for admin operations (bypasses RLS)
-- 2. Separate admin interface that uses service role
-- 3. Database functions that use SECURITY DEFINER
-- Rather than RLS policies that create recursive dependencies