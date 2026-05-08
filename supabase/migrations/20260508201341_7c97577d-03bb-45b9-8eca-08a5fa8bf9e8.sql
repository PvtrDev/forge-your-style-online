
CREATE OR REPLACE FUNCTION public.validate_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Trim
  NEW.customer_name := btrim(NEW.customer_name);
  NEW.customer_phone := btrim(NEW.customer_phone);
  NEW.customer_email := NULLIF(btrim(coalesce(NEW.customer_email, '')), '');
  NEW.notes := NULLIF(btrim(coalesce(NEW.notes, '')), '');

  -- Length / format checks
  IF char_length(NEW.customer_name) < 2 OR char_length(NEW.customer_name) > 100 THEN
    RAISE EXCEPTION 'Nieprawidłowe imię i nazwisko';
  END IF;
  IF NEW.customer_phone !~ '^[0-9 +()-]{7,20}$' THEN
    RAISE EXCEPTION 'Nieprawidłowy numer telefonu';
  END IF;
  IF NEW.customer_email IS NOT NULL AND (char_length(NEW.customer_email) > 255 OR NEW.customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
    RAISE EXCEPTION 'Nieprawidłowy adres e-mail';
  END IF;
  IF NEW.notes IS NOT NULL AND char_length(NEW.notes) > 500 THEN
    RAISE EXCEPTION 'Notatka jest zbyt długa';
  END IF;
  IF NEW.price_pln < 0 OR NEW.price_pln > 10000 THEN
    RAISE EXCEPTION 'Nieprawidłowa cena';
  END IF;
  IF NEW.duration_min <= 0 OR NEW.duration_min > 600 THEN
    RAISE EXCEPTION 'Nieprawidłowy czas trwania';
  END IF;
  IF (NEW.booking_date + NEW.booking_time) < (now() AT TIME ZONE 'Europe/Warsaw') THEN
    RAISE EXCEPTION 'Nie można rezerwować terminu z przeszłości';
  END IF;

  -- Prevent overlapping bookings (same date, overlapping times)
  IF EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.booking_date = NEW.booking_date
      AND b.status <> 'cancelled'
      AND tstzrange(
            (b.booking_date + b.booking_time)::timestamptz,
            (b.booking_date + b.booking_time + (b.duration_min || ' minutes')::interval)::timestamptz
          )
          && tstzrange(
            (NEW.booking_date + NEW.booking_time)::timestamptz,
            (NEW.booking_date + NEW.booking_time + (NEW.duration_min || ' minutes')::interval)::timestamptz
          )
  ) THEN
    RAISE EXCEPTION 'Ten termin jest już zajęty. Wybierz inną godzinę.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_booking
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.validate_booking();
