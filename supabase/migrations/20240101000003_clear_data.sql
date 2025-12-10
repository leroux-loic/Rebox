-- Clear all data from listings, orders, and notifications
-- Using CASCADE to handle foreign key constraints automatically

TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE listings CASCADE;
TRUNCATE TABLE notifications CASCADE;

-- Optional: Reset sequences if you want IDs to start from 1 (if using serial/identity)
-- ALTER SEQUENCE listings_id_seq RESTART WITH 1;
