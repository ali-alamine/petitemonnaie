-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2022 at 04:43 PM
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
  `amount_paid` bigint(11) DEFAULT 0,
  `payments` varchar(500) COLLATE utf8_unicode_ci DEFAULT '{}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `store_id`, `supplier_id`, `invoice_amount`, `invoice_date`, `is_paid`, `check_id`, `invoice_order`, `invoice_number`, `amount_paid`, `payments`) VALUES
(258, 36, 44, 1000, '2021-12-19', 0, NULL, 0, 123331, 901, '{}'),
(259, 36, 44, 2000, '2021-12-19', 0, NULL, 1, 8373737, 1700, '{}'),
(260, 36, 44, 9000, '2021-12-19', 0, NULL, 0, 9384848, 8900, '{}');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_payment`
--

CREATE TABLE `invoice_payment` (
  `payment_id` int(10) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `payment_amount` int(11) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `store_entry_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `invoice_payment`
--

INSERT INTO `invoice_payment` (`payment_id`, `invoice_id`, `payment_amount`, `payment_date`, `store_entry_id`) VALUES
(80, 260, 8900, NULL, 173),
(81, 258, 100, '2021-12-19', 173),
(82, 258, 100, '2021-12-19', 173),
(83, 258, 100, '2021-12-19', 173),
(84, 259, 100, '2021-12-19', 173),
(85, 259, 100, '2021-12-19', 173),
(86, 259, 100, '2021-12-19', 173),
(87, 259, 100, '2021-12-19', 173),
(88, 259, 300, '2021-12-19', 173),
(89, 259, 300, '2021-12-19', 173),
(90, 259, 300, '2021-12-19', 173),
(91, 258, 300, '2021-12-19', 173),
(92, 259, 300, '2021-12-19', 173),
(93, 258, 300, '2021-12-19', 173),
(94, 259, 100, '2021-12-19', 173),
(95, 259, 100, '2021-12-19', 174),
(96, 258, 1, '2021-12-19', 174);

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(5) NOT NULL,
  `store_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `store_manager` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `store_address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` bigint(11) DEFAULT 0,
  `drawer_amount` bigint(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_manager`, `store_address`, `amount`, `drawer_amount`) VALUES
(36, 'test', NULL, NULL, 0, -1401);

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
(173, 36, 10000, 0, 0, 0, -1500, '2021-12-19 00:00:00', 0),
(174, 36, 100, 0, 0, 0, -1401, '2021-12-25 00:00:00', -1400);

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
(44, 'sup1', 499, 0);

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
-- Indexes for table `invoice_payment`
--
ALTER TABLE `invoice_payment`
  ADD PRIMARY KEY (`payment_id`);

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
  MODIFY `bank_check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `cash_detail`
--
ALTER TABLE `cash_detail`
  MODIFY `cash_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- AUTO_INCREMENT for table `invoice_payment`
--
ALTER TABLE `invoice_payment`
  MODIFY `payment_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `store_entry`
--
ALTER TABLE `store_entry`
  MODIFY `store_entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
