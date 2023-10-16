-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: portal_fsnt
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Convidado_Evento`
--

DROP TABLE IF EXISTS `Convidado_Evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Convidado_Evento` (
  `id_convidado` int NOT NULL,
  `id_evento` int NOT NULL,
  KEY `id_convidado` (`id_convidado`),
  KEY `id_evento` (`id_evento`),
  CONSTRAINT `Convidado_Evento_ibfk_1` FOREIGN KEY (`id_convidado`) REFERENCES `Convidados` (`id`),
  CONSTRAINT `Convidado_Evento_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `Solicitacoes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Convidado_Evento`
--

LOCK TABLES `Convidado_Evento` WRITE;
/*!40000 ALTER TABLE `Convidado_Evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `Convidado_Evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Convidados`
--

DROP TABLE IF EXISTS `Convidados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Convidados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefone` varchar(25) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `id_empresa` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `Convidados_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `Empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Convidados`
--

LOCK TABLES `Convidados` WRITE;
/*!40000 ALTER TABLE `Convidados` DISABLE KEYS */;
/*!40000 ALTER TABLE `Convidados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Empresas`
--

DROP TABLE IF EXISTS `Empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Empresas`
--

LOCK TABLES `Empresas` WRITE;
/*!40000 ALTER TABLE `Empresas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Espacos`
--

DROP TABLE IF EXISTS `Espacos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Espacos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `ponto_referencia` varchar(50) NOT NULL,
  `localizacao` varchar(50) NOT NULL,
  `descricao` text NOT NULL,
  `id_instituicao` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_instituicao` (`id_instituicao`),
  CONSTRAINT `Espacos_ibfk_1` FOREIGN KEY (`id_instituicao`) REFERENCES `Instituicoes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Espacos`
--

LOCK TABLES `Espacos` WRITE;
/*!40000 ALTER TABLE `Espacos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Espacos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Eventos`
--

DROP TABLE IF EXISTS `Eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text NOT NULL,
  `data_evento` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_termino` time NOT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `id_espaco` int DEFAULT NULL,
  `tipo_evento` enum('Público','Privado') NOT NULL,
  `modalidade` enum('Presencial','Online') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_espaco` (`id_espaco`),
  CONSTRAINT `Eventos_ibfk_1` FOREIGN KEY (`id_espaco`) REFERENCES `Espacos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Instituicoes`
--

DROP TABLE IF EXISTS `Instituicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Instituicoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Instituicoes`
--

LOCK TABLES `Instituicoes` WRITE;
/*!40000 ALTER TABLE `Instituicoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Instituicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitacoes`
--

DROP TABLE IF EXISTS `Solicitacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Solicitacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_solicitacao` datetime NOT NULL,
  `data_uso` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_termino` time NOT NULL,
  `descricao` text NOT NULL,
  `id_espaco` int NOT NULL,
  `id_usuario` int NOT NULL,
  `status_solicitacao` enum('Pendente','Aprovada','Reprovada') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_espaco` (`id_espaco`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Solicitacoes_ibfk_1` FOREIGN KEY (`id_espaco`) REFERENCES `Espacos` (`id`),
  CONSTRAINT `Solicitacoes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitacoes`
--

LOCK TABLES `Solicitacoes` WRITE;
/*!40000 ALTER TABLE `Solicitacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Solicitacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `telefone` varchar(25) NOT NULL,
  `nivel_acesso` enum('Administrador','Solicitante','Visualizador') NOT NULL,
  `status_usuario` enum('Ativo','Inativo') NOT NULL,
  `id_instituicao` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_instituicao` (`id_instituicao`),
  CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`id_instituicao`) REFERENCES `Instituicoes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'portal_fsnt'
--

--
-- Dumping routines for database 'portal_fsnt'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-16  7:57:33
