CREATE TABLE `friends` (
	`id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`username` text NOT NULL,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`game` text NOT NULL,
	`points` integer NOT NULL,
	`members` text NOT NULL,
	`image` text,
	`description` text,
	`isStarted` integer
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`game` text NOT NULL,
	`image` text,
	`description` text,
	`isPublic` integer NOT NULL,
	`admins` text NOT NULL,
	`members` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` text NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL,
	`game` text NOT NULL,
	`army` text NOT NULL,
	`points` integer NOT NULL,
	`actualPoints` integer,
	`groups` text NOT NULL,
	`image` text,
	`description` text,
	`isDeleted` integer DEFAULT false NOT NULL
);
