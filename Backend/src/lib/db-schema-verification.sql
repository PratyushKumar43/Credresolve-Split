-- Database Schema Verification Script
-- Run this to check if all tables exist and are properly configured

-- Check if all tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check table structures
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
ORDER BY table_name, ordinal_position;

-- Check indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
ORDER BY tablename, indexname;

-- Check foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
ORDER BY tc.table_name;

-- Check triggers
SELECT 
  trigger_name,
  event_object_table as table_name,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('users', 'groups', 'expenses')
ORDER BY event_object_table, trigger_name;



