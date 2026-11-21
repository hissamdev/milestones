ALTER TABLE `daily_goals_data` RENAME COLUMN `activity_category_id` TO `activity_id`;--> statement-breakpoint
ALTER TABLE `nested_counter_data` RENAME COLUMN `activity_category_id` TO `activity_id`;--> statement-breakpoint
ALTER TABLE `sub_entries_data` RENAME COLUMN `activity_category_id` TO `activity_id`;--> statement-breakpoint
ALTER TABLE `sub_entries_template` RENAME COLUMN `activity_category_id` TO `activity_id`;