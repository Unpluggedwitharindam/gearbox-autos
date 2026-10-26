ALTER TABLE public.leads ADD COLUMN lead_type TEXT NOT NULL DEFAULT 'buyer';
ALTER TABLE public.leads ADD COLUMN city TEXT;
ALTER TABLE public.leads ADD COLUMN budget_inr BIGINT;
ALTER TABLE public.leads ADD COLUMN priority TEXT NOT NULL DEFAULT 'warm';
ALTER TABLE public.leads ADD COLUMN follow_up_date DATE;
ALTER TABLE public.leads ADD COLUMN lost_reason TEXT;

CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;
GRANT ALL ON public.lead_notes TO service_role;

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead notes"
ON public.lead_notes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes (lead_id, created_at DESC);
CREATE INDEX idx_leads_follow_up_date ON public.leads (follow_up_date) WHERE follow_up_date IS NOT NULL;