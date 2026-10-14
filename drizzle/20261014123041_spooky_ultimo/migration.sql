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
