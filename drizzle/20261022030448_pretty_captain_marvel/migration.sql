CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`data_id` text NOT NULL,
	CONSTRAINT `fk_images_data_id_milestone_data_id_fk` FOREIGN KEY (`data_id`) REFERENCES `milestone_data`(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestone_data` (
	`id` text PRIMARY KEY,
	`milestone_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	`device` text,
	`start` integer,
	`stop` integer,
	`duration` integer,
	`switchToggle` text,
	`note` text,
	CONSTRAINT `fk_milestone_data_milestone_id_milestones_id_fk` FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`emoji` text,
	`desc` text,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `days_otw` (
	`id` text PRIMARY KEY,
	`routine_id` text NOT NULL,
	`routine_template_id` text,
	`day_title` text NOT NULL,
	CONSTRAINT `fk_days_otw_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`),
	CONSTRAINT `fk_days_otw_routine_template_id_routine_templates_id_fk` FOREIGN KEY (`routine_template_id`) REFERENCES `routine_templates`(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`name` text NOT NULL UNIQUE,
	`display_name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `routine_tl_data` (
	`id` text PRIMARY KEY,
	`routine_id` text NOT NULL,
	`interaction_time` integer NOT NULL,
	`completion` integer NOT NULL,
	`is_complete` integer NOT NULL,
	CONSTRAINT `fk_routine_tl_data_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`)
);
--> statement-breakpoint
CREATE TABLE `routine_exercise_data` (
	`id` text PRIMARY KEY,
	`routine_id` text,
	`parent_metadata_id` text NOT NULL,
	`exercise_id` text,
	CONSTRAINT `fk_routine_exercise_data_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`),
	CONSTRAINT `fk_routine_exercise_data_parent_metadata_id_routine_tl_data_id_fk` FOREIGN KEY (`parent_metadata_id`) REFERENCES `routine_tl_data`(`id`),
	CONSTRAINT `fk_routine_exercise_data_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `routine_template_exercises` (
	`id` text PRIMARY KEY,
	`template_id` text NOT NULL,
	`exercise_id` text,
	`rest_time` integer,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_routine_template_exercises_template_id_routine_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `routine_templates`(`id`),
	CONSTRAINT `fk_routine_template_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `routine_templates` (
	`id` text PRIMARY KEY,
	`restDay` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_data` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`exerciseId` text,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	`rest_time` integer,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_session_data_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`),
	CONSTRAINT `fk_session_data_exerciseId_exercises_id_fk` FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`workout_id` text NOT NULL,
	`routineId` text,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	CONSTRAINT `fk_sessions_workout_id_workouts_id_fk` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`),
	CONSTRAINT `fk_sessions_routineId_routines_id_fk` FOREIGN KEY (`routineId`) REFERENCES `routines`(`id`)
);
--> statement-breakpoint
CREATE TABLE `standalone_exercises` (
	`id` text PRIMARY KEY,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	`repetition` integer NOT NULL,
	CONSTRAINT `fk_standalone_exercises_workout_id_workouts_id_fk` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`),
	CONSTRAINT `fk_standalone_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL
);
