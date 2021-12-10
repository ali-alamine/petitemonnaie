-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2021 at 10:26 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sicomex-stores-new`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_check`
--

CREATE TABLE `bank_check` (
  `bank_check_id` int(11) NOT NULL,
  `check_description` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `check_amount` int(11) DEFAULT NULL,
  `check_date` datetime DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `is_for_sup` tinyint(1) DEFAULT NULL,
  `invoice_ids` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `check_number` int(11) DEFAULT NULL,
  `check_order` int(5) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bank_check`
--

INSERT INTO `bank_check` (`bank_check_id`, `check_description`, `supplier_id`, `check_amount`, `check_date`, `store_id`, `is_paid`, `is_for_sup`, `invoice_ids`, `check_number`, `check_order`) VALUES
(140, 'details1', NULL, 120, '2021-12-05 00:00:00', 19, 0, 0, NULL, 123, 0),
(141, NULL, 39, 50, '2021-12-05 00:00:00', 19, 1, 1, '190', 878, 0),
(142, NULL, 39, 3750, '2021-12-05 00:00:00', 19, 0, 1, '197,196,195,194,193,192,191,198,199', 3321, 0),
(143, '11', NULL, 11, '2021-12-06 00:00:00', 20, 0, 0, NULL, 1, 0),
(144, NULL, 39, 1000, '2021-12-07 00:00:00', 20, 1, 1, '203', 12122222, 0);

-- --------------------------------------------------------

--
-- Table structure for table `cash_detail`
--

CREATE TABLE `cash_detail` (
  `cash_detail_id` int(11) NOT NULL,
  `text` varchar(5000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_id` int(5) DEFAULT NULL,
  `store_entry_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cash_detail`
--

INSERT INTO `cash_detail` (`cash_detail_id`, `text`, `amount`, `type`, `store_id`, `store_entry_id`) VALUES
(212, 'cash1', 100, 'sup', 19, 115),
(213, 'cash2', 100, 'exp', 19, 115);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `store_id` int(6) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `invoice_amount` bigint(11) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `check_id` int(11) DEFAULT NULL,
  `invoice_order` int(5) NOT NULL DEFAULT 0,
  `invoice_number` bigint(11) DEFAULT NULL,
  `amount_paid` bigint(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `store_id`, `supplier_id`, `invoice_amount`, `invoice_date`, `is_paid`, `check_id`, `invoice_order`, `invoice_number`, `amount_paid`) VALUES
(190, 19, 39, 50, '2021-12-05', 1, 141, 0, 125, NULL),
(191, 19, 39, 120, '2021-12-05', 1, 142, 0, 3421, NULL),
(192, 19, 39, 10, '2021-12-05', 1, 142, 0, 100, NULL),
(193, 19, 39, 10, '2021-12-05', 1, 142, 0, 10, NULL),
(194, 19, 39, 10, '2021-12-05', 1, 142, 0, 1010, NULL),
(195, 19, 39, 1000, '2021-12-05', 1, 142, 0, 13000, NULL),
(196, 19, 39, 500, '2021-12-05', 1, 142, 0, 20103, NULL),
(197, 19, 39, 1000, '2021-12-05', 1, 142, 0, 131212, NULL),
(198, 20, 39, 100, '2021-12-05', 1, 142, 0, 1211, NULL),
(199, 19, 39, 1000, '2021-12-05', 1, 142, 0, 1212, NULL),
(200, 20, 39, 1000, '2021-12-06', 1, NULL, 0, 323212, NULL),
(201, 20, 39, 1000, '2021-12-06', 1, NULL, 0, 1212, NULL),
(202, 21, 39, 100, '2021-12-06', 1, NULL, 0, 121233, NULL),
(203, 21, 39, 1000, '2021-12-07', 1, 144, 0, 12112111, NULL),
(204, 21, 39, 1000, '2021-12-07', 0, NULL, 0, 1122, NULL),
(205, 21, 39, 1000, '2021-12-07', 0, NULL, 0, 12122, 0);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_edit_history`
--

CREATE TABLE `invoice_edit_history` (
  `inv_edit_h_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_amount` bigint(11) DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(5) NOT NULL,
  `store_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `store_manager` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` bigint(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_manager`, `store_address`, `amount`) VALUES
(19, 'abc', NULL, NULL, 150),
(20, 'test2', NULL, NULL, -250),
(21, 'test', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `store_entry`
--

CREATE TABLE `store_entry` (
  `store_entry_id` int(11) NOT NULL,
  `store_id` int(4) DEFAULT NULL,
  `sales_amount` bigint(11) NOT NULL,
  `cash_supply_amount` int(11) DEFAULT NULL,
  `cash_expense_amount` bigint(11) DEFAULT NULL,
  `bank_deposit` int(11) DEFAULT NULL,
  `remain_amount` bigint(11) DEFAULT NULL,
  `entry_report_date` datetime DEFAULT NULL,
  `starting_amount` bigint(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store_entry`
--

INSERT INTO `store_entry` (`store_entry_id`, `store_id`, `sales_amount`, `cash_supply_amount`, `cash_expense_amount`, `bank_deposit`, `remain_amount`, `entry_report_date`, `starting_amount`) VALUES
(115, 19, 1000, 100, 100, 200, -900, '2021-12-05 00:00:00', -900),
(116, 20, 100, 0, 0, 50, 50, '2021-12-05 00:00:00', 50),
(117, 20, 500, 0, 0, 400, 150, '2021-12-05 00:00:00', 150),
(118, 20, 500, 0, 0, 300, -2980, '2021-12-05 00:00:00', -2750);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `supplier_amount` bigint(11) DEFAULT NULL,
  `sup_order` int(5) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `supplier_amount`, `sup_order`) VALUES
(39, 'sup1', 3000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(4) NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_id` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `user_type`, `store_id`) VALUES
(11, 'admin', '123456', 'emp', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_check`
--
ALTER TABLE `bank_check`
  ADD PRIMARY KEY (`bank_check_id`);

--
-- Indexes for table `cash_detail`
--
ALTER TABLE `cash_detail`
  ADD PRIMARY KEY (`cash_detail_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_id`);

--
-- Indexes for table `invoice_edit_history`
--
ALTER TABLE `invoice_edit_history`
  ADD PRIMARY KEY (`inv_edit_h_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`);

--
-- Indexes for table `store_entry`
--
ALTER TABLE `store_entry`
  ADD PRIMARY KEY (`store_entry_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_check`
--
ALTER TABLE `bank_check`
  MODIFY `bank_check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `cash_detail`
--
ALTER TABLE `cash_detail`
  MODIFY `cash_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `invoice_edit_history`
--
ALTER TABLE `invoice_edit_history`
  MODIFY `inv_edit_h_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `store_entry`
--
ALTER TABLE `store_entry`
  MODIFY `store_entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
