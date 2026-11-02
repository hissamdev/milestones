ALTER TABLE `routine_exercise_data` ADD `work_amount` integer;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` DROP COLUMN `exercise_reps`;--> statement-breakpoint
ALTER TABLE `routine_exercise_data` DROP COLUMN `exercise_duration`;