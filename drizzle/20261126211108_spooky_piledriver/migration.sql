ALTER TABLE `sub_entries_data` ADD `sub_entries_template_id` text NOT NULL REFERENCES sub_entries_template(id) ON DELETE CASCADE;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_nested_counter_data` (
	`id` text PRIMARY KEY,
	`milestone_id` text NOT NULL,
	`activity_id` text NOT NULL,
	`title` text,
	`desc` text,
	`timestamp` integer NOT NULL,
	`start_time` integer,
	`end_time` integer,
	CONSTRAINT `fk_nested_counter_data_milestone_id_milestones_id_fk` FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_nested_counter_data_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_nested_counter_data`(`id`, `milestone_id`, `activity_id`, `title`, `desc`, `timestamp`, `start_time`, `end_time`) SELECT `id`, `milestone_id`, `activity_id`, `title`, `desc`, `timestamp`, `start_time`, `end_time` FROM `nested_counter_data`;--> statement-breakpoint
DROP TABLE `nested_counter_data`;--> statement-breakpoint
ALTER TABLE `__new_nested_counter_data` RENAME TO `nested_counter_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;