CREATE TABLE `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`page_url` text,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`resolved_at` integer,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `support_tickets_status_idx` ON `support_tickets` (`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `support_tickets_member_idx` ON `support_tickets` (`member_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `network_events` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`venue` text NOT NULL,
	`location` text NOT NULL,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`booking_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`submitted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`reviewed_at` integer,
	`published_at` integer,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `network_events_status_idx` ON `network_events` (`status`,`starts_at`);
--> statement-breakpoint
CREATE INDEX `network_events_member_idx` ON `network_events` (`member_id`,`submitted_at`);
--> statement-breakpoint
CREATE TABLE `owner_alert_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`record_id` text NOT NULL,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`action_url` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_error` text,
	`sent_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `owner_alert_jobs_pending_idx` ON `owner_alert_jobs` (`status`,`next_attempt_at`);
--> statement-breakpoint
CREATE INDEX `owner_alert_jobs_record_idx` ON `owner_alert_jobs` (`kind`,`record_id`);
