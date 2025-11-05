-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-11-2025 a las 04:07:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `antoniopcbuilder`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacenamiento`
--

CREATE TABLE `almacenamiento` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `interfaz` varchar(50) DEFAULT NULL,
  `velocidad_lectura` int(11) DEFAULT NULL,
  `velocidad_escritura` int(11) DEFAULT NULL,
  `formato` varchar(20) DEFAULT NULL,
  `rpm` int(11) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fuentes_poder`
--

CREATE TABLE `fuentes_poder` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `potencia` int(11) NOT NULL,
  `certificacion` varchar(50) DEFAULT NULL,
  `modular` varchar(20) DEFAULT NULL,
  `conectores_pcie` varchar(100) DEFAULT NULL,
  `conectores_sata` int(11) DEFAULT NULL,
  `conectores_molex` int(11) DEFAULT NULL,
  `formato` varchar(20) DEFAULT NULL,
  `protecciones` varchar(200) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gabinetes`
--

CREATE TABLE `gabinetes` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `formato` varchar(50) DEFAULT NULL,
  `motherboards_soportadas` varchar(200) DEFAULT NULL,
  `longitud_max_gpu` int(11) DEFAULT NULL,
  `altura_max_cooler` int(11) DEFAULT NULL,
  `bahias_35` int(11) DEFAULT NULL,
  `bahias_25` int(11) DEFAULT NULL,
  `slots_expansion` int(11) DEFAULT NULL,
  `ventiladores_incluidos` varchar(100) DEFAULT NULL,
  `ventiladores_soportados` varchar(100) DEFAULT NULL,
  `radiador_soportado` varchar(100) DEFAULT NULL,
  `panel_frontal` varchar(200) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `memorias_ram`
--

CREATE TABLE `memorias_ram` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `velocidad_mhz` int(11) DEFAULT NULL,
  `velocidad_mt` int(11) DEFAULT NULL,
  `latencia` varchar(20) DEFAULT NULL,
  `voltaje` decimal(3,2) DEFAULT NULL,
  `formato` varchar(20) DEFAULT NULL,
  `rgb` tinyint(1) DEFAULT 0,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `memorias_ram`
--

INSERT INTO `memorias_ram` (`id`, `marca`, `modelo`, `tipo`, `capacidad`, `velocidad_mhz`, `velocidad_mt`, `latencia`, `voltaje`, `formato`, `rgb`, `imagen_url`, `estado`, `fecha_creacion`) VALUES
(1, 'Corsair', 'Vengeance RGB', 'DDR5', 32, 6000, NULL, NULL, NULL, NULL, 0, NULL, 'activo', '2025-11-04 16:56:52'),
(2, 'G.Skill', 'Trident Z5', 'DDR5', 32, 6000, NULL, NULL, NULL, NULL, 0, NULL, 'activo', '2025-11-04 16:56:52'),
(3, 'Kingston', 'Fury Beast', 'DDR5', 16, 5600, NULL, NULL, NULL, NULL, 0, NULL, 'activo', '2025-11-04 16:56:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesa`
--

