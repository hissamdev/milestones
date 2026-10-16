CREATE TABLE `exercises` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`desc` text
);
--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY,
	`routine_id` text NOT NULL,
	`exercise_id` text,
	`rest_time` integer,
	`sequence` integer NOT NULL,
	CONSTRAINT `fk_routine_exercises_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`),
	CONSTRAINT `fk_routine_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL
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
	`workoutId` text NOT NULL,
	`exerciseId` text NOT NULL,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL,
	`repitition` integer NOT NULL,
	CONSTRAINT `fk_standalone_exercises_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`),
	CONSTRAINT `fk_standalone_exercises_exerciseId_exercises_id_fk` FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY,
	`created_at` integer NOT NULL,
	`creation_day` text NOT NULL
);
