ALTER TABLE `sub_entries_data` ADD `nested_counter_data_id` text REFERENCES nested_counter_data(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `sub_entries_data` ADD `daily_goals_data_id` text REFERENCES daily_goals_data(id) ON DELETE CASCADE;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sub_entries_data` (
	`id` text PRIMARY KEY,
	`nested_counter_data_id` text,
	`daily_goals_data_id` text,
	`timestamp` integer NOT NULL,
	CONSTRAINT `fk_sub_entries_data_nested_counter_data_id_nested_counter_data_id_fk` FOREIGN KEY (`nested_counter_data_id`) REFERENCES `nested_counter_data`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_sub_entries_data_daily_goals_data_id_daily_goals_data_id_fk` FOREIGN KEY (`daily_goals_data_id`) REFERENCES `daily_goals_data`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_sub_entries_data`(`id`, `timestamp`) SELECT `id`, `timestamp` FROM `sub_entries_data`;--> statement-breakpoint
DROP TABLE `sub_entries_data`;--> statement-breakpoint
ALTER TABLE `__new_sub_entries_data` RENAME TO `sub_entries_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;