CREATE TABLE `mesa` (
  `id` int(11) NOT NULL,
  `ocupada` tinyint(1) NOT NULL,
  `idPedido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motherboards`
--

CREATE TABLE `motherboards` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `socket` varchar(50) NOT NULL,
  `chipset` varchar(50) DEFAULT NULL,
  `formato` varchar(20) DEFAULT NULL,
  `tipo_memoria` varchar(10) DEFAULT NULL,
  `slots_memoria` int(11) DEFAULT NULL,
  `memoria_maxima` int(11) DEFAULT NULL,
  `velocidad_memoria_soportada` int(11) DEFAULT NULL,
  `slots_pcie` int(11) DEFAULT NULL,
  `version_pcie` varchar(20) DEFAULT NULL,
  `puertos_sata` int(11) DEFAULT NULL,
  `puertos_m2` int(11) DEFAULT NULL,
  `conectividad_red` varchar(100) DEFAULT NULL,
  `audio` varchar(100) DEFAULT NULL,
  `usb_puertos` varchar(200) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motherboards`
--

INSERT INTO `motherboards` (`id`, `marca`, `modelo`, `socket`, `chipset`, `formato`, `tipo_memoria`, `slots_memoria`, `memoria_maxima`, `velocidad_memoria_soportada`, `slots_pcie`, `version_pcie`, `puertos_sata`, `puertos_m2`, `conectividad_red`, `audio`, `usb_puertos`, `imagen_url`, `estado`, `fecha_creacion`) VALUES
(1, 'ASUS', 'ROG STRIX Z790-E', 'LGA 1700', 'Z790', 'ATX', 'DDR5', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(2, 'Gigabyte', 'X670 AORUS ELITE', 'AM5', 'X670', 'ATX', 'DDR5', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(3, 'MSI', 'MAG B650 TOMAHAWK', 'AM5', 'B650', 'ATX', 'DDR5', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `idMesa` int(11) NOT NULL,
  `precioTotal` float NOT NULL,
  `prioridad` int(11) NOT NULL,
  `listo` tinyint(1) NOT NULL,
  `pedido` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platillo`
--

CREATE TABLE `platillo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `precio` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `procesadores`
--

CREATE TABLE `procesadores` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `generacion` varchar(50) DEFAULT NULL,
  `año_lanzamiento` int(11) DEFAULT NULL,
  `socket` varchar(50) NOT NULL,
  `nucleos` int(11) DEFAULT NULL,
  `hilos` int(11) DEFAULT NULL,
  `frecuencia_base` decimal(3,2) DEFAULT NULL,
  `frecuencia_turbo` decimal(3,2) DEFAULT NULL,
  `cache` varchar(20) DEFAULT NULL,
  `tdp` int(11) DEFAULT NULL,
  `tipo_memoria` varchar(10) DEFAULT NULL,
  `velocidad_memoria_max` int(11) DEFAULT NULL,
  `graficos_integrados` tinyint(1) DEFAULT 0,
  `modelo_graficos` varchar(50) DEFAULT NULL,
  `tecnologia` varchar(10) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `procesadores`
--

INSERT INTO `procesadores` (`id`, `marca`, `modelo`, `generacion`, `año_lanzamiento`, `socket`, `nucleos`, `hilos`, `frecuencia_base`, `frecuencia_turbo`, `cache`, `tdp`, `tipo_memoria`, `velocidad_memoria_max`, `graficos_integrados`, `modelo_graficos`, `tecnologia`, `imagen_url`, `estado`, `fecha_creacion`) VALUES
(1, 'Intel', 'Core i9-13900K', NULL, NULL, 'LGA 1700', 24, 32, 3.00, NULL, NULL, 125, 'DDR5', NULL, 0, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(2, 'AMD', 'Ryzen 9 7950X', NULL, NULL, 'AM5', 16, 32, 4.50, NULL, NULL, 170, 'DDR5', NULL, 0, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(3, 'Intel', 'Core i7-13700K', NULL, NULL, 'LGA 1700', 16, 24, 3.40, NULL, NULL, 125, 'DDR5', NULL, 0, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(4, 'AMD', 'Ryzen 7 7700X', NULL, NULL, 'AM5', 8, 16, 4.50, NULL, NULL, 105, 'DDR5', NULL, 0, NULL, NULL, NULL, 'activo', '2025-11-04 16:56:52'),
(5, 'Intel', 'Core i5 5500', '4th', 2017, 'LGA 1150', 4, 4, 3.20, 3.60, '6', 84, 'DDR3', 1600, 0, 'UHD Grafics', '22', 'https://http2.mlstatic.com/D_Q_NP_606947-MLA91475791968_092025-O.webp', 'activo', '2025-11-04 17:25:38'),
(6, 'Intel', 'Core i5-6500', '6th', 2022, 'LGA 1151', 4, 4, 3.20, 3.60, '6', 65, 'DDR3, DDR4', 2133, 1, 'Intel HD Graphics 530', '14', 'https://microless.com/cdn/products/0a8864c1cfe40b199796dcb133805806-hi.jpg', 'activo', '2025-11-04 19:14:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedades_componentes`
--

CREATE TABLE `propiedades_componentes` (
  `id` int(11) NOT NULL,
  `tipo_componente` varchar(50) NOT NULL,
  `propiedad` varchar(50) NOT NULL,
  `valor` varchar(100) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `propiedades_componentes`
--

INSERT INTO `propiedades_componentes` (`id`, `tipo_componente`, `propiedad`, `valor`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'procesadores', 'marca', 'Intel', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(2, 'procesadores', 'marca', 'AMD', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(3, 'procesadores', 'socket', 'LGA 1700', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(4, 'procesadores', 'socket', 'LGA 1200', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(5, 'procesadores', 'socket', 'AM5', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(6, 'procesadores', 'socket', 'AM4', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(7, 'procesadores', 'generacion', '13th Gen', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(8, 'procesadores', 'generacion', '12th Gen', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(9, 'procesadores', 'generacion', 'Ryzen 7000', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(10, 'procesadores', 'generacion', 'Ryzen 5000', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(11, 'procesadores', 'tecnologia', '7 nm', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(12, 'procesadores', 'tecnologia', '10 nm', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(13, 'procesadores', 'tecnologia', '14 nm', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(14, 'motherboards', 'marca', 'ASUS', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(15, 'motherboards', 'marca', 'MSI', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(16, 'motherboards', 'marca', 'Gigabyte', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(17, 'motherboards', 'marca', 'ASRock', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(18, 'motherboards', 'chipset', 'Z790', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(19, 'motherboards', 'chipset', 'B760', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(20, 'motherboards', 'chipset', 'X670', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(21, 'motherboards', 'chipset', 'B650', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(22, 'motherboards', 'formato', 'ATX', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(23, 'motherboards', 'formato', 'Micro-ATX', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(24, 'motherboards', 'formato', 'Mini-ITX', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(25, 'memorias_ram', 'marca', 'Corsair', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(26, 'memorias_ram', 'marca', 'G.Skill', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(27, 'memorias_ram', 'marca', 'Kingston', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(28, 'memorias_ram', 'marca', 'Crucial', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(29, 'memorias_ram', 'tipo', 'DDR5', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(30, 'memorias_ram', 'tipo', 'DDR4', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(31, 'memorias_ram', 'tipo', 'DDR3', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(32, 'memorias_ram', 'capacidad', '4 GB', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(33, 'memorias_ram', 'capacidad', '8 GB', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(34, 'memorias_ram', 'capacidad', '16 GB', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(35, 'memorias_ram', 'capacidad', '32 GB', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(36, 'gabinetes', 'marca', 'Lian Li', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(37, 'gabinetes', 'marca', 'NZXT', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(38, 'gabinetes', 'marca', 'Corsair', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(39, 'gabinetes', 'marca', 'Cooler Master', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(40, 'gabinetes', 'formato', 'Full Tower', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(41, 'gabinetes', 'formato', 'Mid Tower', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(42, 'gabinetes', 'formato', 'Mini Tower', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(43, 'tarjetas_graficas', 'marca', 'NVIDIA', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(44, 'tarjetas_graficas', 'marca', 'AMD', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(45, 'tarjetas_graficas', 'fabricante', 'ASUS', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(46, 'tarjetas_graficas', 'fabricante', 'MSI', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(47, 'tarjetas_graficas', 'fabricante', 'Gigabyte', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(48, 'almacenamiento', 'marca', 'Samsung', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(49, 'almacenamiento', 'marca', 'Western Digital', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(50, 'almacenamiento', 'marca', 'Crucial', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(51, 'almacenamiento', 'tipo', 'NVMe SSD', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(52, 'almacenamiento', 'tipo', 'SATA SSD', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(53, 'almacenamiento', 'tipo', 'HDD', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(54, 'fuentes_poder', 'marca', 'Corsair', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(55, 'fuentes_poder', 'marca', 'Seasonic', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(56, 'fuentes_poder', 'marca', 'EVGA', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(57, 'fuentes_poder', 'certificacion', '80 Plus Bronze', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(58, 'fuentes_poder', 'certificacion', '80 Plus Gold', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(59, 'fuentes_poder', 'certificacion', '80 Plus Platinum', 'activo', '2025-11-04 20:13:34', '2025-11-04 20:13:34'),
(60, 'fuentes_poder', 'certificacion', '80 Plus Bronce', 'activo', '2025-11-04 21:46:51', '2025-11-04 21:46:51'),
(61, 'almacenamiento', 'tipo', 'SSD NVME', 'activo', '2025-11-04 22:25:16', '2025-11-04 22:25:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `procesador_id` int(11) DEFAULT NULL,
  `motherboard_id` int(11) DEFAULT NULL,
  `memoria_ram_id` int(11) DEFAULT NULL,
  `tarjeta_grafica_id` int(11) DEFAULT NULL,
  `almacenamiento_id` int(11) DEFAULT NULL,
  `fuente_poder_id` int(11) DEFAULT NULL,
  `gabinete_id` int(11) DEFAULT NULL,
  `estado` enum('activo','archivado') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` int(11) NOT NULL,
  `aNombreDe` varchar(40) NOT NULL,
  `idMesa` int(11) NOT NULL,
  `horario` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `token` varchar(500) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_expiracion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjetas_graficas`
--

CREATE TABLE `tarjetas_graficas` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `fabricante` varchar(50) DEFAULT NULL,
  `memoria` int(11) DEFAULT NULL,
  `tipo_memoria` varchar(20) DEFAULT NULL,
  `bus_memoria` int(11) DEFAULT NULL,
  `velocidad_memoria` int(11) DEFAULT NULL,
  `nucleos_cuda` int(11) DEFAULT NULL,
  `frecuencia_base` int(11) DEFAULT NULL,
  `frecuencia_boost` int(11) DEFAULT NULL,
  `tdp` int(11) DEFAULT NULL,
  `conectores_alimentacion` varchar(100) DEFAULT NULL,
  `salidas_video` varchar(200) DEFAULT NULL,
  `longitud_mm` int(11) DEFAULT NULL,
  `altura_mm` int(11) DEFAULT NULL,
  `slots_ocupados` int(11) DEFAULT NULL,
  `peso_kg` decimal(4,2) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `contraseña` varchar(25) NOT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `rol` enum('user','admin') DEFAULT 'user',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `nombre`, `apellido`, `telefono`, `password`, `google_id`, `avatar_url`, `rol`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(6, 'admin@test.com', 'Admin', 'Test', NULL, '$2a$12$i04dHrr6XCEdrfZ.YZ3zHeBPjNhWrY2yHO/nubiOiTpB25psi18mS', NULL, NULL, 'admin', '2025-11-04 16:56:52', '2025-11-04 17:19:25'),
(7, 'mod@test.com', 'Moderador', 'Test', NULL, '$2a$12$i04dHrr6XCEdrfZ.YZ3zHeBPjNhWrY2yHO/nubiOiTpB25psi18mS', NULL, NULL, 'admin', '2025-11-04 16:56:52', '2025-11-04 17:19:19'),
(8, 'AntonioCruzvalletto00@gmail.com', 'Antonio', 'CruZ', '1231231231', '$2a$12$i04dHrr6XCEdrfZ.YZ3zHeBPjNhWrY2yHO/nubiOiTpB25psi18mS', NULL, NULL, 'user', '2025-11-04 17:18:34', '2025-11-04 17:18:34');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacenamiento`
--
ALTER TABLE `almacenamiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_capacidad` (`capacidad`),
  ADD KEY `idx_interfaz` (`interfaz`);

--
-- Indices de la tabla `fuentes_poder`
--
ALTER TABLE `fuentes_poder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_potencia` (`potencia`),
  ADD KEY `idx_certificacion` (`certificacion`),
  ADD KEY `idx_modular` (`modular`);

--
-- Indices de la tabla `gabinetes`
--
ALTER TABLE `gabinetes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_formato` (`formato`),
  ADD KEY `idx_longitud_gpu` (`longitud_max_gpu`);

--
-- Indices de la tabla `memorias_ram`
--
ALTER TABLE `memorias_ram`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_capacidad` (`capacidad`),
  ADD KEY `idx_velocidad` (`velocidad_mhz`);

--
-- Indices de la tabla `mesa`
--
ALTER TABLE `mesa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ID_PEDIDO` (`idPedido`);

--
-- Indices de la tabla `motherboards`
--
ALTER TABLE `motherboards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_socket` (`socket`),
  ADD KEY `idx_tipo_memoria` (`tipo_memoria`),
  ADD KEY `idx_formato` (`formato`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ID_MESA` (`idMesa`);

--
-- Indices de la tabla `platillo`
--
ALTER TABLE `platillo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `procesadores`
--
ALTER TABLE `procesadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_socket` (`socket`),
  ADD KEY `idx_marca` (`marca`),
  ADD KEY `idx_tipo_memoria` (`tipo_memoria`);

--
-- Indices de la tabla `propiedades_componentes`
--
ALTER TABLE `propiedades_componentes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo_componente` (`tipo_componente`),
  ADD KEY `idx_propiedad` (`propiedad`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `procesador_id` (`procesador_id`),
  ADD KEY `motherboard_id` (`motherboard_id`),
  ADD KEY `memoria_ram_id` (`memoria_ram_id`),
  ADD KEY `tarjeta_grafica_id` (`tarjeta_grafica_id`),
  ADD KEY `almacenamiento_id` (`almacenamiento_id`),
  ADD KEY `fuente_poder_id` (`fuente_poder_id`),
  ADD KEY `gabinete_id` (`gabinete_id`),
  ADD KEY `idx_usuario` (`usuario_id`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ID_MESA1` (`idMesa`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_sesion_token` (`token`);

--
-- Indices de la tabla `tarjetas_graficas`
--
ALTER TABLE `tarjetas_graficas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_marca` (`marca`),
  ADD KEY `idx_memoria` (`memoria`),
  ADD KEY `idx_tdp` (`tdp`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `idx_usuario_email` (`email`),
  ADD KEY `idx_google_id` (`google_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacenamiento`
--
ALTER TABLE `almacenamiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fuentes_poder`
--
ALTER TABLE `fuentes_poder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gabinetes`
--
ALTER TABLE `gabinetes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `memorias_ram`
--
ALTER TABLE `memorias_ram`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mesa`
--
ALTER TABLE `mesa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `motherboards`
--
ALTER TABLE `motherboards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `platillo`
--
ALTER TABLE `platillo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `procesadores`
--
ALTER TABLE `procesadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `propiedades_componentes`
--
ALTER TABLE `propiedades_componentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tarjetas_graficas`
--
ALTER TABLE `tarjetas_graficas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mesa`
--
ALTER TABLE `mesa`
  ADD CONSTRAINT `FK_ID_PEDIDO` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`id`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_ID_MESA` FOREIGN KEY (`idMesa`) REFERENCES `mesa` (`id`);

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`procesador_id`) REFERENCES `procesadores` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_3` FOREIGN KEY (`motherboard_id`) REFERENCES `motherboards` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_4` FOREIGN KEY (`memoria_ram_id`) REFERENCES `memorias_ram` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_5` FOREIGN KEY (`tarjeta_grafica_id`) REFERENCES `tarjetas_graficas` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_6` FOREIGN KEY (`almacenamiento_id`) REFERENCES `almacenamiento` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_7` FOREIGN KEY (`fuente_poder_id`) REFERENCES `fuentes_poder` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_8` FOREIGN KEY (`gabinete_id`) REFERENCES `gabinetes` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `FK_ID_MESA1` FOREIGN KEY (`idMesa`) REFERENCES `mesa` (`id`);

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
