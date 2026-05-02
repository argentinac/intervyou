-- interview_scoring_detail
-- Stores the full per-axis breakdown of every scored interview.
-- Allows auditing exactly how each final score was computed.

CREATE TABLE interview_scoring_detail (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id  uuid        NOT NULL REFERENCES interviews(id)  ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,

  -- 'HR' or 'TECHNICAL'
  interview_type  text  NOT NULL CHECK (interview_type IN ('HR', 'TECHNICAL')),

  -- Base axes (0-100 each; null = not measurable for this response)
  clarity         numeric(5,2),
  structure       numeric(5,2),
  role_relevance  numeric(5,2),
  base_score      numeric(6,3),   -- weighted average of measured base axes
  base_axes_measured   integer,   -- how many base axes were scored (1-3)

  -- Content axes HR (null when interview is TECHNICAL or axis not measurable)
  narrative_coherence  numeric(5,2),
  reflection_depth     numeric(5,2),
  concrete_evidence    numeric(5,2),

  -- Content axes TECHNICAL (null when interview is HR or axis not measurable)
  technical_correctness    numeric(5,2),
  depth                    numeric(5,2),
  problem_solving_evidence numeric(5,2),

  content_score          numeric(6,3),   -- weighted average of measured content axes
  content_axes_measured  integer,        -- how many content axes were scored (1-3)

  -- Score computation
  pre_penalty_score  numeric(8,4),  -- base*w + content*w before any penalty
  final_score        integer,       -- clamped 0-1000 after penalties (null = not enough data)

  -- Quality indicators
  confidence   text  CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH')),
  score_label  text,

  -- Penalties applied (JSON array, may be empty)
  penalties_applied  jsonb  NOT NULL DEFAULT '[]'::jsonb,

  -- Full result snapshot — exact object returned by scoring.js
  scoring_result  jsonb  NOT NULL,

  created_at  timestamptz  NOT NULL DEFAULT now()
);

-- Users can only read their own scoring details
ALTER TABLE interview_scoring_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own scoring detail"
  ON interview_scoring_detail
  FOR SELECT
  USING (auth.uid() = user_id);

-- Lookup indexes
CREATE INDEX idx_scoring_detail_interview_id  ON interview_scoring_detail(interview_id);
CREATE INDEX idx_scoring_detail_user_id       ON interview_scoring_detail(user_id);
