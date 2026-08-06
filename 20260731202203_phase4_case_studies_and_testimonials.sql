/*
# Phase 4: Portfolio case study fields + testimonial verification

## Overview
Upgrades the portfolio_projects table with full case study fields
(problem, research, strategy, design_process, results, before_after,
deliverables, timeline, client_outcome) and adds verification + project
fields to the testimonials table.

## Changes to portfolio_projects
New columns (all nullable text, safe to add):
- problem — the design problem or business challenge
- research — user/market research findings
- strategy — the strategic approach taken
- design_process — detailed design process walkthrough
- results — measurable outcomes and metrics
- before_after — before/after comparison description
- deliverables — list of final deliverables
- timeline — project duration
- client_outcome — the client's business outcome

## Changes to testimonials
New columns:
- project text — the project this testimonial relates to
- verified boolean default false — whether the testimonial is verified

## Security
No RLS policy changes — existing policies already cover these new columns.
*/

-- Portfolio case study fields
DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN problem text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN research text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN strategy text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN design_process text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN results text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN before_after text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN deliverables text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN timeline text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE portfolio_projects ADD COLUMN client_outcome text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Testimonial verification + project
DO $$ BEGIN
  ALTER TABLE testimonials ADD COLUMN project text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE testimonials ADD COLUMN verified boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
