PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_exercise_data` (
	`id` text PRIMARY KEY,
	`routine_id` text,
	`parent_metadata_id` text NOT NULL,
	`exercise_id` text,
	`is_rest` integer,
	`exercise_name` text,
	`exercise_display_name` text,
	`exercise_desc` text,
	`exercise_type` text,
	`exercise_reps` integer,
	`exercise_duration` integer,
	`current_set_start_time` integer NOT NULL,
	`current_set_end_time` integer,
	`current_set_duration` integer,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_routine_exercise_data_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`),
	CONSTRAINT `fk_routine_exercise_data_parent_metadata_id_routine_tl_data_id_fk` FOREIGN KEY (`parent_metadata_id`) REFERENCES `routine_tl_data`(`id`),
	CONSTRAINT `fk_routine_exercise_data_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_routine_exercise_data`(`id`, `routine_id`, `parent_metadata_id`, `exercise_id`, `is_rest`, `exercise_name`, `exercise_display_name`, `exercise_desc`, `exercise_type`, `exercise_reps`, `exercise_duration`, `current_set_start_time`, `current_set_end_time`, `current_set_duration`, `sequence`) SELECT `id`, `routine_id`, `parent_metadata_id`, `exercise_id`, `is_rest`, `exercise_name`, `exercise_display_name`, `exercise_desc`, `exercise_type`, `exercise_reps`, `exercise_duration`, `current_set_start_time`, `current_set_end_time`, `current_set_duration`, `sequence` FROM `routine_exercise_data`;--> statement-breakpoint
DROP TABLE `routine_exercise_data`;--> statement-breakpoint
ALTER TABLE `__new_routine_exercise_data` RENAME TO `routine_exercise_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;