-- Add dashboard_spec column to datasets table
ALTER TABLE "datasets" ADD COLUMN "dashboard_spec" jsonb;
