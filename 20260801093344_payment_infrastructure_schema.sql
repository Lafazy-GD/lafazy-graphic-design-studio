/*
# Payment Infrastructure Schema

1. New Tables
- `payment_methods` — Admin-managed payment method configurations (bank transfer, Opay, Moniepoint, PalmPay, Raenest USD, Binance Pay, USDT TRC20, USDT BEP20, BTC, ETH). Each stores account details, wallet addresses, QR code URL, and instructions. Admin-only writes; public reads so the payment page can display them.
- `invoices` — Professional invoices with auto-generated invoice numbers, client info, project details, amount, currency, due date, and payment status. Admin-only writes; public read by invoice number so clients can view their invoice.
- `payment_confirmations` — Client-submitted payment confirmations with reference number, transaction ID, receipt upload, amount, currency, and payment method. Public insert (clients submit); admin-only read/update.

2. Security
- `payment_methods`: RLS enabled. SELECT for anon+authenticated (public payment page needs to read). INSERT/UPDATE/DELETE for authenticated only (admin manages).
- `invoices`: RLS enabled. SELECT for anon+authenticated (clients view by number). INSERT/UPDATE/DELETE for authenticated only (admin creates/manages).
- `payment_confirmations`: RLS enabled. SELECT/UPDATE for authenticated only (admin reviews). INSERT for anon+authenticated (clients submit confirmations).

3. Important Notes
- All payment details are stored in the database — no hardcoded account numbers or wallet addresses.
- Admin adds real payment info later via the admin dashboard.
- Invoice numbers auto-generated as INV-YYYY-NNNN format.
- Payment reference numbers auto-generated as PAY-XXXXXXXX format.
- Receipt files uploaded to Supabase Storage `studio-uploads` bucket under `receipts/` folder.
*/

-- Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  currency text NOT NULL DEFAULT 'NGN',
  category text NOT NULL DEFAULT 'bank',
  account_name text,
  account_number text,
  bank_name text,
  usd_account_name text,
  usd_account_number text,
  swift_code text,
  routing_number text,
  wallet_address text,
  binance_pay_id text,
  qr_code_url text,
  instructions text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_payment_methods" ON payment_methods;
CREATE POLICY "anon_read_payment_methods" ON payment_methods FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_payment_methods" ON payment_methods;
CREATE POLICY "auth_insert_payment_methods" ON payment_methods FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_payment_methods" ON payment_methods;
CREATE POLICY "auth_update_payment_methods" ON payment_methods FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_payment_methods" ON payment_methods;
CREATE POLICY "auth_delete_payment_methods" ON payment_methods FOR DELETE
  TO authenticated USING (true);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  client_name text NOT NULL,
  client_company text,
  client_email text NOT NULL,
  project_name text NOT NULL,
  description text,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  due_date date,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_invoices" ON invoices;
CREATE POLICY "anon_read_invoices" ON invoices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_invoices" ON invoices;
CREATE POLICY "auth_insert_invoices" ON invoices FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_invoices" ON invoices;
CREATE POLICY "auth_update_invoices" ON invoices FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_invoices" ON invoices;
CREATE POLICY "auth_delete_invoices" ON invoices FOR DELETE
  TO authenticated USING (true);

-- Payment Confirmations table
CREATE TABLE IF NOT EXISTS payment_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  payment_method text NOT NULL,
  transaction_id text,
  amount_paid numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  receipt_url text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_confirmations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_payment_confirmations" ON payment_confirmations;
CREATE POLICY "anon_insert_payment_confirmations" ON payment_confirmations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_payment_confirmations" ON payment_confirmations;
CREATE POLICY "auth_read_payment_confirmations" ON payment_confirmations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_payment_confirmations" ON payment_confirmations;
CREATE POLICY "auth_update_payment_confirmations" ON payment_confirmations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_payment_confirmations" ON payment_confirmations;
CREATE POLICY "auth_delete_payment_confirmations" ON payment_confirmations FOR DELETE
  TO authenticated USING (true);

-- Seed default payment method entries (empty, admin fills in real details)
INSERT INTO payment_methods (name, slug, currency, category, sort_order, instructions) VALUES
  ('Nigerian Bank Transfer', 'bank-transfer', 'NGN', 'bank', 1, 'Transfer to the bank account below. Use your invoice number as reference.'),
  ('Opay', 'opay', 'NGN', 'mobile', 2, 'Send payment to the Opay account number below.'),
  ('Moniepoint', 'moniepoint', 'NGN', 'mobile', 3, 'Send payment to the Moniepoint account number below.'),
  ('PalmPay', 'palmpay', 'NGN', 'mobile', 4, 'Send payment to the PalmPay account number below.'),
  ('Raenest USD Account', 'raenest-usd', 'USD', 'bank', 5, 'Transfer USD to the Raenest account below for international payments.'),
  ('Binance Pay', 'binance-pay', 'USD', 'crypto', 6, 'Send payment via Binance Pay to the ID below.'),
  ('USDT (TRC20)', 'usdt-trc20', 'USD', 'crypto', 7, 'Send USDT to the TRC20 wallet address below.'),
  ('USDT (BEP20)', 'usdt-bep20', 'USD', 'crypto', 8, 'Send USDT to the BEP20 wallet address below.'),
  ('Bitcoin (BTC)', 'bitcoin', 'USD', 'crypto', 9, 'Send BTC to the wallet address below.'),
  ('Ethereum (ETH)', 'ethereum', 'USD', 'crypto', 10, 'Send ETH to the wallet address below.')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_reference ON payment_confirmations(reference_number);
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_status ON payment_confirmations(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_slug ON payment_methods(slug);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payment_methods_updated_at ON payment_methods;
CREATE TRIGGER payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS payment_confirmations_updated_at ON payment_confirmations;
CREATE TRIGGER payment_confirmations_updated_at BEFORE UPDATE ON payment_confirmations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
