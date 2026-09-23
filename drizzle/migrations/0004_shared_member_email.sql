DROP INDEX IF EXISTS `members_email_normalized_unique`;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `members_email_normalized_idx` ON `members` (`email_normalized`);
