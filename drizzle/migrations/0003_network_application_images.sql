ALTER TABLE `network_applications` ADD `profile_image_key` text;
--> statement-breakpoint
ALTER TABLE `members` ADD `first_name` text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE `member_profiles` SET `profile_image_key` = 'network-members/ellie-grassick/profile/imported-2026-09-21.webp' WHERE `member_id` = 'ellie-grassick' AND (`profile_image_key` IS NULL OR `profile_image_key` = '');
--> statement-breakpoint
UPDATE `member_profiles` SET `profile_image_key` = 'network-members/joe-wilson-nami-creative/profile/imported-2026-09-21.webp' WHERE `member_id` = 'joe-wilson-nami-creative' AND (`profile_image_key` IS NULL OR `profile_image_key` = '');
--> statement-breakpoint
INSERT OR IGNORE INTO `sheet_sync_jobs` (`id`, `member_id`, `status`, `attempts`, `next_attempt_at`, `created_at`, `updated_at`) VALUES ('migration-profile-image-ellie', 'ellie-grassick', 'pending', 0, unixepoch() * 1000, unixepoch() * 1000, unixepoch() * 1000);
--> statement-breakpoint
INSERT OR IGNORE INTO `sheet_sync_jobs` (`id`, `member_id`, `status`, `attempts`, `next_attempt_at`, `created_at`, `updated_at`) VALUES ('migration-profile-image-joe', 'joe-wilson-nami-creative', 'pending', 0, unixepoch() * 1000, unixepoch() * 1000, unixepoch() * 1000);
