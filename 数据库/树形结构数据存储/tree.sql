CREATE TABLE `tree` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

insert into `tree` (`id`, `name`, `parent_id`) values (1, 'food', NULL);
insert into `tree` (`id`, `name`, `parent_id`) values (2, 'fruit', 1);
insert into `tree` (`id`, `name`, `parent_id`) values (3, 'red', 2);
insert into `tree` (`id`, `name`, `parent_id`) values (4, 'cherry', 3);
insert into `tree` (`id`, `name`, `parent_id`) values (5, 'yellow', 2);
insert into `tree` (`id`, `name`, `parent_id`) values (6, 'banana', 5);
insert into `tree` (`id`, `name`, `parent_id`) values (7, 'meat', 1);
insert into `tree` (`id`, `name`, `parent_id`) values (8, 'beef', 7);
insert into `tree` (`id`, `name`, `parent_id`) values (9, 'pork', 7);
