-- Enums
CREATE TYPE public.account_type AS ENUM ('brand','startup','creator','artist','agency','marketer','independent','community');
CREATE TYPE public.verification_status AS ENUM ('unverified','pending','verified');
CREATE TYPE public.connection_status AS ENUM ('pending','accepted','declined');
CREATE TYPE public.collab_status AS ENUM ('proposed','active','completed','declined','cancelled');

-- Shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle text NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9_]{3,30}$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  account_type public.account_type NOT NULL,
  headline text NOT NULL DEFAULT '' CHECK (char_length(headline) <= 160),
  bio text NOT NULL DEFAULT '' CHECK (char_length(bio) <= 2000),
  location text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  portfolio jsonb NOT NULL DEFAULT '[]'::jsonb,
  type_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  verification public.verification_status NOT NULL DEFAULT 'unverified',
  credibility_score integer NOT NULL DEFAULT 0 CHECK (credibility_score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE INDEX profiles_account_type_idx ON public.profiles(account_type);

-- Protect verification + credibility from user edits
CREATE OR REPLACE FUNCTION public.guard_profile_protected_fields()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_setting('app.internal_update', true) = 'on' OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.verification := 'unverified';
    NEW.credibility_score := 0;
  ELSE
    NEW.verification := OLD.verification;
    NEW.credibility_score := OLD.credibility_score;
    NEW.id := OLD.id;
    NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER profiles_guard BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_protected_fields();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONNECTIONS
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.connection_status NOT NULL DEFAULT 'pending',
  note text CHECK (note IS NULL OR char_length(note) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (requester_id <> addressee_id)
);
CREATE UNIQUE INDEX connections_pair_uniq ON public.connections (LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id));
CREATE INDEX connections_addressee_idx ON public.connections(addressee_id);
CREATE INDEX connections_requester_idx ON public.connections(requester_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.connections TO authenticated;
GRANT ALL ON public.connections TO service_role;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view connections" ON public.connections FOR SELECT TO authenticated USING (auth.uid() IN (requester_id, addressee_id));
CREATE POLICY "Users send pending requests" ON public.connections FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id AND status = 'pending');
CREATE POLICY "Recipient responds to request" ON public.connections FOR UPDATE TO authenticated USING (auth.uid() = addressee_id) WITH CHECK (auth.uid() = addressee_id);
CREATE POLICY "Participants remove connections" ON public.connections FOR DELETE TO authenticated USING (auth.uid() IN (requester_id, addressee_id));

CREATE OR REPLACE FUNCTION public.guard_connection_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.requester_id <> OLD.requester_id OR NEW.addressee_id <> OLD.addressee_id OR NEW.created_at <> OLD.created_at
     OR NEW.note IS DISTINCT FROM OLD.note THEN
    RAISE EXCEPTION 'Only the connection status can be changed';
  END IF;
  IF OLD.status <> 'pending' THEN
    RAISE EXCEPTION 'This request has already been answered';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER connections_guard BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.guard_connection_update();
CREATE TRIGGER connections_updated_at BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COLLABORATIONS
CREATE TABLE public.collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  purpose text NOT NULL DEFAULT '' CHECK (char_length(purpose) <= 3000),
  deliverables text[] NOT NULL DEFAULT '{}',
  start_date date,
  end_date date,
  compensation text,
  status public.collab_status NOT NULL DEFAULT 'proposed',
  proposer_confirmed boolean NOT NULL DEFAULT false,
  partner_confirmed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (proposer_id <> partner_id),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
CREATE INDEX collaborations_proposer_idx ON public.collaborations(proposer_id);
CREATE INDEX collaborations_partner_idx ON public.collaborations(partner_id);
CREATE INDEX collaborations_status_idx ON public.collaborations(status);
GRANT SELECT, INSERT, UPDATE ON public.collaborations TO authenticated;
GRANT ALL ON public.collaborations TO service_role;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view collaborations" ON public.collaborations FOR SELECT TO authenticated USING (auth.uid() IN (proposer_id, partner_id));
CREATE POLICY "Users propose collaborations" ON public.collaborations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = proposer_id AND status = 'proposed' AND NOT proposer_confirmed AND NOT partner_confirmed AND completed_at IS NULL);
CREATE POLICY "Participants update collaborations" ON public.collaborations FOR UPDATE TO authenticated
  USING (auth.uid() IN (proposer_id, partner_id)) WITH CHECK (auth.uid() IN (proposer_id, partner_id));

