ALTER TABLE `session_data` ADD `target_sets` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `session_data` ADD `current_set_num` integer DEFAULT 1 NOT NULL;