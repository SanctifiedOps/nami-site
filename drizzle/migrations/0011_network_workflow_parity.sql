ALTER TABLE `network_applications` ADD `suggested_bio` text;
--> statement-breakpoint
ALTER TABLE `network_applications` ADD `bio_generation_status` text DEFAULT 'pending' NOT NULL;
--> statement-breakpoint
ALTER TABLE `network_applications` ADD `bio_generation_error` text;
--> statement-breakpoint
ALTER TABLE `mailchimp_sync_jobs` ADD `contact_status` text;
--> statement-breakpoint
CREATE TABLE `bio_generation_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_error` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `network_applications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bio_generation_application_idx` ON `bio_generation_jobs` (`application_id`);
--> statement-breakpoint
CREATE INDEX `bio_generation_pending_idx` ON `bio_generation_jobs` (`status`,`next_attempt_at`);
