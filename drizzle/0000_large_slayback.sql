CREATE TABLE "academic_milestones" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"institution" varchar(255) NOT NULL,
	"campus" text NOT NULL,
	"degree" varchar(255) NOT NULL,
	"major" varchar(100) NOT NULL,
	"status" varchar(100) NOT NULL,
	"period" varchar(50) NOT NULL,
	"overview" text NOT NULL,
	"disciplines" jsonb NOT NULL,
	"connected_studies" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(100),
	"author_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"group" varchar(100) NOT NULL,
	"group_id" varchar(50) NOT NULL,
	"group_short" varchar(50) NOT NULL,
	"academic_scope" text NOT NULL,
	"framework" text NOT NULL,
	"evidence_type" text NOT NULL,
	"currency_unit" varchar(100) NOT NULL,
	"inputs_classification" text NOT NULL,
	"calculation_basis" text NOT NULL,
	"integrity_status_key" varchar(50) NOT NULL,
	"secondary_status_key" varchar(50),
	"description" text NOT NULL,
	"details" jsonb NOT NULL,
	"tools" jsonb NOT NULL,
	"image_url" text,
	"outcome" text NOT NULL,
	"type" varchar(50) DEFAULT 'Academic Project' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"overview" text NOT NULL,
	"objectives" jsonb NOT NULL,
	"methodology" jsonb NOT NULL,
	"key_findings" jsonb NOT NULL,
	"conclusion" text NOT NULL,
	"recommendations" jsonb NOT NULL,
	"audit_notes" jsonb NOT NULL,
	"formulas" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "case_studies_source_id_unique" UNIQUE("source_id"),
	CONSTRAINT "case_studies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "case_study_discrepancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_study_id" uuid NOT NULL,
	"headline" text NOT NULL,
	"summary" text NOT NULL,
	"details" jsonb NOT NULL,
	"original_values" text NOT NULL,
	"formula_tested" text NOT NULL,
	"status_text" text NOT NULL,
	"preservation_policy" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"domain" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"evidence_label" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"framework_tags" jsonb NOT NULL,
	"related_project" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competencies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "content_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(100) NOT NULL,
	"revision_number" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"author_id" uuid,
	"change_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_study_id" uuid NOT NULL,
	"title" text NOT NULL,
	"headers" jsonb NOT NULL,
	"rows" jsonb NOT NULL,
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"secure_url" text NOT NULL,
	"format" varchar(50),
	"width" integer,
	"height" integer,
	"bytes" integer,
	"alt_text" text,
	"folder" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"site_name" varchar(255) NOT NULL,
	"owner_name" varchar(255) NOT NULL,
	"headline" varchar(255) NOT NULL,
	"taglines" jsonb NOT NULL,
	"bio" text NOT NULL,
	"location" varchar(255) NOT NULL,
	"public_email" varchar(255) NOT NULL,
	"private_phone" varchar(50),
	"phone_privacy_status" varchar(50) DEFAULT 'hidden' NOT NULL,
	"resume_url" text,
	"avatar_url" text,
	"social_links" jsonb NOT NULL,
	"about_summary" text NOT NULL,
	"about_highlights" jsonb NOT NULL,
	"acca_trajectory" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tech_solutions" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" varchar(255) NOT NULL,
	"status" varchar(100) NOT NULL,
	"status_theme" varchar(50) NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"user_role" text NOT NULL,
	"tech_stack" jsonb NOT NULL,
	"features" jsonb NOT NULL,
	"verified_repo" text,
	"verified_demo" text,
	"link_text" varchar(100) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"content_status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"email_verified" timestamp with time zone,
	"image" text,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_study_discrepancies" ADD CONSTRAINT "case_study_discrepancies_case_study_id_case_studies_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_schedules" ADD CONSTRAINT "financial_schedules_case_study_id_case_studies_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "academic_milestones_sort_idx" ON "academic_milestones" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "activity_logs_action_idx" ON "activity_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "case_studies_group_idx" ON "case_studies" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "case_studies_status_idx" ON "case_studies" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "discrepancies_case_study_idx" ON "case_study_discrepancies" USING btree ("case_study_id");--> statement-breakpoint
CREATE INDEX "competencies_domain_idx" ON "competencies" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "competencies_sort_idx" ON "competencies" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "content_revisions_entity_idx" ON "content_revisions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "financial_schedules_case_study_idx" ON "financial_schedules" USING btree ("case_study_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_public_id_idx" ON "media_assets" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "tech_solutions_sort_idx" ON "tech_solutions" USING btree ("sort_order");