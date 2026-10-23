ALTER TABLE `routine_template_exercises` ADD `display_amount` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_template_exercises` (
	`id` text PRIMARY KEY,
	`template_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`display_amount` integer,
	`rest_time` integer,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_routine_template_exercises_template_id_routine_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `routine_templates`(`id`),
	CONSTRAINT `fk_routine_template_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_routine_template_exercises`(`id`, `template_id`, `exercise_id`, `rest_time`, `sequence`) SELECT `id`, `template_id`, `exercise_id`, `rest_time`, `sequence` FROM `routine_template_exercises`;--> statement-breakpoint
DROP TABLE `routine_template_exercises`;--> statement-breakpoint
ALTER TABLE `__new_routine_template_exercises` RENAME TO `routine_template_exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;