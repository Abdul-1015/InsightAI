-- Drop existing datasets table if it exists
DROP TABLE IF EXISTS "datasets";

-- Create new datasets table with required fields
CREATE TABLE "datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"stored_name" text NOT NULL,
	"file_type" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'uploaded' NOT NULL
);

-- Add foreign key constraint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

-- Create index for user_id
CREATE INDEX "datasets_user_id_idx" ON "datasets" USING btree ("user_id");
