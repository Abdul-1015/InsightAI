CREATE TABLE "datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"file_type" text NOT NULL,
	"size" integer NOT NULL,
	"row_count" integer NOT NULL,
	"columns" text[] NOT NULL,
	"file_path" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
