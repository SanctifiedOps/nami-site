CREATE TABLE `directory_search_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`anonymous_session_id` text NOT NULL,
	`search_query` text DEFAULT '' NOT NULL,
	`category_filter` text DEFAULT 'All categories' NOT NULL,
	`location_filter` text DEFAULT 'All areas' NOT NULL,
	`result_count` integer DEFAULT 0 NOT NULL,
	`selected_member_id` text,
	`source_path` text DEFAULT '/network/directory' NOT NULL,
	`dedupe_key` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `directory_search_events_dedupe_key_unique` ON `directory_search_events` (`dedupe_key`);
--> statement-breakpoint
CREATE INDEX `directory_search_events_created_idx` ON `directory_search_events` (`created_at`);
--> statement-breakpoint
CREATE INDEX `directory_search_events_query_idx` ON `directory_search_events` (`search_query`,`created_at`);
--> statement-breakpoint
CREATE INDEX `directory_search_events_type_idx` ON `directory_search_events` (`event_type`,`created_at`);
