-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2023 at 02:26 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `neuaietutor`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `courseId` varchar(50) NOT NULL,
  `courseName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `courseId`, `courseName`) VALUES
(1, 'C001', 'Introduction to Robotics'),
(2, 'C002', 'Robotics Programming');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL,
  `studentId` varchar(50) DEFAULT NULL,
  `courseId` varchar(50) DEFAULT NULL,
  `topics` varchar(255) DEFAULT NULL,
  `scores` varchar(255) DEFAULT NULL,
  `accuracy` varchar(50) DEFAULT NULL,
  `promptEfficiency` varchar(50) DEFAULT NULL,
  `timeEfficiency` varchar(50) DEFAULT NULL,
  `dateModified` varchar(50) DEFAULT NULL,
  `total` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `studentId`, `courseId`, `topics`, `scores`, `accuracy`, `promptEfficiency`, `timeEfficiency`, `dateModified`, `total`) VALUES
(1, 'S1', 'C1', '[\"Data structures\", \"Algorithms\", \"Functions\"]', '[70, 50, 80]', '30', '40', '50', '2023-07-13', '200'),
(2, 'S2', 'C1', '[\"Data structures\", \"Algorithms\", \"Functions\"]', '[60, 65, 75]', '10', '11', '60', '2023-07-13', '200'),
(3, 'S3', 'C2', '[\"Arrays\", \"Sorting\", \"Recursion\"]', '[85, 75, 90]', '10', '25', '50', '2023-07-13', '250'),
(4, 'S001', 'C001', 'a:6:{i:0;s:15:\"Data structures\";i:1;s:11:\"Algorithmss\";i:2;s:22:\"Study 1: Encapsulation\";i:3;s:22:\"To Learn: OOP with C++\";i:4;s:17:\"Robot Programming\";i:5;s:24:\"Introduction to Robotics\";}', 'a:6:{i:0;i:90;i:1;i:120;i:2;s:1:\"0\";i:3;s:1:\"0\";i:4;s:1:\"0\";i:5;s:17:\"38.46153846153847\";}', '0.00', '57.11', '30', '2023-07-16 15:23:44', '10.89'),
(6, 'STD020', 'C001', 'a:1:{i:0;s:12:\"Robot Vision\";}', 'a:1:{i:0;s:5:\"80.35\";}', '100.00', '27.78', '15', '2023-07-18 01:48:21', '80.35'),
(8, 'STD020', 'C002', 'a:1:{i:0;s:27:\"Arrays and Their Operations\";}', 'a:1:{i:0;s:5:\"78.47\";}', '100.00', '12.80', '15', '2023-07-21 05:37:33', '78.47');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `sectionId` varchar(50) NOT NULL,
  `topicId` varchar(50) NOT NULL,
  `courseId` varchar(50) NOT NULL,
  `sectionName` varchar(255) DEFAULT NULL,
  `instructions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`instructions`)),
  `duration` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `sectionId`, `topicId`, `courseId`, `sectionName`, `instructions`, `duration`, `image`) VALUES
