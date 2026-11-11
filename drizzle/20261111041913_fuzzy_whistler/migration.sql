ALTER TABLE `session_data` ADD `start_time` integer;--> statement-breakpoint
ALTER TABLE `session_data` ADD `end_time` integer;--> statement-breakpoint
ALTER TABLE `session_data` ADD `amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `session_data` DROP COLUMN `created_at`;