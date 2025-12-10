-- Function to handle payment completion securely (bypassing RLS)
create or replace function complete_payment(
  p_session_id text,
  p_pickup_code text
) returns json
language plpgsql
security definer -- Runs with privileges of the creator (admin), bypassing RLS
as $$
declare
  v_order_id uuid;
  v_listing_id uuid;
  v_seller_id uuid;
  v_listing_title text;
  v_current_status text;
begin
  -- 1. Get order details
  select id, listing_id, payment_status into v_order_id, v_listing_id, v_current_status
  from orders
  where stripe_session_id = p_session_id
  limit 1;

  if v_order_id is null then
    return json_build_object('error', 'Order not found');
  end if;

  -- If already paid, return success immediately to avoid re-processing
  if v_current_status = 'paid' then
     return json_build_object('success', true, 'already_processed', true);
  end if;

  -- 2. Get listing details
  select seller_id, title into v_seller_id, v_listing_title
  from listings
  where id = v_listing_id;

  -- 3. Update Order
  update orders
  set 
    payment_status = 'paid',
    status = 'reserved',
    pickup_code = p_pickup_code
  where id = v_order_id;

  -- 4. Update Listing
  update listings
  set status = 'sold'
  where id = v_listing_id;

  -- 5. Create Notification
  insert into notifications (user_id, title, message, type)
  values (
    v_seller_id,
    'Article Vendu ! 💰',
    'Votre annonce "' || v_listing_title || '" a été payée en ligne. Code retrait: ' || p_pickup_code,
    'success'
  );

  return json_build_object('success', true);
end;
$$;
