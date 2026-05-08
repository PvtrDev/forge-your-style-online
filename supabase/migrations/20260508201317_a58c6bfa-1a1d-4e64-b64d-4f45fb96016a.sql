
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price_pln INTEGER NOT NULL,
  duration_min INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_date ON public.bookings(booking_date);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can create a booking
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No public SELECT/UPDATE/DELETE — protects customer data.
-- Admin reads happen via service role (bypasses RLS).

-- Function to expose only taken slots (no PII) so the client can show availability.
CREATE OR REPLACE FUNCTION public.get_taken_slots(p_date DATE)
RETURNS TABLE (booking_time TIME, duration_min INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT booking_time, duration_min
  FROM public.bookings
  WHERE booking_date = p_date
    AND status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(DATE) TO anon, authenticated;