CREATE OR REPLACE FUNCTION public.guard_collaboration_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF NEW.proposer_id <> OLD.proposer_id OR NEW.partner_id <> OLD.partner_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Collaboration participants cannot be changed';
  END IF;
  IF OLD.status IN ('completed','declined','cancelled') THEN
    RAISE EXCEPTION 'This collaboration is closed and can no longer be changed';
  END IF;
  -- Each side may only set its own confirmation
  IF NEW.proposer_confirmed <> OLD.proposer_confirmed AND uid <> OLD.proposer_id THEN
    RAISE EXCEPTION 'You can only confirm completion for yourself';
  END IF;
  IF NEW.partner_confirmed <> OLD.partner_confirmed AND uid <> OLD.partner_id THEN
    RAISE EXCEPTION 'You can only confirm completion for yourself';
  END IF;
  IF (NEW.proposer_confirmed OR NEW.partner_confirmed) AND OLD.status <> 'active' THEN
    RAISE EXCEPTION 'Only active collaborations can be confirmed as complete';
  END IF;
  -- Status transitions
  IF NEW.status <> OLD.status THEN
    IF OLD.status = 'proposed' AND NEW.status IN ('active','declined') AND uid = OLD.partner_id THEN NULL;
    ELSIF OLD.status = 'proposed' AND NEW.status = 'cancelled' AND uid = OLD.proposer_id THEN NULL;
    ELSIF OLD.status = 'active' AND NEW.status = 'cancelled' THEN NULL;
    ELSIF NEW.status = 'completed' THEN
      RAISE EXCEPTION 'Completion happens automatically once both sides confirm';
    ELSE
      RAISE EXCEPTION 'Status change not allowed';
    END IF;
  END IF;
  -- Terms locked once active
  IF OLD.status = 'active' AND (NEW.title <> OLD.title OR NEW.purpose <> OLD.purpose OR NEW.deliverables <> OLD.deliverables
      OR NEW.start_date IS DISTINCT FROM OLD.start_date OR NEW.end_date IS DISTINCT FROM OLD.end_date
      OR NEW.compensation IS DISTINCT FROM OLD.compensation) THEN
    RAISE EXCEPTION 'Terms are locked once a collaboration is active';
  END IF;
  -- Auto-complete
  IF NEW.status = 'active' AND NEW.proposer_confirmed AND NEW.partner_confirmed THEN
    NEW.status := 'completed';
    NEW.completed_at := now();
  ELSE
    NEW.completed_at := OLD.completed_at;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER collaborations_guard BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.guard_collaboration_update();
CREATE TRIGGER collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Participant helper (security definer avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_collab_participant(_collab_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.collaborations WHERE id = _collab_id AND _user_id IN (proposer_id, partner_id));
$$;
REVOKE EXECUTE ON FUNCTION public.is_collab_participant(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_collab_participant(uuid, uuid) TO authenticated;

-- MILESTONES
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id uuid NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  due_date date,
  done boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX milestones_collab_idx ON public.milestones(collaboration_id, position);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view milestones" ON public.milestones FOR SELECT TO authenticated USING (public.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants add milestones" ON public.milestones FOR INSERT TO authenticated WITH CHECK (public.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants edit milestones" ON public.milestones FOR UPDATE TO authenticated USING (public.is_collab_participant(collaboration_id, auth.uid())) WITH CHECK (public.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants delete milestones" ON public.milestones FOR DELETE TO authenticated USING (public.is_collab_participant(collaboration_id, auth.uid()));

CREATE OR REPLACE FUNCTION public.guard_milestone_change()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE s public.collab_status; cid uuid;
BEGIN
  cid := CASE WHEN TG_OP = 'DELETE' THEN OLD.collaboration_id ELSE NEW.collaboration_id END;
  IF TG_OP = 'UPDATE' AND NEW.collaboration_id <> OLD.collaboration_id THEN
    RAISE EXCEPTION 'Milestones cannot be moved between collaborations';
  END IF;
  SELECT status INTO s FROM public.collaborations WHERE id = cid;
  IF s IN ('completed','declined','cancelled') THEN
    RAISE EXCEPTION 'Milestones of a closed collaboration cannot be changed';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END; $$;
CREATE TRIGGER milestones_guard BEFORE INSERT OR UPDATE OR DELETE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.guard_milestone_change();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REVIEWS (immutable once written)
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id uuid NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL DEFAULT '' CHECK (char_length(text) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (collaboration_id, author_id),
  CHECK (author_id <> subject_id)
);
CREATE INDEX reviews_subject_idx ON public.reviews(subject_id);
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Participants review completed collaborations" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.collaborations%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.collaborations WHERE id = NEW.collaboration_id;
  IF NOT FOUND OR c.status <> 'completed' THEN
    RAISE EXCEPTION 'Reviews can only be left on completed collaborations';
  END IF;
  IF NOT ((NEW.author_id = c.proposer_id AND NEW.subject_id = c.partner_id)
       OR (NEW.author_id = c.partner_id AND NEW.subject_id = c.proposer_id)) THEN
    RAISE EXCEPTION 'Only collaboration participants can review each other';
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER reviews_validate BEFORE INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.validate_review();

-- Credibility score: recalculated only by the database (placeholder formula)
CREATE OR REPLACE FUNCTION public.recalculate_credibility(_profile_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE avg_r numeric; n int; done_count int; score int;
BEGIN
  SELECT COALESCE(AVG(rating),0), COUNT(*) INTO avg_r, n FROM public.reviews WHERE subject_id = _profile_id;
  SELECT COUNT(*) INTO done_count FROM public.collaborations WHERE status = 'completed' AND _profile_id IN (proposer_id, partner_id);
  score := LEAST(100, ROUND((avg_r / 5.0) * 60) + LEAST(done_count, 8) * 5)::int;
  PERFORM set_config('app.internal_update', 'on', true);
  UPDATE public.profiles SET credibility_score = score WHERE id = _profile_id;
  PERFORM set_config('app.internal_update', 'off', true);
END; $$;
REVOKE EXECUTE ON FUNCTION public.recalculate_credibility(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.on_review_inserted()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN PERFORM public.recalculate_credibility(NEW.subject_id); RETURN NEW; END; $$;
CREATE TRIGGER reviews_recalc AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.on_review_inserted();

CREATE OR REPLACE FUNCTION public.on_collab_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
    PERFORM public.recalculate_credibility(NEW.proposer_id);
    PERFORM public.recalculate_credibility(NEW.partner_id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER collaborations_recalc AFTER UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.on_collab_completed();

REVOKE EXECUTE ON FUNCTION public.validate_review() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_review_inserted() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_collab_completed() FROM PUBLIC, anon, authenticated;