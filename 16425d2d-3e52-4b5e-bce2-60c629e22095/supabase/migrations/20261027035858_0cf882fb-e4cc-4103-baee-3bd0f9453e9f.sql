CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;
CREATE OR REPLACE FUNCTION private.is_collab_participant(_collab_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.collaborations WHERE id = _collab_id AND _user_id IN (proposer_id, partner_id));
$$;
REVOKE EXECUTE ON FUNCTION private.is_collab_participant(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_collab_participant(uuid, uuid) TO authenticated;

DROP POLICY "Participants view milestones" ON public.milestones;
DROP POLICY "Participants add milestones" ON public.milestones;
DROP POLICY "Participants edit milestones" ON public.milestones;
DROP POLICY "Participants delete milestones" ON public.milestones;
CREATE POLICY "Participants view milestones" ON public.milestones FOR SELECT TO authenticated USING (private.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants add milestones" ON public.milestones FOR INSERT TO authenticated WITH CHECK (private.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants edit milestones" ON public.milestones FOR UPDATE TO authenticated USING (private.is_collab_participant(collaboration_id, auth.uid())) WITH CHECK (private.is_collab_participant(collaboration_id, auth.uid()));
CREATE POLICY "Participants delete milestones" ON public.milestones FOR DELETE TO authenticated USING (private.is_collab_participant(collaboration_id, auth.uid()));
DROP FUNCTION public.is_collab_participant(uuid, uuid);