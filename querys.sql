CREATE TABLE
  `clientes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(100) DEFAULT NULL,
    `cnpj` varchar(20) DEFAULT NULL,
    `nome_responsavel` varchar(100) DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL,
    `telefone` varchar(20) DEFAULT NULL,
    `endereco` varchar(255) DEFAULT NULL,
    `cidade` varchar(100) DEFAULT NULL,
    `estado` varchar(50) DEFAULT NULL,
    `cep` varchar(20) DEFAULT NULL,
    `data_criacao` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `equipamentos` (
    `ID` int NOT NULL AUTO_INCREMENT,
    `ItemID` int DEFAULT NULL,
    `Descricao` varchar(255) DEFAULT NULL,
    `Categoria` varchar(255) DEFAULT NULL,
    `DataCadastro` timestamp NULL DEFAULT NULL,
    `Modelo` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`ID`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `pecas` (
    `ID` int NOT NULL AUTO_INCREMENT,
    `ItemID` int DEFAULT NULL,
    `Carcaca` varchar(100) DEFAULT NULL,
    `Visor` varchar(100) DEFAULT NULL,
    `sensorPlaca` varchar(255) DEFAULT NULL,
    `NumeroItem` int DEFAULT NULL,
    `Quantidade` int DEFAULT NULL,
    `Descricao` varchar(255) DEFAULT NULL,
    `Codigo` varchar(100) DEFAULT NULL,
    `Observacao` text,
    `DataCadastro` date DEFAULT NULL,
    `valorPeca` decimal(10, 2) DEFAULT NULL,
    `nSeriePlaca` varchar(100) DEFAULT NULL,
    `protocolo` varchar(100) DEFAULT NULL,
    `nSerieSensor` varchar(100) DEFAULT NULL,
    `faixaSensor` varchar(100) DEFAULT NULL,
    `dataFabricacao` date DEFAULT NULL,
    `modeloPlaca` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`ID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `produto_posicionador` (
    `id` int NOT NULL AUTO_INCREMENT,
    `descricaoProduto` varchar(255) DEFAULT NULL,
    `nSerieEquipamento` varchar(100) DEFAULT NULL,
    `protocolo` varchar(100) DEFAULT NULL,
    `nSerieBase` varchar(100) DEFAULT NULL,
    `nSeriePlaca1` varchar(100) DEFAULT NULL,
    `nSeriePlaca2` varchar(100) DEFAULT NULL,
    `modeloPlaca` varchar(45) DEFAULT NULL,
    `modelo` varchar(100) DEFAULT NULL,
    `preco` decimal(10, 2) DEFAULT NULL,
    `tipoProduto` varchar(45) DEFAULT NULL,
    `quantidade` tinyint DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `produto_transmissor` (
    `id` int NOT NULL AUTO_INCREMENT,
    `descricaoProduto` varchar(255) DEFAULT NULL,
    `nSerieEquipamento` varchar(100) DEFAULT NULL,
    `protocolo` varchar(100) DEFAULT NULL,
    `sensor` int DEFAULT NULL,
    `nSerieSensor` varchar(100) DEFAULT NULL,
    `faixa` varchar(100) DEFAULT NULL,
    `dataFabric` date DEFAULT NULL,
    `preco` decimal(10, 2) DEFAULT NULL,
    `modelo` varchar(100) DEFAULT NULL,
    `tipoProduto` varchar(45) DEFAULT NULL,
    `quantidade` tinyint DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `servicos` (
    `id` int NOT NULL AUTO_INCREMENT,
    `modelo` varchar(100) DEFAULT NULL,
    `categoria` varchar(100) DEFAULT NULL,
    `itemIdEquip` varchar(50) DEFAULT NULL,
    `equipamentoDescricao` varchar(255) DEFAULT NULL,
    `codService` varchar(100) DEFAULT NULL,
    `DataCadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `idCliente` varchar(50) DEFAULT NULL,
    `descCliente` varchar(255) DEFAULT NULL,
    `status` enum(
      'Não iniciado',
      'Em desenvolvimento',
      'Em progresso',
      'Concluído'
    ) DEFAULT NULL,
    `itemService` varchar(255) DEFAULT NULL,
    `equipamentoId` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `servicos_pecas` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `codService` varchar(100) DEFAULT NULL,
    `peca_id` int DEFAULT NULL,
    `quantidade_peca` int DEFAULT NULL,
    `servico_id` int DEFAULT NULL,
    `idCliente` varchar(100) DEFAULT NULL,
    `insVisual` varchar(255) DEFAULT NULL,
    `manuPreventiva` tinyint(1) DEFAULT NULL,
    `manuPrevTomada` tinyint(1) DEFAULT NULL,
    `itemService` varchar(255) DEFAULT NULL,
    `equipamentoId` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `usuarios` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(100) DEFAULT NULL,
    `Email` varchar(100) DEFAULT NULL,
    `Senha` varchar(255) DEFAULT NULL,
    `perfil` enum('admin', 'usuario') DEFAULT NULL,
    `criado_em` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

  CREATE TABLE
  `vendas` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `idCliente` varchar(100) DEFAULT NULL,
    `idVenda` varchar(50) DEFAULT NULL,
    `tipoProduto` varchar(50) DEFAULT NULL,
    `itemVenda` varchar(10) DEFAULT NULL,
    `idProduto` varchar(255) DEFAULT NULL,
    `dataProposta` datetime DEFAULT NULL,
    `dataVenda` datetime DEFAULT NULL,
    `status` varchar(50) DEFAULT NULL,
    `marca` varchar(100) DEFAULT NULL,
    `quantidade` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci