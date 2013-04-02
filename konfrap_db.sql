-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2013 at 09:04 PM
-- Server version: 5.5.8
-- PHP Version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `konfrap_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `debates`
--

CREATE TABLE IF NOT EXISTS `debates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL DEFAULT '0',
  `topic` text NOT NULL,
  `description` text NOT NULL,
  `creator_fbid` varchar(25) NOT NULL,
  `startdate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `debates`
--

INSERT INTO `debates` (`id`, `score`, `topic`, `description`, `creator_fbid`, `startdate`) VALUES
(3, 0, 'PHP is dead? We should just move on to Python.', 'Framework after framework written in PHP is losing loyalty. Blame the poor PHP design or the better infrastructure support for Python, people are just taking to Python in a better way. Is it time to move on?', '653499724', '2013-03-05 20:22:25');

-- --------------------------------------------------------

--
-- Table structure for table `debate_followers`
--

CREATE TABLE IF NOT EXISTS `debate_followers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debate_id` int(11) NOT NULL,
  `follower_fbid` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `debate_id` (`debate_id`,`follower_fbid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `debate_followers`
--

INSERT INTO `debate_followers` (`id`, `debate_id`, `follower_fbid`) VALUES
(6, 3, '100000901607885'),
(5, 3, '1373841758'),
(7, 3, '653499724');

-- --------------------------------------------------------

--
-- Table structure for table `debate_participants`
--

CREATE TABLE IF NOT EXISTS `debate_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debate_id` int(11) NOT NULL,
  `participant_fbid` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `debate_id` (`debate_id`,`participant_fbid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `debate_participants`
--


-- --------------------------------------------------------

--
-- Table structure for table `debate_themes`
--

CREATE TABLE IF NOT EXISTS `debate_themes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debate_id` int(11) NOT NULL,
  `theme` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `debate_id` (`debate_id`,`theme`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `debate_themes`
--

INSERT INTO `debate_themes` (`id`, `debate_id`, `theme`) VALUES
(2, 3, 'IIT Academics');

-- --------------------------------------------------------

--
-- Table structure for table `debate_tokens`
--

CREATE TABLE IF NOT EXISTS `debate_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debate_id` int(11) NOT NULL,
  `token` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `debate_tokens`
--

INSERT INTO `debate_tokens` (`id`, `debate_id`, `token`) VALUES
(2, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `feedback` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `email`, `feedback`) VALUES
(1, 'sdf@fsg.com', 'sdf'),
(2, 'ravmalla@gmail.com', 'hey there!'),
(4, 'ravmalla@gmail.com', 'sdfdsf'),
(5, 'sdf@fsg.com', 'sdf');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `fbid` bigint(35) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fbid` (`fbid`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `fbid`, `score`, `url`) VALUES
(7, 'Ravee Malla', 653499724, 0, 'ravee-malla'),
(15, 'Iit Debates', 100003955575567, 0, 'Iit-Debates');

-- --------------------------------------------------------

--
-- Table structure for table `user_followers`
--

CREATE TABLE IF NOT EXISTS `user_followers` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `followee` bigint(35) NOT NULL,
  `follower` bigint(35) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `followee_2` (`followee`,`follower`),
  KEY `followee` (`followee`,`follower`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user_followers`
--

INSERT INTO `user_followers` (`id`, `followee`, `follower`) VALUES
(3, 653499724, 100003955575567),
(2, 100003955575567, 653499724);

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE IF NOT EXISTS `user_interests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `val` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid_2` (`uid`,`val`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `user_interests`
--

INSERT INTO `user_interests` (`id`, `uid`, `val`) VALUES
(17, 7, 'IIT Delhi'),
(13, 15, 'Economic Policies');
