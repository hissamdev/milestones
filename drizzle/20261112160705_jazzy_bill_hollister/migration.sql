ALTER TABLE `sessions` ADD `template_id` text REFERENCES routine_templates(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_template_exercises` (
	`id` text PRIMARY KEY,
	`template_id` text NOT NULL,
	`exercise_id` text,
	`display_amount` integer DEFAULT 0 NOT NULL,
	`is_rest_type` integer DEFAULT false NOT NULL,
	`rest_time` integer DEFAULT 0 NOT NULL,
	`use_stopwatch` integer DEFAULT false NOT NULL,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_routine_template_exercises_template_id_routine_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `routine_templates`(`id`),
	CONSTRAINT `fk_routine_template_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_routine_template_exercises`(`id`, `template_id`, `exercise_id`, `display_amount`, `is_rest_type`, `rest_time`, `use_stopwatch`, `sequence`) SELECT `id`, `template_id`, `exercise_id`, `display_amount`, `is_rest_type`, `rest_time`, `use_stopwatch`, `sequence` FROM `routine_template_exercises`;--> statement-breakpoint
DROP TABLE `routine_template_exercises`;--> statement-breakpoint
ALTER TABLE `__new_routine_template_exercises` RENAME TO `routine_template_exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `session_data` DROP COLUMN `rest_time`;