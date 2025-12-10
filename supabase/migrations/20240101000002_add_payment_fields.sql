-- Add payment fields to orders table
ALTER TABLE orders 
ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
ADD COLUMN stripe_session_id TEXT;

-- Create an index for searching by session ID
CREATE INDEX idx_orders_stripe_session_id ON orders (stripe_session_id);
