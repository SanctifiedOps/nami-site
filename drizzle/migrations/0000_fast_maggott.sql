CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_provider_account_idx` ON `account` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE TABLE `email_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text,
	`recipient` text NOT NULL,
	`template` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_error` text,
	`sent_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `email_jobs_pending_idx` ON `email_jobs` (`status`,`next_attempt_at`);--> statement-breakpoint
CREATE TABLE `member_invites` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`redeemed_at` integer,
	`revoked_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_invites_token_hash_unique` ON `member_invites` (`token_hash`);--> statement-breakpoint
CREATE INDEX `member_invites_member_idx` ON `member_invites` (`member_id`);--> statement-breakpoint
CREATE TABLE `member_profiles` (
	`member_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`location` text NOT NULL,
	`primary_group` text NOT NULL,
	`speciality` text NOT NULL,
	`bio` text NOT NULL,
	`website_url` text,
	`instagram_url` text,
	`facebook_url` text,
	`linkedin_url` text,
	`tiktok_url` text,
	`youtube_url` text,
	`profile_image_key` text,
	`published` integer DEFAULT true NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `profiles_group_idx` ON `member_profiles` (`primary_group`,`published`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_normalized` text NOT NULL,
	`auth_user_id` text,
	`account_status` text DEFAULT 'invited' NOT NULL,
	`approval_status` text DEFAULT 'approved' NOT NULL,
	`joined_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`invited_at` integer,
	`last_login_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_normalized_unique` ON `members` (`email_normalized`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_auth_user_id_unique` ON `members` (`auth_user_id`);--> statement-breakpoint
CREATE INDEX `members_status_idx` ON `members` (`account_status`,`approval_status`);--> statement-breakpoint
CREATE TABLE `network_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`display_name` text NOT NULL,
	`location` text NOT NULL,
	`requested_category` text NOT NULL,
	`bio` text NOT NULL,
	`website_url` text,
	`instagram_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`submitted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`reviewed_at` integer
);
--> statement-breakpoint
CREATE INDEX `applications_status_idx` ON `network_applications` (`status`);--> statement-breakpoint
CREATE TABLE `profile_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`actor_user_id` text NOT NULL,
	`changed_fields` text NOT NULL,
	`before_json` text NOT NULL,
	`after_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `profile_audit_member_idx` ON `profile_audit_log` (`member_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `profile_images` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`position` integer NOT NULL,
	`alt_text` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`content_type` text NOT NULL,
	`status` text DEFAULT 'uploading' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_images_r2_key_unique` ON `profile_images` (`r2_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_images_member_position_idx` ON `profile_images` (`member_id`,`position`);--> statement-breakpoint
CREATE INDEX `profile_images_member_idx` ON `profile_images` (`member_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `sheet_sync_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_error` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sheet_sync_pending_idx` ON `sheet_sync_jobs` (`status`,`next_attempt_at`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);