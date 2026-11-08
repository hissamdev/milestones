ALTER TABLE `sessions` ADD `is_complete` integer DEFAULT false NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session_data` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`exercise_id` text,
	`created_at` integer NOT NULL,
	`is_rest` integer DEFAULT false NOT NULL,
	`rest_time` integer DEFAULT 0 NOT NULL,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_session_data_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_data_exerciseId_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_session_data`(`id`, `session_id`, `exercise_id`, `created_at`, `is_rest`, `rest_time`, `sequence`) SELECT `id`, `session_id`, `exercise_id`, `created_at`, `is_rest`, `rest_time`, `sequence` FROM `session_data`;--> statement-breakpoint
DROP TABLE `session_data`;--> statement-breakpoint
ALTER TABLE `__new_session_data` RENAME TO `session_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;