(1, 'SEC001', 'T001', 'C001', 'Introduction to Robotics', '[\"Learn the basics of robotics\", \"Understand robot components and functionality\"]', 30, 'coursefiles/neugpt.mp4'),
(2, 'SEC002', 'T001', 'C001', 'Robot Sensors', '[\"Explore different types of sensors used in robotics\", \"Learn how sensors enable robots to perceive their environment\"]', 30, 'courseFiles/robotsensors.jpg'),
(3, 'SEC003', 'T001', 'C001', 'Robot Programming', '[\"Introduction to robot programming languages\", \"What programming languages are commonly used in robotics?\"]', 30, 'courseFiles/robotprogramming.jpg'),
(4, 'SEC004', 'T002', 'C001', 'Robotics Mechanics', '[\"Study mechanical design principles in robotics\", \"Learn about robot joints, linkages, and mechanisms\"]', 30, 'coursefiles/neugpt.mp4'),
(5, 'SEC005', 'T002', 'C001', 'Robot Kinematics', '[\"Understand robot motion and kinematic analysis\", \"Study forward and inverse kinematics\"]', 30, 'coursefiles/robotics1.png'),
(6, 'SEC006', 'T002', 'C001', 'Artificial Intelligence in Robotics', '[\"Explore AI techniques used in robotics\", \"Apply machine learning to enhance robot capabilities\"]', 30, 'coursefiles/robotics2.png'),
(7, 'SEC007', 'T003', 'C001', 'Robot Vision', '[\"Understand computer vision in robotics\", \"Learn about object recognition and tracking\"]', 30, 'coursefiles/robotvision.mp4'),
(8, 'SEC008', 'T003', 'C001', 'Robot Manipulation', '[\"Study robot manipulation techniques\", \"Learn about grippers and motion planning\"]', 30, 'coursefiles/robotics2.png'),
(9, 'SEC009', 'T004', 'C001', 'Robot Localization and Mapping', '[\"Explore techniques for robot localization and mapping\", \"Understand SLAM algorithms\"]', 30, 'coursefiles/robotlocalization.jpg'),
(10, 'SEC010', 'T004', 'C001', 'Robot Ethics', '[\"Discuss ethical considerations in robotics\", \"Examine the impact of robots on society\"]', 30, 'coursefiles/robotics3.jpg'),
(11, 'SEC011', 'T001', 'C001', 'Quiz', '[\"Quiz: Introduction to Robotics\", \"What is the role of sensors in robotics?\"]', 30, 'coursefiles/exam.png'),
(12, 'SEC012', 'T002', 'C001', 'Quiz', '[\"Quiz: Robot Sensors\", \"What is the role of sensors in robotics?\"]', 30, 'coursefiles/exam.png'),
(13, 'SEC013', 'T003', 'C001', 'Quiz', '[\"Quiz: Robot Programming\", \"How does robot vision enable robots to perceive and understand their surroundings?\"]', 30, 'coursefiles/exam.png'),
(14, 'SEC014', 'T004', 'C001', 'Quiz', '[\"Quiz: Robotics Mechanics\", \"What are some ethical considerations in robotics?\"]', 30, 'coursefiles/exam.png'),
(15, 'SEC015', 'T015', 'C001', 'Quiz', '[\"Quiz: Robot Kinematics\", \"Test your knowledge on robot motion and kinematic analysis\"]', 30, 'coursefiles/exam.png'),
(16, 'SEC016', 'Lesson1', 'C002', 'Introduction to Data Structures', '[\"Study the basic concepts of data structures\", \"Learn about arrays, linked lists, and stacks\"]', 30, 'coursefiles/datastructures.mp4'),
(17, 'SEC017', 'Lesson1', 'C002', 'Arrays and Their Operations', '[\"Explore array implementation and operations\", \"Learn about searching and sorting algorithms for arrays\"]', 30, 'coursefiles/datastructures.png'),
(18, 'SEC018', 'Lesson1', 'C002', 'Linked Lists and Applications', '[\"Understand linked list data structure\", \"Study applications of linked lists in real-world problems\"]', 30, 'coursefiles/linkedlists.png'),
(19, 'SEC019', 'Lesson2', 'C002', 'Stacks and Queues', '[\"Learn about stack and queue data structures\", \"Explore stack and queue implementations and use cases\"]', 30, 'coursefiles/stacks.png'),
(20, 'SEC020', 'Lesson2', 'C002', 'Trees and Binary Search Trees', '[\"Study tree data structure\", \"Learn about binary search trees and their operations\"]', 30, 'coursefiles/trees.png'),
(21, 'SEC021', 'Lesson2', 'C002', 'Graphs and Graph Traversal', '[\"Explore graph data structure\", \"Understand graph traversal algorithms such as BFS and DFS\"]', 30, 'coursefiles/graphs.png'),
(22, 'SEC022', 'Lesson2', 'C002', 'Hash Tables and Hashing', '[\"Learn about hash tables and hashing techniques\", \"Study collision resolution methods\"]', 30, 'coursefiles/hashtables.png'),
(23, 'SEC023', 'Lesson1', 'C002', 'Sample Quiz', '[\"Quiz: Data Structures\", \"Name four types of datastructures\"]', 30, 'coursefiles/exam.png');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `courseId` varchar(50) NOT NULL,
  `studentId` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `courseId`, `studentId`, `status`) VALUES
(37, 'C001', 'STD001', 'Subscribed'),
(51, 'C002', 'STD020', 'Subscribed'),
(54, 'C001', 'STD020', 'Subscribed');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `stdnumber` varchar(50) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uid`, `name`, `email`, `password`, `phone`, `stdnumber`, `photo`, `address`, `department`, `status`) VALUES
(1, 'U001', 'John Doe', 'john.doe@example.com', '00', '1234567890', 'STD001', 'uploads/user.png', '123 Main St', 'Computer Science', 'Active'),
(2, 'U002', 'Jane Smith', 'jane.smith@example.com', 'password456', '0987654321', 'STD002', 'uploads/user.png', '456 Elm St', 'Electrical Engineering', 'Active'),
(3, 'U003', 'David Johnson', 'david.johnson@example.com', 'password789', '5555555555', 'STD003', 'uploads/user.png', '789 Oak St', 'Mechanical Engineering', 'Active'),
(4, 'U004', 'Emily Davis', 'emily.davis@example.com', 'passwordabc', '1111111111', 'STD004', 'uploads/user.png', '321 Pine St', 'Chemistry', 'Inactive'),
(5, 'U005', 'Michael Wilson', 'michael.wilson@example.com', 'passwordxyz', '9999999999', 'STD005', 'uploads/user.png', '654 Cedar St', 'Physics', 'Active'),
(10, 'U756', 'Vubangsi Mercel', 'vmercel@gmail.com', 'pp', '17407463082', 'STD020', 'uploads/einstein.jpg', 'C/O Ntumbi Rex N. J.,', 'AI Engineering', 'Inactive');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
