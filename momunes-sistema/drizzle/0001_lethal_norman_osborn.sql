CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255),
	`eventDate` timestamp NOT NULL,
	`endDate` timestamp,
	`maxSpots` int,
	`activityType` enum('acolhimento','educacao','empoderamento','atuacao_politica','outro') NOT NULL DEFAULT 'outro',
	`status` enum('ativo','encerrado','cancelado') NOT NULL DEFAULT 'ativo',
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(30),
	`address` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`area` enum('acolhimento','educacao','empoderamento','atuacao_politica','outro') NOT NULL DEFAULT 'outro',
	`status` enum('planejamento','em_andamento','concluido','suspenso') NOT NULL DEFAULT 'planejamento',
	`startDate` timestamp,
	`endDate` timestamp,
	`responsibleName` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`participantName` varchar(255) NOT NULL,
	`participantEmail` varchar(320),
	`participantPhone` varchar(30),
	`activityType` varchar(100),
	`notes` text,
	`status` enum('confirmada','cancelada','lista_espera') NOT NULL DEFAULT 'confirmada',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
