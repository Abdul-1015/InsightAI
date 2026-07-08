-- Add patterns column to datasets table
ALTER TABLE "datasets" ADD COLUMN "patterns" jsonb;
