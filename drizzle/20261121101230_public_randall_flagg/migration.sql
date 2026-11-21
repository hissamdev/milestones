CREATE TABLE `activity_categories` (
	`id` text PRIMARY KEY,
	`milestone_id` text NOT NULL,
	`name` text,
	`target_duration` integer,
	CONSTRAINT `fk_activity_categories_milestone_id_milestones_id_fk` FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `daily_goals_data` (
	`id` text PRIMARY KEY,
	`data_id` text,
	`activity_category_id` text,
	`is_goal_met` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_daily_goals_data_data_id_milestones_data_id_fk` FOREIGN KEY (`data_id`) REFERENCES `milestones_data`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_daily_goals_data_activity_category_id_activity_categories_id_fk` FOREIGN KEY (`activity_category_id`) REFERENCES `activity_categories`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `milestones_data` (
	`id` text PRIMARY KEY,
	`milestone_id` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_milestones_data_milestone_id_milestones_id_fk` FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`enable_categories` integer DEFAULT false NOT NULL,
	`type` text NOT NULL,
	`target_duration` integer
);
--> statement-breakpoint
CREATE TABLE `nested_counter_data` (
	`id` text PRIMARY KEY,
	`data_id` text NOT NULL,
	`title` text,
	`desc` text,
	`timestamp` integer,
	`start_time` integer,
	CONSTRAINT `fk_nested_counter_data_data_id_milestones_data_id_fk` FOREIGN KEY (`data_id`) REFERENCES `milestones_data`(`id`) ON DELETE CASCADE
);
