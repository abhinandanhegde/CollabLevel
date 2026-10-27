CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _name text := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), split_part(NEW.email, '@', 1));
  _type public.account_type;
  _base text;
  _handle text;
BEGIN
  BEGIN
    _type := (NEW.raw_user_meta_data->>'account_type')::public.account_type;
  EXCEPTION WHEN others THEN _type := NULL;
  END;
  IF _type IS NULL THEN _type := 'independent'; END IF;
  _base := left(regexp_replace(lower(_name), '[^a-z0-9_]', '', 'g'), 20);
  IF length(_base) < 3 THEN _base := 'user'; END IF;
  _handle := _base || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6);
  INSERT INTO public.profiles (id, handle, name, account_type)
  VALUES (NEW.id, _handle, left(_name, 100), _type)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();