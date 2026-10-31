ALTER TABLE `routine_tl_data` RENAME COLUMN `completion` TO `completion_percentage`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_tl_data` (
	`id` text PRIMARY KEY,
	`routine_id` text NOT NULL,
	`interaction_time` integer NOT NULL,
	`completion_percentage` integer NOT NULL,
	`is_complete` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_routine_tl_data_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_routine_tl_data`(`id`, `routine_id`, `interaction_time`, `completion_percentage`, `is_complete`) SELECT `id`, `routine_id`, `interaction_time`, `completion_percentage`, `is_complete` FROM `routine_tl_data`;--> statement-breakpoint
DROP TABLE `routine_tl_data`;--> statement-breakpoint
ALTER TABLE `__new_routine_tl_data` RENAME TO `routine_tl_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;