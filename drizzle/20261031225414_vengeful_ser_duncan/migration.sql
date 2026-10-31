ALTER TABLE `routine_exercise_data` ADD `exercise_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `exercise_display_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `exercise_desc` text;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `exercise_type` text;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `exercise_reps` integer;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `exercise_duration` integer;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `current_set_start_time` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `current_set_duration` integer;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` ADD `sequence` integer NOT NULL;