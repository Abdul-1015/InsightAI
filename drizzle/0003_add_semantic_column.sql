-- Add semantic column to datasets table
ALTER TABLE "datasets" ADD COLUMN "semantic" jsonb;

-- Add row_count, columns, profile columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'row_count') THEN
    ALTER TABLE "datasets" ADD COLUMN "row_count" integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'columns') THEN
    ALTER TABLE "datasets" ADD COLUMN "columns" jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'datasets' AND column_name = 'profile') THEN
    ALTER TABLE "datasets" ADD COLUMN "profile" jsonb;
  END IF;
END $$;
