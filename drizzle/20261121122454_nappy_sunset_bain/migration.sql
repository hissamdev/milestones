CREATE TABLE `sub_entries_data` (
	`id` text PRIMARY KEY,
	`activity_category_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	CONSTRAINT `fk_sub_entries_data_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_category_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `sub_entries_template` (
	`id` text PRIMARY KEY,
	`activity_category_id` text NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `fk_sub_entries_template_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_category_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
ALTER TABLE `milestones` ADD `use_single` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `nested_counter_data` ADD `activity_category_id` text NOT NULL REFERENCES activity_categories(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `nested_counter_data` ADD `end_time` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_goals_data` (
	`id` text PRIMARY KEY,
	`activity_category_id` text NOT NULL,
	`is_goal_met` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_daily_goals_data_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_category_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_daily_goals_data`(`id`, `activity_category_id`, `is_goal_met`) SELECT `id`, `activity_category_id`, `is_goal_met` FROM `daily_goals_data`;--> statement-breakpoint
DROP TABLE `daily_goals_data`;--> statement-breakpoint
ALTER TABLE `__new_daily_goals_data` RENAME TO `daily_goals_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_nested_counter_data` (
	`id` text PRIMARY KEY,
	`activity_category_id` text NOT NULL,
	`title` text,
	`desc` text,
	`timestamp` integer,
	`start_time` integer,
	`end_time` integer,
	CONSTRAINT `fk_nested_counter_data_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_category_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_nested_counter_data`(`id`, `title`, `desc`, `timestamp`, `start_time`) SELECT `id`, `title`, `desc`, `timestamp`, `start_time` FROM `nested_counter_data`;--> statement-breakpoint
DROP TABLE `nested_counter_data`;--> statement-breakpoint
ALTER TABLE `__new_nested_counter_data` RENAME TO `nested_counter_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `milestones` DROP COLUMN `target_duration`;