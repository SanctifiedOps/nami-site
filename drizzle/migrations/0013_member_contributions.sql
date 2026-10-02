CREATE TABLE `contributions` (
  `id` text PRIMARY KEY NOT NULL,
  `member_id` text NOT NULL,
  `format` text NOT NULL,
  `title` text DEFAULT '' NOT NULL,
  `slug` text,
  `summary` text DEFAULT '' NOT NULL,
  `content_json` text NOT NULL,
  `plain_text` text DEFAULT '' NOT NULL,
  `status` text DEFAULT 'draft' NOT NULL,
  `featured` integer DEFAULT false NOT NULL,
  `commercial_content` integer DEFAULT false NOT NULL,
  `original_work_confirmed` integer DEFAULT false NOT NULL,
  `image_rights_confirmed` integer DEFAULT false NOT NULL,
  `no_generated_text_confirmed` integer DEFAULT false NOT NULL,
  `submitted_content_hash` text,
  `approved_content_hash` text,
  `admin_feedback` text,
  `reviewer_id` text,
  `submitted_at` integer,
  `reviewed_at` integer,
  `scheduled_at` integer,
  `published_at` integer,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contributions_slug_unique` ON `contributions` (`slug`);
--> statement-breakpoint
CREATE INDEX `contributions_member_status_idx` ON `contributions` (`member_id`,`status`,`updated_at`);
--> statement-breakpoint
CREATE INDEX `contributions_publication_idx` ON `contributions` (`status`,`published_at`);
--> statement-breakpoint
CREATE TABLE `contribution_versions` (
  `id` text PRIMARY KEY NOT NULL,
  `contribution_id` text NOT NULL,
  `member_id` text NOT NULL,
  `version_number` integer NOT NULL,
  `reason` text NOT NULL,
  `title` text NOT NULL,
  `summary` text NOT NULL,
  `content_json` text NOT NULL,
  `content_hash` text NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`contribution_id`) REFERENCES `contributions`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contribution_versions_number_idx` ON `contribution_versions` (`contribution_id`,`version_number`);
--> statement-breakpoint
CREATE TABLE `contribution_assets` (
  `id` text PRIMARY KEY NOT NULL,
  `contribution_id` text NOT NULL,
  `member_id` text NOT NULL,
  `r2_key` text NOT NULL,
  `kind` text NOT NULL,
  `alt_text` text DEFAULT '' NOT NULL,
  `caption` text DEFAULT '' NOT NULL,
  `position` integer DEFAULT 0 NOT NULL,
  `width` integer NOT NULL,
  `height` integer NOT NULL,
  `content_type` text NOT NULL,
  `status` text DEFAULT 'uploading' NOT NULL,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`contribution_id`) REFERENCES `contributions`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contribution_assets_r2_key_unique` ON `contribution_assets` (`r2_key`);
--> statement-breakpoint
CREATE INDEX `contribution_assets_contribution_idx` ON `contribution_assets` (`contribution_id`,`position`);
--> statement-breakpoint
CREATE TABLE `contribution_moderation_events` (
  `id` text PRIMARY KEY NOT NULL,
  `contribution_id` text NOT NULL,
  `actor_member_id` text,
  `event_type` text NOT NULL,
  `note` text,
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  FOREIGN KEY (`contribution_id`) REFERENCES `contributions`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`actor_member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `contribution_moderation_timeline_idx` ON `contribution_moderation_events` (`contribution_id`,`created_at`);
