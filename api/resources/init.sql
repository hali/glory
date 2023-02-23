drop table posts;
drop table participants;
drop table episode;
drop table episode_status;
drop table `character`;
drop table `connection`;
drop table connection_type;
drop table player;
drop table branch;

CREATE TABLE `player`
(
 `id`       int NOT NULL AUTO_INCREMENT,
 `nickname` varchar(200) NOT NULL,
 `email` varchar(30) NOT NULL ,
 `info`		text,
 `post`		text,
 
PRIMARY KEY (`id`)
);


CREATE TABLE `branch`
(
 `id`          int NOT NULL AUTO_INCREMENT,
 `name`        varchar(200) NOT NULL ,
 `description` varchar(300) NULL ,

PRIMARY KEY (`id`)
);

CREATE TABLE `character`
(
 `id`          int NOT NULL AUTO_INCREMENT,
 `name`        varchar(200) NOT NULL ,
 `dob`         date NULL ,
 `player_id`   int NULL ,
 `branch_id`   int NULL ,
 `info`		   text NULL,
 `status`	   varchar(2000) NULL,	
 `img`		   varchar(200) NULL,
PRIMARY KEY (`id`),
KEY `fkIdx_54` (`player_id`),
CONSTRAINT `FK_54` FOREIGN KEY `fkIdx_54` (`player_id`) REFERENCES `player` (`id`),
KEY `fkIdx_72` (`branch_id`),
CONSTRAINT `FK_72` FOREIGN KEY `fkIdx_72` (`branch_id`) REFERENCES `branch` (`id`)
);
CREATE UNIQUE INDEX character_name ON `character` (name);

CREATE TABLE `connection_type`
(
 `id`          int NOT NULL AUTO_INCREMENT,
 `description` varchar(45) NOT NULL ,

PRIMARY KEY (`id`)
);

CREATE TABLE `connection`
(
 `character1_id` int NOT NULL ,
 `character2_id` int NOT NULL ,
 `since`         date NULL ,
 `until`         date NULL ,
 `direction`     int NULL ,
 `branch_id`     int NOT NULL ,
 `type`          int NOT NULL ,

PRIMARY KEY (`character1_id`, `character2_id`),
KEY `fkIdx_131` (`type`),
CONSTRAINT `FK_131` FOREIGN KEY `fkIdx_131` (`type`) REFERENCES `connection_type` (`id`),
KEY `fkIdx_75` (`branch_id`),
CONSTRAINT `FK_75` FOREIGN KEY `fkIdx_75` (`branch_id`) REFERENCES `branch` (`id`)
);

CREATE TABLE `episode_status`
(
 `id`          int NOT NULL AUTO_INCREMENT,
 `description` varchar(45) NOT NULL ,

PRIMARY KEY (`id`)
);

CREATE TABLE `episode`
(
 `id`             int NOT NULL AUTO_INCREMENT,
 `name`           varchar(200) NOT NULL ,
 `description`	  text NULL,
 `branch_id`      int NOT NULL ,
 `status_id`      int NOT NULL ,
 `world`		  varchar(1000) NULL,
 `timeOfAction`	  date NULL,
 `author_id`	  int NOT NULL,

PRIMARY KEY (`id`, `name`),
KEY `fkIdx_138` (`status_id`),
CONSTRAINT `FK_138` FOREIGN KEY `fkIdx_138` (`status_id`) REFERENCES `episode_status` (`id`),
KEY `fkIdx_98` (`branch_id`),
CONSTRAINT `FK_98` FOREIGN KEY `fkIdx_98` (`branch_id`) REFERENCES `branch` (`id`),
KEY `fkIdx_398` (`author_id`),
CONSTRAINT `FK_398` FOREIGN KEY `fkIdx_398` (`author_id`) REFERENCES `player` (`id`)
);


CREATE TABLE `participants`
(
 `id`           int NOT NULL AUTO_INCREMENT,
 `character_id` int NOT NULL ,
 `episode_id`   int NOT NULL ,
 `posts_number` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_101` (`character_id`),
CONSTRAINT `FK_101` FOREIGN KEY `fkIdx_101` (`character_id`) REFERENCES `character` (`id`),
KEY `fkIdx_104` (`episode_id`),
CONSTRAINT `FK_104` FOREIGN KEY `fkIdx_104` (`episode_id`) REFERENCES `episode` (`id`)
);
CREATE UNIQUE INDEX participants_ep ON `participants` (character_id, episode_id);


CREATE TABLE `posts`
(
 `id` int NOT NULL AUTO_INCREMENT,
 `author_id`	int NOT NULL,
 `episode_id`	int NOT NULL,
 `body` 		text,
 `added_time`	datetime,
 
 PRIMARY KEY (id),
 CONSTRAINT `FK_105` FOREIGN KEY `fkIdx_105` (`episode_id`) REFERENCES `episode` (`id`),
 CONSTRAINT `FK_post_author` FOREIGN KEY `fkIdx_305` (`author_id`) REFERENCES `character` (`id`)
);

INSERT into branch (name, description) VALUES
('Main', 'Основная ветка'),
('Generic AU-verse', 'Какая-то АУ'),
('Truke', 'Тристан и Люк'),
('Unknown', 'Unknown');

INSERT INTO episode_status (description) VALUES
("Заброшен"),
("Завершен"),
("В процессе"),
("Черновик");

insert into connection_type values 
(1, 'Отец'),
(2, 'Мать'),
(3, 'Дочь'),
(4, 'Сын'),
(5, 'Супруг(а)'),
(6, 'Любовник(-ца)'),
(7, 'Врач'),
(8, 'Пациент(ка)'),
(9, 'Друг/Подруга'),
(10, 'Брат'),
(11, 'Сестра'),
(12, 'Знакомый(-ая)'),
(13, 'Босс'),
(14, 'Подчиненный(-ая)'),
(15, 'Влюблен(а) в'),
(16, 'Соперник'),
(17, 'Родственники'),
(18, 'Все сложно');

INSERT into player (nickname, email) VALUES
('Джереми', '1@1.c');

insert into `character` (name, dob, player_id, info, img) values 
('Джеральд Абернети', '1989-10-23', 1, 'Изгой аристократии, неудачник по жизни, художник в душе, находка для психолога по состоянию и правая рука владельца «La Grande Ville» по факту.', 'tristan.gif'),
('Люк Туртурро', '1984-05-11', 1, 'Мультимиллионер, филантроп, вечный двигатель. Выиграл в лотерею.', 'luke.gif');
