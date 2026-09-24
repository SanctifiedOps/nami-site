CREATE TABLE `mailchimp_sync_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_error` text,
	`audience_synced_at` integer,
	`welcome_triggered_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `network_applications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mailchimp_sync_application_idx` ON `mailchimp_sync_jobs` (`application_id`);
--> statement-breakpoint
CREATE INDEX `mailchimp_sync_pending_idx` ON `mailchimp_sync_jobs` (`status`,`next_attempt_at`);
