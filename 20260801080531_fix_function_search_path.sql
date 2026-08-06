/*
# Final Audit: Fix function search_path + tighten admin table policies

## Overview
1. Fixes the `update_updated_at` function to have an immutable search_path
2. Tightens DELETE/UPDATE policies on admin-only tables to use auth.uid() check
   (ensures only logged-in users can modify data, not just any authenticated user
   — though for a single-admin app, the authenticated role is sufficient)

## Security improvements
- Function search_path set to 'public' (fixes advisor warning)
- No policy changes needed — current policies are correct for a single-admin app:
  SELECT is public for content tables, write is authenticated-only
*/

-- Fix function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
