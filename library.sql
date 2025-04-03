-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 03, 2025 at 07:41 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `description` text,
  `year_publication` int NOT NULL,
  `img_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `description`, `year_publication`, `img_path`, `category_id`) VALUES
(2, 'Matilda', 'Roald Dahl', 'Matilda est une jeune fille de cinq ans, génie incomprise par ses parents qui la maltraitent. À l\'école, elle rencontre Miss Honey, une enseignante bienveillante, et affronte la redoutable directrice, Miss Trunchbull. Grâce à ses capacités intellectuelles et à ses pouvoirs télékinésiques, Matilda parvient à changer sa destinée.', 1988, 'images/Matilda.jpg', 1),
(3, 'Le Bon Gros Géant', 'Roald Dahl', 'Sophie, une orpheline de huit ans, est enlevée par un géant bienveillant, le BGG, qui souffle des rêves dans les oreilles des enfants. Ensemble, ils combattent des géants malveillants qui dévorent les enfants et parviennent à les faire capturer avec l\'aide de la reine d\'Angleterre.', 1982, 'images/LeBGG.jpg', 2),
(4, 'Moi, Boy', 'Roald Dahl', 'Cette autobiographie relate l\'enfance de Roald Dahl, de ses premières années jusqu\'à son départ de l\'école. Il décrit la vie en Grande-Bretagne dans les années 1920 et 1930, son expérience dans le système scolaire et comment ces événements ont influencé sa carrière d\'écrivain.', 1984, 'images/MoiBoy.jpg', 3),
(5, 'Charlie et la Chocolaterie', 'Roald Dahl', 'Charlie Bucket, un enfant pauvre, remporte un ticket d\'or lui permettant de visiter la chocolaterie de Willy Wonka, un chocolatier excentrique. Accompagné de quatre autres enfants, chacun représentant un vice, Charlie découvre un monde magique et finit par hériter de la chocolaterie.', 1964, 'images/Chocolaterie.jpg', 2),
(6, 'Charlie et l\'Ascenseur de Verre', 'Roald Dahl', 'Suite de \"Charlie et la Chocolaterie\", ce livre suit Charlie et Willy Wonka dans un ascenseur vitré volant, où ils vivent de nouvelles aventures, notamment une rencontre avec des extraterrestres appelés les Vermicious Knids.', 1972, 'images/AscenseurVerre.jpg', 2),
(7, 'James et la Grosse Pêche', 'Roald Dahl', 'James, un jeune garçon orphelin, découvre une pêche géante habitée par des insectes anthropomorphes. Ensemble, ils entreprennent un voyage fantastique à travers l\'océan, échappant à ses tantes cruelles et découvrant un nouveau monde.', 1961, 'images/JamesGrossePeche.jpg', 2),
(8, 'George et la Potion Magique', 'Roald Dahl', 'George crée une potion magique pour punir sa grand-mère méchante, mais les effets de la potion deviennent incontrôlables, entraînant des situations comiques et absurdes.', 1981, 'images/PotionMagique.jpg', 2),
(9, 'Le Doigt Magique', 'Roald Dahl', 'Une jeune fille possède un doigt magique qui punit les personnes qui la contrarient. Lorsqu\'elle l\'utilise contre une famille de chasseurs, elle les transforme en oiseaux, leur faisant vivre une expérience qui change leur perspective.', 1966, 'images/LeDoigtMagique.jpg', 5),
(10, 'Les Deux Gredins', 'Roald Dahl', 'Ce livre raconte l\'histoire de deux personnages méchants, M. Gredin et Mme Gredin, qui se livrent à des actes cruels. Leur méchanceté est finalement punie de manière humoristique et imaginative.', 1980, 'images/LesDeuxgredins.jpg', 4),
(11, 'Maître Renard', 'Roald Dahl', 'Maître Renard, rusé et intelligent, vole de la nourriture à trois fermiers avares pour nourrir sa famille. Malgré leurs efforts pour l\'attraper, il parvient toujours à les déjouer.', 1970, 'images/MaitreRenard.jpg', 2),
(12, 'Sacrées Sorcières', 'Roald Dahl', 'Un jeune garçon découvre un complot de sorcières qui veulent transformer tous les enfants en souris. Avec l\'aide de sa grand-mère, il doit déjouer leurs plans et les vaincre.', 1983, 'images/SacreesSorcieres.jpg', 6);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(3, 'Biographie'),
(5, 'Conte'),
(2, 'Fantaisie'),
(6, 'Horreur'),
(4, 'Humour'),
(1, 'Roman jeunesse');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `comment_date` datetime DEFAULT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`user_id`, `book_id`, `comment_date`, `text`) VALUES
(2, 2, '2025-03-25 08:03:29', 'test'),
(2, 4, '2025-03-25 10:53:14', 'incroyable !'),
(2, 5, '2025-03-27 18:20:53', 'cool :)'),
(3, 2, '2025-03-25 15:47:35', 'Trop de la frappe matilda , j\'ai kiffé \r\nOYOYOY'),
(4, 4, '2025-03-24 22:22:01', 'yes'),
(4, 7, '2025-03-24 22:20:03', 'non !'),
(6, 9, '2025-03-25 08:34:04', 'je trouve que ce livre réussit vraiment à développer les capacités cognitives et intellectuelles de ses lecteurs malgré le fait que l\'auteur de celui-ci soit un britannique de merde');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registration_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `password`, `registration_date`, `is_active`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'user', 'ophelia', 'ochheak@gmail.com', '$2b$10$S60tl24z8Ydeaezl5dsUEeHtLechpkOrWSzk1.wGss790MlFOKaMG', '2025-03-20 19:21:34', 1, 0, '2025-03-20 19:21:34', '2025-03-20 19:21:34'),
(2, 'user', 'Test', 'test@gmail.com', '$2b$10$LaiKwDIAIv8YhYJq8m88/u73836jvvNgR8iDdCWtLvYqz.0CjG.mm', '2025-03-22 10:43:56', 1, 0, '2025-03-22 10:43:56', '2025-03-27 18:21:31'),
(3, 'user', 'miled', 'oyoy@gmail.com', '$2b$10$D3YBpM/hwNTjfIwakVyPsOtRqYXoUpOXMVTWKs0v06SFsbuu16Arm', '2025-03-25 15:46:02', 1, 0, '2025-03-25 15:46:02', '2025-03-25 15:46:02'),
(4, 'user', 'Nirzara', 'nirza@gmail.com', '$2b$10$fiaVfw7YZfUvyDWz9SKPqeuOEJru9rg.6kYNax2QWF.sMSTjswFnG', '2025-03-24 11:01:46', 1, 0, '2025-03-24 11:01:46', '2025-03-24 11:01:46'),
(5, 'user', 'lama', 'shaina@gmail.com', '$2b$10$4SCc2/6LGwEs2esVRdjNPebaNKGEhqmihsDhN9JeIEnloq8Or4yfi', '2025-03-24 11:12:37', 1, 0, '2025-03-24 11:12:37', '2025-03-24 11:12:37'),
(6, 'user', 'non', 'non@gmail.com', '$2b$10$asdTk1F/AiY2m60fMKp7PuwGN5uwIKv6hha02Oh5.hVaNHfUgNgLa', '2025-03-25 08:08:28', 1, 0, '2025-03-25 08:08:28', '2025-03-25 08:08:28'),
(7, 'user', 'CACA', 'CACA@CACA.COM', '$2b$10$o.F5xRYD/.nsobvrU/nRGul/.ARb0xg5gNg/33Z4LljWprJnNRJ82', '2025-03-25 08:55:11', 1, 0, '2025-03-25 08:55:11', '2025-03-25 08:55:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD UNIQUE KEY `comment_user_id_book_id_comment_date` (`user_id`,`book_id`,`comment_date`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
