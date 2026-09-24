ALTER TABLE `member_profiles` ADD `about` text DEFAULT '' NOT NULL;
ALTER TABLE `profile_images` ADD `title` text DEFAULT '' NOT NULL;
ALTER TABLE `profile_images` ADD `description` text DEFAULT '' NOT NULL;
ALTER TABLE `profile_images` ADD `link_url` text;
