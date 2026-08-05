/*
# Fix update_updated_at function search path

1. Security
- Sets a fixed search_path on the update_updated_at trigger function to prevent search path manipulation attacks.
- The function is used by triggers on payment_methods, invoices, and payment_confirmations tables.
*/

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
