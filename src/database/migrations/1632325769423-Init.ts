import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1632325769423 implements MigrationInterface {
  name = 'Init1632325769423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `sale_strategy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `canUseCoupon` tinyint NOT NULL, `canUseMileage` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `job_execution_context_record` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `shortContext` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `job` (`name` varchar(50) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`name`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `job_execution_record` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `jobName` varchar(255) NOT NULL, `contextRecordId` int NULL, `status` enum ('STARTED', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'STARTED', `startedAt` datetime NULL, `endAt` datetime NULL, `errorMessage` varchar(100) NULL, UNIQUE INDEX `REL_db11fb436072f887093856e50e` (`contextRecordId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `step_execution_record` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `jobExecutionRecordId` int NOT NULL, `stepName` varchar(50) NOT NULL, `status` enum ('STARTED', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'STARTED', `startedAt` datetime NULL, `endAt` datetime NULL, `errorMessage` varchar(100) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `refund_account` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `style_tag` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `role` enum ('USER', 'EDITOR', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'USER', `oauthProvider` enum ('FACEBOOK', 'KAKAO', 'APPLE') NULL, `oauthCode` varchar(255) NULL, `code` varchar(15) NULL, `email` varchar(255) NULL, `phoneNumber` char(12) NULL, `nickname` varchar(11) NOT NULL, `description` varchar(255) NULL, `avatarUrl` varchar(255) NULL, `name` varchar(15) NULL, `weight` smallint UNSIGNED NULL, `height` smallint UNSIGNED NULL, `instagramCode` varchar(50) NULL, `youtubeUrl` varchar(255) NULL, `followCount` int UNSIGNED NOT NULL DEFAULT '0', `refundAccountId` int NULL, `passwordEncrypted` varchar(255) NULL, `passwordSalt` varchar(255) NULL, `passwordCreatedat` datetime NULL, INDEX `idx-oauth_code` (`oauthCode`), UNIQUE INDEX `idx-nickname` (`nickname`), UNIQUE INDEX `idx-code` (`code`), UNIQUE INDEX `IDX_c5f78ad8f82e492c25d07f047a` (`code`), UNIQUE INDEX `IDX_e2364281027b926b879fa2fa1e` (`nickname`), UNIQUE INDEX `REL_4859a7a25f8209f14be8403fbb` (`refundAccountId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `shipping_address` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `receiverName` varchar(50) NOT NULL, `phoneNumber` char(11) NOT NULL, `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, `isPrimary` tinyint NOT NULL, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `parentId` int NULL, `mentionedUserId` int NULL, `ownerType` enum ('DIGEST', 'LOOK', 'VIDEO') NOT NULL, `ownerId` int NOT NULL, `content` varchar(255) NULL, `isContentUpdated` tinyint NOT NULL DEFAULT 0, `isDeleted` tinyint NOT NULL DEFAULT 0, `contentUpdatedAt` datetime NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', INDEX `idx-ownerId:id` (`ownerId`, `id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `digest_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `digestId` int NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item_property` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `minorCategoryId` int NOT NULL, `name` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `item_property_value` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `propertyId` int NOT NULL, `name` varchar(20) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `seller` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `businessName` varchar(255) NULL, `businessCode` char(12) NULL, `mailOrderBusinessCode` varchar(255) NULL, `representativeName` varchar(20) NULL, `phoneNumber` varchar(255) NULL, `orderNotiPhoneNumber` varchar(255) NULL, `csNotiPhoneNumber` varchar(255) NULL, `email` varchar(255) NULL, `kakaoTalkCode` varchar(255) NULL, `operationTimeMessage` varchar(255) NULL, `userId` int NULL, `brandId` int NULL, `courierId` int NULL, `saleStrategyId` int NULL, `crawlStrategyId` int NULL, `claimPolicyId` int NULL, `crawlPolicyId` int NULL, `shippingPolicyId` int NULL, `settlePolicyId` int NULL, `returnAddressId` int NULL, UNIQUE INDEX `REL_af49645e98a3d39bd4f3591b33` (`userId`), UNIQUE INDEX `REL_e2dea4bd18238e9ab6bd645c9e` (`brandId`), UNIQUE INDEX `REL_66be13247b9f98820ccb541af3` (`claimPolicyId`), UNIQUE INDEX `REL_0e0175c4cfd4fd8fc9ea06aacb` (`crawlPolicyId`), UNIQUE INDEX `REL_277d5d0fb02ea335bb361b6d5c` (`shippingPolicyId`), UNIQUE INDEX `REL_b0ef5d00859256477eeefb25d3` (`settlePolicyId`), UNIQUE INDEX `REL_d89bdeef7b538af93c258d0a8b` (`returnAddressId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `brand` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `nameKor` varchar(30) NOT NULL, `nameEng` varchar(30) NULL, `description` varchar(255) NULL, `imageUrl` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `brandId` int NULL, `majorCategoryId` int NULL, `minorCategoryId` int NULL, `name` varchar(255) NOT NULL, `description` varchar(255) NULL, `providedCode` varchar(100) NULL, `imageUrl` varchar(255) NOT NULL, `isMdRecommended` tinyint NOT NULL DEFAULT 1, `isSellable` tinyint NOT NULL DEFAULT 0, `isInfiniteStock` tinyint NOT NULL DEFAULT 1, `isPurchasable` tinyint NOT NULL DEFAULT 0, `isSoldout` tinyint NOT NULL DEFAULT 0, `sellableAt` datetime NULL, `digestAverageRating` float NOT NULL DEFAULT '0', `digestCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', `salePolicyId` int NULL, INDEX `idx-minorCategoryId:code` (`minorCategoryId`, `score`), INDEX `idx-majorCategoryId:code` (`majorCategoryId`, `score`), INDEX `idx-providedCode` (`providedCode`), UNIQUE INDEX `REL_b035f04726e12394e3f1d9bb38` (`salePolicyId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_detail_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_option` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `name` varchar(20) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_option_value` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemOptionId` int NOT NULL, `name` varchar(255) NOT NULL, `priceVariant` mediumint UNSIGNED NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `item_price` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `originalPrice` mediumint UNSIGNED NOT NULL, `sellPrice` mediumint UNSIGNED NOT NULL, `finalPrice` mediumint UNSIGNED NOT NULL, `pickkDiscountAmount` mediumint UNSIGNED NULL, `pickkDiscountRate` float NOT NULL DEFAULT '5', `isActive` tinyint NOT NULL, `isCrawlUpdating` tinyint NOT NULL, `isBase` tinyint NOT NULL, `startAt` datetime NULL, `endAt` datetime NULL, `displayPrice` int NULL, `unit` enum ('KRW', 'USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD') NOT NULL DEFAULT 'KRW', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `item_sale_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isUsingStock` tinyint NOT NULL, `quantityLimit` tinyint UNSIGNED NOT NULL, `isUsingQuantityLimit` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_size_chart` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `name` varchar(255) NOT NULL, `totalLength` float NULL, `shoulderWidth` float NULL, `chestWidth` float NULL, `sleeveLength` float NULL, `waistWidth` float NULL, `riseHeight` float NULL, `thighWidth` float NULL, `hemWidth` float NULL, `accWidth` float NULL, `accHeight` float NULL, `accDepth` float NULL, `crossStrapLength` float NULL, `watchBandDepth` float NULL, `glassWidth` float NULL, `glassBridgeLength` float NULL, `glassLegLength` float NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_url` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `url` varchar(255) NOT NULL, `isPrimary` tinyint NOT NULL DEFAULT 0, `isAvailable` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `campaign` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `rate` tinyint UNSIGNED NOT NULL, `startAt` datetime NOT NULL, `endAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `item_category` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(20) NOT NULL, `name` varchar(20) NOT NULL, `nsleft` int NOT NULL DEFAULT '1', `nsright` int NOT NULL DEFAULT '2', `parentId` int NULL, UNIQUE INDEX `IDX_d07bbc72c8822787efab782a6c` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `product_shipping_reserve_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `estimatedShippingBegginDate` datetime NOT NULL, `stock` smallint UNSIGNED NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `product` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NOT NULL, `stock` smallint UNSIGNED NOT NULL DEFAULT '0', `priceVariant` mediumint UNSIGNED NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `shippingReservePolicyId` int NULL, UNIQUE INDEX `REL_e65d1104583c629a62d4ab81ec` (`shippingReservePolicyId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `seller_claim_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `sellerId` int NOT NULL, `fee` mediumint NOT NULL, `phoneNumber` char(11) NOT NULL, `picName` varchar(20) NOT NULL, `description` varchar(500) NULL, `isExchangable` tinyint NOT NULL DEFAULT 1, `isRefundable` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX `REL_d37d7de46f3c7d0aa92fab64ce` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `seller_crawl_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `sellerId` int NOT NULL, `isInspectingNew` tinyint NOT NULL DEFAULT 1, `isUpdatingItems` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX `REL_fb16d9d0385fe3728ac1008b09` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `seller_settle_account` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, `claimPolicyId` int NOT NULL, UNIQUE INDEX `REL_edaf6fe777439339fd78e138df` (`claimPolicyId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `seller_settle_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `sellerId` int NOT NULL, `phoneNumber` char(12) NOT NULL, `picName` varchar(20) NOT NULL, `email` varchar(255) NOT NULL, `rate` tinyint UNSIGNED NOT NULL DEFAULT '70', UNIQUE INDEX `REL_ac3eaee0ae2dccf138a4a38d6c` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `seller_shipping_policy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `sellerId` int NOT NULL, `minimumAmountForFree` mediumint NOT NULL, `fee` mediumint NOT NULL, `description` varchar(500) NULL, UNIQUE INDEX `REL_e9ac1e4f027925394d21a52308` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `seller_crawl_strategy` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `sellerId` int NOT NULL, `itemsSelector` varchar(50) NOT NULL, `codeRegex` varchar(30) NOT NULL, `pagination` tinyint NOT NULL, `pageParam` varchar(20) NULL, `baseUrl` varchar(75) NOT NULL, `startPathNamesJoin` varchar(255) NOT NULL, UNIQUE INDEX `REL_9eb9935015e8ba7813998c22f1` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `seller_return_address` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `receiverName` varchar(50) NOT NULL, `phoneNumber` char(11) NOT NULL, `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, `sellerId` int NOT NULL, UNIQUE INDEX `REL_f92f252d4204da3e245f0f2869` (`sellerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `courier` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(30) NOT NULL, `name` varchar(20) NOT NULL, `phoneNumber` char(12) NOT NULL, `returnReserveUrl` varchar(300) NOT NULL, UNIQUE INDEX `idx-name` (`name`), UNIQUE INDEX `idx-code` (`code`), UNIQUE INDEX `IDX_191d47572c6e09c1598ea39a64` (`code`), UNIQUE INDEX `IDX_0d933ba9421875f18a24b60abc` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `digest` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `itemId` int NULL, `userId` int NULL, `videoId` int NULL, `lookId` int NULL, `size` varchar(30) NOT NULL, `rating` tinyint NULL, `title` varchar(127) NULL, `content` varchar(2047) NULL, `timestampStartSecond` smallint UNSIGNED NULL, `timestampEndSecond` smallint UNSIGNED NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `keyword_class` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('TRENDING', 'ESSENTIAL') NOT NULL, `name` varchar(30) NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', `isVisible` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `keyword` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `imageUrl` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, `stylingTip` varchar(255) NOT NULL, `usablityRate` tinyint UNSIGNED NULL, `isVisible` tinyint NOT NULL DEFAULT 1, `matchTagNames` varchar(100) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', INDEX `idx-score` (`score`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `like` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `ownerType` enum ('DIGEST', 'LOOK', 'VIDEO', 'COMMENT', 'KEYWORD') NOT NULL, `ownerId` int NOT NULL, INDEX `idx-ownerId-userId` (`ownerId`, `userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `look_image` (`key` varchar(75) NOT NULL, `angle` int NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `lookId` int NOT NULL, `order` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (`key`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `look` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `title` varchar(127) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `own` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `keywordId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `video` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `youtubeCode` varchar(40) NOT NULL, `title` varchar(127) NOT NULL, `likeCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `hitCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `commentCount` mediumint UNSIGNED NOT NULL DEFAULT '0', `score` float NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `digests_exhibition_digest` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `exhibitionId` int NOT NULL, `digestId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `digests_exhibition` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `items_exhibition_item` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `exhibitionId` int NOT NULL, `itemId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `items_exhibition` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(50) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `items_package_item` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `packageId` int NOT NULL, `itemId` int NOT NULL, `order` smallint NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `items_package` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(50) NOT NULL, `title` varchar(50) NOT NULL, UNIQUE INDEX `idx-code` (`code`), UNIQUE INDEX `IDX_a250f330fcfa3c053ded264bc9` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `cart_item` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `productId` int NOT NULL, `userId` int NOT NULL, `quantity` smallint UNSIGNED NOT NULL DEFAULT '0', INDEX `idx-createdAt` (`createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `inquiry_answer` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `inquiryId` int NOT NULL, `userId` int NOT NULL, `from` enum ('SELLER', 'ROOT') NOT NULL, `displayAuthor` varchar(30) NOT NULL, `content` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `inquiry` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `itemId` int NULL, `sellerId` int NULL, `orderItemMerchantUid` char NULL, `type` enum ('SHIP', 'SIZE', 'RESTOCK', 'ETC') NOT NULL, `title` varchar(100) NOT NULL, `content` varchar(255) NOT NULL, `contactPhoneNumber` char(12) NOT NULL, `isSecret` tinyint NOT NULL, `isAnswered` tinyint NOT NULL DEFAULT 0, INDEX `idx-createdAt` (`createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `coupon_specification` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `brandId` int NULL, `name` varchar(30) NOT NULL, `type` enum ('RATE', 'AMOUNT') NOT NULL, `discountRate` tinyint UNSIGNED NULL, `discountAmount` mediumint UNSIGNED NULL, `minimumForUse` mediumint UNSIGNED NULL, `maximumDiscountPrice` mediumint UNSIGNED NULL, `availableAt` datetime NULL, `expireAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `coupon` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `specId` int NOT NULL, `status` enum ('READY', 'APPLIED') NOT NULL DEFAULT 'READY', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `shipment` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `status` enum ('SHIPPING', 'SHIPPED', 'CANCELLED', 'FAILED') NOT NULL, `ownerType` enum ('EXCHANGE_REQUEST_PICK', 'EXCHANGE_REQUEST_RESHIP', 'REFUND_REQUEST', 'ORDER_ITEM') NULL, `ownerPk` varchar(30) NULL, `courierId` int NOT NULL, `trackCode` varchar(30) NOT NULL, `lastTrackedAt` datetime NULL, INDEX `idx-status` (`status`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `shipment_history` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `statusText` varchar(50) NOT NULL, `locationName` varchar(20) NOT NULL, `time` datetime NOT NULL, `shipmentId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `exchange_request` (`merchantUid` char(22) NOT NULL, `userId` int NULL, `productId` int NULL, `sellerId` int NULL, `pickShipmentId` int NULL, `reShipmentId` int NULL, `orderItemMerchantUid` char(20) NOT NULL, `status` enum ('REQUESTED', 'PICKED', 'RESHIPPING', 'RESHIPPED', 'REJECTED') NOT NULL, `faultOf` enum ('CUSTOMER', 'SELLER') NOT NULL, `reason` varchar(255) NOT NULL, `rejectReason` varchar(255) NULL, `shippingFee` mediumint UNSIGNED NOT NULL, `quantity` smallint UNSIGNED NOT NULL, `itemName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `isSettled` tinyint NOT NULL DEFAULT 0, `isProcessDelaying` tinyint NOT NULL DEFAULT 0, `processDelayedAt` datetime NULL, `requestedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `pickedAt` datetime NULL, `reshippingAt` datetime NULL, `reshippedAt` datetime NULL, `rejectedAt` datetime NULL, `confirmedAt` datetime NULL, `settledAt` datetime NULL, UNIQUE INDEX `REL_5785dec92cf602ee8cf74df2ac` (`pickShipmentId`), UNIQUE INDEX `REL_0534dce1cf13b2fb7896022ca6` (`reShipmentId`), UNIQUE INDEX `REL_51588d4e1b3a94cb09e0363d92` (`orderItemMerchantUid`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `order_item` (`merchantUid` char(22) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `sellerId` int NULL, `itemId` int NULL, `productId` int NULL, `usedCouponId` int NULL, `shipmentId` int NULL, `orderMerchantUid` char(20) NOT NULL, `status` enum ('PENDING', 'FAILED', 'VBANK_READY', 'VBANK_DODGED', 'PAID', 'SHIP_PENDING', 'SHIP_READY', 'SHIPPPING', 'SHIPPED') NOT NULL, `claimStatus` enum ('CANCEL_REQUESTED', 'CANCELLED', 'EXCHANGE_REQUESTED', 'EXCHANGED', 'REFUND_REQUESTED', 'REFUNDED') NULL, `quantity` smallint UNSIGNED NOT NULL, `isConfirmed` tinyint NOT NULL DEFAULT 0, `isShipReserved` tinyint NOT NULL DEFAULT 0, `isSettled` tinyint NOT NULL DEFAULT 0, `isDelaying` tinyint NOT NULL DEFAULT 0, `isProcessDelaying` tinyint NOT NULL DEFAULT 0, `isFreeShippingPackage` tinyint NOT NULL, `itemFinalPrice` int UNSIGNED NOT NULL, `shippingFee` int UNSIGNED NOT NULL, `couponDiscountAmount` int UNSIGNED NOT NULL DEFAULT '0', `usedPointAmount` int UNSIGNED NOT NULL DEFAULT '0', `usedCouponName` varchar(30) NULL, `brandNameKor` varchar(30) NOT NULL, `itemName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `recommenderId` int NULL, `recommenderNickname` varchar(11) NULL, `recommendContentType` enum ('DIGEST', 'LOOK', 'VIDEO') NULL, `recommendContentItemId` int NULL, `failedAt` datetime NULL, `vbankReadyAt` datetime NULL, `vbankDodgedAt` datetime NULL, `paidAt` datetime NULL, `shipReadyAt` datetime NULL, `shippingAt` datetime NULL, `shippedAt` datetime NULL, `cancelRequestedAt` datetime NULL, `cancelledAt` datetime NULL, `exchangeRequestedAt` datetime NULL, `exchangedAt` datetime NULL, `refundRequestedAt` datetime NULL, `refundedAt` datetime NULL, `delayedAt` datetime NULL, `delayedShipExpectedAt` datetime NULL, `processDelayedAt` datetime NULL, `shipReservedAt` datetime NULL, `confirmedAt` datetime NULL, `settledAt` datetime NULL, `refundRequestMerchantUid` char(20) NULL, UNIQUE INDEX `REL_3f11f0bbd532d03ef4d9c44f41` (`shipmentId`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `order_buyer` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(15) NOT NULL, `email` varchar(255) NOT NULL, `phoneNumber` char(12) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `order_receiver` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(30) NOT NULL, `receiverName` varchar(50) NOT NULL, `phoneNumber` char(11) NOT NULL, `baseAddress` varchar(255) NOT NULL, `detailAddress` varchar(255) NOT NULL, `postalCode` varchar(255) NOT NULL, `message` varchar(50) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `order_refund_account` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `order_vbank_receipt` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `bankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NOT NULL, `number` varchar(14) NOT NULL, `ownerName` varchar(255) NOT NULL, `due` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `order` (`merchantUid` char(20) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `status` enum ('PENDING', 'PAYING', 'FAILED', 'VBANK_READY', 'VBANK_DODGED', 'PAID') NOT NULL, `payMethod` enum ('card', 'trans', 'vbank', 'phone', 'samsungpay', 'kpay', 'kakaopay', 'payco', 'lpay', 'ssgpay', 'tosspay', 'cultureland', 'smartculture', 'happymoney', 'booknlife', 'point', 'naverpay', 'chaipay') NULL, `payingAt` datetime NULL, `failedAt` datetime NULL, `vbankReadyAt` datetime NULL, `vbankDodgedAt` datetime NULL, `paidAt` datetime NULL, `withdrawnAt` datetime NULL, `vbankReceiptId` int NULL, `buyerId` int NULL, `receiverId` int NULL, `refundAccountId` int NULL, UNIQUE INDEX `REL_86777bc5e52132792a38468161` (`vbankReceiptId`), UNIQUE INDEX `REL_20981b2b68bf03393c44dd1b9d` (`buyerId`), UNIQUE INDEX `REL_0ba887a07aa531f6c5821950ec` (`receiverId`), UNIQUE INDEX `REL_7b8ec169516a3cd948e47f2116` (`refundAccountId`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `expected_point_event` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(30) NOT NULL, `content` varchar(30) NOT NULL, `amount` int NOT NULL, `orderItemMerchantUid` char(22) NULL, `userId` int NOT NULL, INDEX `idx-orderItemMerchantUid` (`orderItemMerchantUid`), INDEX `idx-createdAt` (`userId`, `createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      "CREATE TABLE `point_event` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(30) NOT NULL, `content` varchar(30) NOT NULL, `type` enum ('ADD', 'SUB') NOT NULL, `amount` int NOT NULL, `resultBalance` int UNSIGNED NOT NULL, `orderItemMerchantUid` char(22) NULL, `userId` int NOT NULL, INDEX `idx-orderItemMerchantUid` (`orderItemMerchantUid`), INDEX `idx-createdAt` (`userId`, `createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `refund_request` (`merchantUid` char(20) NOT NULL, `sellerId` int NULL, `userId` int NULL, `shipmentId` int NULL, `orderMerchantUid` char(20) NOT NULL, `status` enum ('REQUESTED', 'PICKED', 'REJECTED', 'CONFIRMED') NOT NULL, `faultOf` enum ('CUSTOMER', 'SELLER') NOT NULL, `reason` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL, `shippingFee` mediumint UNSIGNED NOT NULL, `rejectReason` varchar(255) NULL, `isSettled` tinyint NOT NULL DEFAULT 0, `isProcessDelaying` tinyint NOT NULL DEFAULT 0, `processDelayedAt` datetime NULL, `requestedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `pickedAt` datetime NULL, `rejectedAt` datetime NULL, `confirmedAt` datetime NULL, `settledAt` datetime NULL, UNIQUE INDEX `REL_9f823dc7c469bc50c123b06ad2` (`shipmentId`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `payment_cancellation` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('CANCEL', 'PARTIAL_CANCEL') NOT NULL, `amount` int UNSIGNED NOT NULL, `reason` varchar(30) NOT NULL, `taxFree` int UNSIGNED NOT NULL DEFAULT '0', `refundVbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `refundVbankNum` varchar(255) NULL, `refundVbankHolder` varchar(15) NULL, `paymentMerchantUid` char(20) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `payment` (`merchantUid` char(20) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` enum ('PENDING', 'VBANK_READY', 'PAID', 'CANCELLED', 'PARTIAL_CANCELLED', 'VBANK_DODGED', 'FAILED') NOT NULL, `env` enum ('PC', 'MOBILE') NOT NULL, `origin` varchar(255) NOT NULL, `pg` enum ('inicis') NOT NULL, `pgTid` varchar(255) NULL, `payMethod` enum ('card', 'trans', 'vbank', 'phone', 'samsungpay', 'kpay', 'kakaopay', 'payco', 'lpay', 'ssgpay', 'tosspay', 'cultureland', 'smartculture', 'happymoney', 'booknlife', 'point', 'naverpay', 'chaipay') NOT NULL, `name` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL, `failedReason` varchar(255) NULL, `buyerName` varchar(20) NOT NULL, `buyerTel` char(11) NOT NULL, `buyerEmail` varchar(255) NOT NULL, `buyerPostalcode` char(6) NOT NULL, `buyerAddr` varchar(255) NOT NULL, `applyNum` varchar(255) NULL, `cardCode` enum ('01', '03', '04', '06', '11', '12', '14', '15', '16', '17', '21', '22', '23', '24', '25', '91', '93', '94', '96', '97', '98') NULL, `cardNum` varchar(255) NULL, `vbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `vbankNum` varchar(255) NULL, `vbankHolder` varchar(15) NULL, `vbankDate` timestamp NULL, `failedAt` timestamp NULL, `vbankReadyAt` timestamp NULL, `paidAt` timestamp NULL, `cancelledAt` timestamp NULL, `vbankDodgedAt` timestamp NULL, INDEX `id_pg-tid` (`pgTid`), PRIMARY KEY (`merchantUid`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      'CREATE TABLE `follow` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `targetId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `user_style_tags_style_tag` (`userId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_ab5b3f0f96f8c238e8c9b46c12` (`userId`), INDEX `IDX_fc54ad7a80b2c1258b583a8a16` (`styleTagId`), PRIMARY KEY (`userId`, `styleTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `item_campaigns_campaign` (`itemId` int NOT NULL, `campaignId` int NOT NULL, INDEX `IDX_9f4e664a60b28c994f75ff1a52` (`itemId`), INDEX `IDX_dee536cf72aa709878bcceabb7` (`campaignId`), PRIMARY KEY (`itemId`, `campaignId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `campaign_items_item` (`campaignId` int NOT NULL, `itemId` int NOT NULL, INDEX `IDX_e88178df6976899a2725262446` (`campaignId`), INDEX `IDX_6e191dfbfbcb0910ed970fa24d` (`itemId`), PRIMARY KEY (`campaignId`, `itemId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `product_item_option_values_item_option_value` (`productId` int NOT NULL, `itemOptionValueId` int NOT NULL, INDEX `IDX_8bdee6d744c73248fcc7258b5f` (`productId`), INDEX `IDX_4625cd32527c50caa22d6c90b9` (`itemOptionValueId`), PRIMARY KEY (`productId`, `itemOptionValueId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `digest_item_property_values_item_property_value` (`digestId` int NOT NULL, `itemPropertyValueId` int NOT NULL, INDEX `IDX_ba11b49f945cf8c77b8e4aca14` (`digestId`), INDEX `IDX_950ef07eadf73a33332e7fa144` (`itemPropertyValueId`), PRIMARY KEY (`digestId`, `itemPropertyValueId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_classes_keyword_class` (`keywordId` int NOT NULL, `keywordClassId` int NOT NULL, INDEX `IDX_93d5b989400c088dcaba985fb0` (`keywordId`), INDEX `IDX_bb91164deadfeef7c94b63bb07` (`keywordClassId`), PRIMARY KEY (`keywordId`, `keywordClassId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_style_tags_style_tag` (`keywordId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_d3ba4d2c7db33fb60058df5be9` (`keywordId`), INDEX `IDX_10d76be04071199c762c0621bb` (`styleTagId`), PRIMARY KEY (`keywordId`, `styleTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_looks_look` (`keywordId` int NOT NULL, `lookId` int NOT NULL, INDEX `IDX_076c584979a61294b4d3099455` (`keywordId`), INDEX `IDX_2031f60fdbe0a1df4ca76625eb` (`lookId`), PRIMARY KEY (`keywordId`, `lookId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_digests_digest` (`keywordId` int NOT NULL, `digestId` int NOT NULL, INDEX `IDX_2eadcba607b668fd3d7eacfe58` (`keywordId`), INDEX `IDX_505aac2646de3168bb120d40da` (`digestId`), PRIMARY KEY (`keywordId`, `digestId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `keyword_related_keywords_keyword` (`keywordId_1` int NOT NULL, `keywordId_2` int NOT NULL, INDEX `IDX_95520e40d9086a39c5a8570d25` (`keywordId_1`), INDEX `IDX_ccdfba40a677c7d2bb4083cba5` (`keywordId_2`), PRIMARY KEY (`keywordId_1`, `keywordId_2`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `look_style_tags_style_tag` (`lookId` int NOT NULL, `styleTagId` int NOT NULL, INDEX `IDX_55a0329aa173c7404338358987` (`lookId`), INDEX `IDX_70c58ab5f8a4106e4598b05471` (`styleTagId`), PRIMARY KEY (`lookId`, `styleTagId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` ADD CONSTRAINT `FK_5d7111cc1ad19e5dfff60c710c5` FOREIGN KEY (`jobName`) REFERENCES `job`(`name`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` ADD CONSTRAINT `FK_db11fb436072f887093856e50e3` FOREIGN KEY (`contextRecordId`) REFERENCES `job_execution_context_record`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `step_execution_record` ADD CONSTRAINT `FK_2f6a6f5229839894966b0860cca` FOREIGN KEY (`jobExecutionRecordId`) REFERENCES `job_execution_record`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_4859a7a25f8209f14be8403fbbf` FOREIGN KEY (`refundAccountId`) REFERENCES `refund_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` ADD CONSTRAINT `FK_2aa99b101de6fb5f3089bd4b7a9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_e3aebe2bd1c53467a07109be596` FOREIGN KEY (`parentId`) REFERENCES `comment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` ADD CONSTRAINT `FK_02e7470670d28ed8dd1ecb554db` FOREIGN KEY (`mentionedUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_image` ADD CONSTRAINT `FK_5d0fe9db75bd515214126177827` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property` ADD CONSTRAINT `FK_5adab74309e170a067236c83f29` FOREIGN KEY (`minorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property_value` ADD CONSTRAINT `FK_6c99732cbdc0ece066e64eb4c7c` FOREIGN KEY (`propertyId`) REFERENCES `item_property`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_af49645e98a3d39bd4f3591b334` FOREIGN KEY (`userId`) REFERENCES `brand`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_e2dea4bd18238e9ab6bd645c9e3` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_0008b48ab8799d2a86e76ae53f3` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_5673d465e89fe9283d00fe5b4da` FOREIGN KEY (`saleStrategyId`) REFERENCES `sale_strategy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_6e1ea2cb14fb71730bcb4a64fea` FOREIGN KEY (`crawlStrategyId`) REFERENCES `seller_crawl_strategy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_66be13247b9f98820ccb541af33` FOREIGN KEY (`claimPolicyId`) REFERENCES `seller_claim_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_0e0175c4cfd4fd8fc9ea06aacb8` FOREIGN KEY (`crawlPolicyId`) REFERENCES `seller_crawl_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_277d5d0fb02ea335bb361b6d5c3` FOREIGN KEY (`shippingPolicyId`) REFERENCES `seller_shipping_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_b0ef5d00859256477eeefb25d35` FOREIGN KEY (`settlePolicyId`) REFERENCES `seller_settle_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` ADD CONSTRAINT `FK_d89bdeef7b538af93c258d0a8be` FOREIGN KEY (`returnAddressId`) REFERENCES `seller_return_address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_9e2a16fa67338b5d7ba015b4e98` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_997e492bfce50fe9ab960f5f5e3` FOREIGN KEY (`majorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_72ffb04a22a24bfed2824ba9e4e` FOREIGN KEY (`minorCategoryId`) REFERENCES `item_category`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item` ADD CONSTRAINT `FK_b035f04726e12394e3f1d9bb388` FOREIGN KEY (`salePolicyId`) REFERENCES `item_sale_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_detail_image` ADD CONSTRAINT `FK_56aa44843bb95f27172978212ee` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option` ADD CONSTRAINT `FK_29234bbba073cb0761b4c65b417` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` ADD CONSTRAINT `FK_61cf3898eff489ea9e5b86e383b` FOREIGN KEY (`itemOptionId`) REFERENCES `item_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` ADD CONSTRAINT `FK_f8046453707754686bb1775ef71` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_size_chart` ADD CONSTRAINT `FK_f19e44c9f3cb1b30dce76f9b84e` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_url` ADD CONSTRAINT `FK_d6e09541765216738641861da02` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` ADD CONSTRAINT `FK_97f8cf61daf55820a4dd514f312` FOREIGN KEY (`parentId`) REFERENCES `item_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_eaad2f56c02ff99383ee85a1410` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_e65d1104583c629a62d4ab81ec8` FOREIGN KEY (`shippingReservePolicyId`) REFERENCES `product_shipping_reserve_policy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` ADD CONSTRAINT `FK_d37d7de46f3c7d0aa92fab64ce0` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_policy` ADD CONSTRAINT `FK_fb16d9d0385fe3728ac1008b094` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_account` ADD CONSTRAINT `FK_edaf6fe777439339fd78e138df2` FOREIGN KEY (`claimPolicyId`) REFERENCES `seller_claim_policy`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_policy` ADD CONSTRAINT `FK_ac3eaee0ae2dccf138a4a38d6c0` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_shipping_policy` ADD CONSTRAINT `FK_e9ac1e4f027925394d21a52308f` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` ADD CONSTRAINT `FK_9eb9935015e8ba7813998c22f15` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` ADD CONSTRAINT `FK_f92f252d4204da3e245f0f28690` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_1c1435c2b5e04100ba08672b10a` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_5a92196da371955acc43aaf5ec0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_d4778a767502d9b4fa6a1cd8bec` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` ADD CONSTRAINT `FK_2a68d8ccbca72ce0834f309ac77` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `like` ADD CONSTRAINT `FK_e8fb739f08d47955a39850fac23` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `look_image` ADD CONSTRAINT `FK_f70ed6310d1a5b6a546343bc684` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `look` ADD CONSTRAINT `FK_bd61f80f0ee2f3184f7abd2fe6b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `own` ADD CONSTRAINT `FK_a378d5b3b4375043c504affeabc` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `own` ADD CONSTRAINT `FK_a12c6fb849e22a2dc8ca18a0692` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `video` ADD CONSTRAINT `FK_74e27b13f8ac66f999400df12f6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` ADD CONSTRAINT `FK_dee3e7ac54a4e308d04931e03bc` FOREIGN KEY (`exhibitionId`) REFERENCES `digests_exhibition`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` ADD CONSTRAINT `FK_08e330cc8fdeb47c976964e4029` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` ADD CONSTRAINT `FK_6a1ac450eb4797d93cb9a596f82` FOREIGN KEY (`exhibitionId`) REFERENCES `items_exhibition`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` ADD CONSTRAINT `FK_92365ef1e6ef69f5556009569df` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` ADD CONSTRAINT `FK_c34d1ba9b8145d1a914b7fc5bf0` FOREIGN KEY (`packageId`) REFERENCES `items_package`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` ADD CONSTRAINT `FK_2b46125e748448c449bb4355385` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` ADD CONSTRAINT `FK_75db0de134fe0f9fe9e4591b7bf` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` ADD CONSTRAINT `FK_158f0325ccf7f68a5b395fa2f6a` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` ADD CONSTRAINT `FK_8815604b164e0c4a9a158c3d9b7` FOREIGN KEY (`inquiryId`) REFERENCES `inquiry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` ADD CONSTRAINT `FK_16d3c3c32df94451ca954db5453` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_7806c6fea3e0ff475bb422ba0c0` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_5defbf3c37097863e15d8cc4663` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_0f4729ebc4aa62cb8d0623709e6` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` ADD CONSTRAINT `FK_d07525dde1dd19d2190b8279191` FOREIGN KEY (`orderItemMerchantUid`) REFERENCES `order_item`(`merchantUid`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon_specification` ADD CONSTRAINT `FK_4fd0c6578a6d5696af065861afe` FOREIGN KEY (`brandId`) REFERENCES `brand`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` ADD CONSTRAINT `FK_03de14bf5e5b4410fced2ca9935` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` ADD CONSTRAINT `FK_9381719063f5a017b5b07c99460` FOREIGN KEY (`specId`) REFERENCES `coupon_specification`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment` ADD CONSTRAINT `FK_8c6acef92eca3ea7d987e817649` FOREIGN KEY (`courierId`) REFERENCES `courier`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` ADD CONSTRAINT `FK_727d8ee6eb73b8483634769fb20` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_af4b3e36c73378c6905a030c596` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_37ac6cc40a16dcf3cfe71f6aa42` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_3b4625c136bee67bb53b886a0ed` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_5785dec92cf602ee8cf74df2acb` FOREIGN KEY (`pickShipmentId`) REFERENCES `shipment`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_0534dce1cf13b2fb7896022ca6a` FOREIGN KEY (`reShipmentId`) REFERENCES `shipment`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` ADD CONSTRAINT `FK_51588d4e1b3a94cb09e0363d92c` FOREIGN KEY (`orderItemMerchantUid`) REFERENCES `order_item`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_845716d96530a440c6cdc6c7346` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_accbcd2a4efb9b9354fa0acdd44` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_e03f3ed4dab80a3bf3eca50babc` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_904370c093ceea4369659a3c810` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_f04c1be37cdd4dc8b5b8216002f` FOREIGN KEY (`usedCouponId`) REFERENCES `coupon`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_3f11f0bbd532d03ef4d9c44f41e` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_cfa63773c75aa44395ebcd491ff` FOREIGN KEY (`orderMerchantUid`) REFERENCES `order`(`merchantUid`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_8a4a675ef1d951ccee274ed5b36` FOREIGN KEY (`refundRequestMerchantUid`) REFERENCES `refund_request`(`merchantUid`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_caabe91507b3379c7ba73637b84` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_86777bc5e52132792a384681610` FOREIGN KEY (`vbankReceiptId`) REFERENCES `order_vbank_receipt`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_20981b2b68bf03393c44dd1b9d7` FOREIGN KEY (`buyerId`) REFERENCES `order_buyer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_0ba887a07aa531f6c5821950ec0` FOREIGN KEY (`receiverId`) REFERENCES `order_receiver`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_7b8ec169516a3cd948e47f2116f` FOREIGN KEY (`refundAccountId`) REFERENCES `order_refund_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `expected_point_event` ADD CONSTRAINT `FK_e9324f8dd28306b3e98c4969f6d` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `point_event` ADD CONSTRAINT `FK_9f5f91f3080199d4c4bd35abd00` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_84ee57a271f20859698e35bc252` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_7c0a897722ae26cd0c25a1c4d00` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_9f823dc7c469bc50c123b06ad28` FOREIGN KEY (`shipmentId`) REFERENCES `shipment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` ADD CONSTRAINT `FK_6d5ce5d85844cc91aa603e34356` FOREIGN KEY (`orderMerchantUid`) REFERENCES `order`(`merchantUid`) ON DELETE RESTRICT ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `payment_cancellation` ADD CONSTRAINT `FK_431ae61d7ba0e61a1ce043b9fe1` FOREIGN KEY (`paymentMerchantUid`) REFERENCES `payment`(`merchantUid`) ON DELETE RESTRICT ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` ADD CONSTRAINT `FK_af9f90ce5e8f66f845ebbcc6f15` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` ADD CONSTRAINT `FK_4bf84f2920a2ef651ec66538d2d` FOREIGN KEY (`targetId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` ADD CONSTRAINT `FK_ab5b3f0f96f8c238e8c9b46c126` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` ADD CONSTRAINT `FK_fc54ad7a80b2c1258b583a8a164` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` ADD CONSTRAINT `FK_9f4e664a60b28c994f75ff1a52d` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` ADD CONSTRAINT `FK_dee536cf72aa709878bcceabb70` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `campaign_items_item` ADD CONSTRAINT `FK_e88178df6976899a2725262446b` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `campaign_items_item` ADD CONSTRAINT `FK_6e191dfbfbcb0910ed970fa24d1` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` ADD CONSTRAINT `FK_8bdee6d744c73248fcc7258b5fd` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` ADD CONSTRAINT `FK_4625cd32527c50caa22d6c90b91` FOREIGN KEY (`itemOptionValueId`) REFERENCES `item_option_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` ADD CONSTRAINT `FK_ba11b49f945cf8c77b8e4aca145` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` ADD CONSTRAINT `FK_950ef07eadf73a33332e7fa144b` FOREIGN KEY (`itemPropertyValueId`) REFERENCES `item_property_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_classes_keyword_class` ADD CONSTRAINT `FK_93d5b989400c088dcaba985fb0a` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_classes_keyword_class` ADD CONSTRAINT `FK_bb91164deadfeef7c94b63bb073` FOREIGN KEY (`keywordClassId`) REFERENCES `keyword_class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` ADD CONSTRAINT `FK_d3ba4d2c7db33fb60058df5be96` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` ADD CONSTRAINT `FK_10d76be04071199c762c0621bb2` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_076c584979a61294b4d3099455d` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` ADD CONSTRAINT `FK_2031f60fdbe0a1df4ca76625eb9` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_2eadcba607b668fd3d7eacfe58e` FOREIGN KEY (`keywordId`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` ADD CONSTRAINT `FK_505aac2646de3168bb120d40da0` FOREIGN KEY (`digestId`) REFERENCES `digest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` ADD CONSTRAINT `FK_95520e40d9086a39c5a8570d259` FOREIGN KEY (`keywordId_1`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` ADD CONSTRAINT `FK_ccdfba40a677c7d2bb4083cba5a` FOREIGN KEY (`keywordId_2`) REFERENCES `keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` ADD CONSTRAINT `FK_55a0329aa173c74043383589878` FOREIGN KEY (`lookId`) REFERENCES `look`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` ADD CONSTRAINT `FK_70c58ab5f8a4106e4598b05471a` FOREIGN KEY (`styleTagId`) REFERENCES `style_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` DROP FOREIGN KEY `FK_70c58ab5f8a4106e4598b05471a`'
    );
    await queryRunner.query(
      'ALTER TABLE `look_style_tags_style_tag` DROP FOREIGN KEY `FK_55a0329aa173c74043383589878`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` DROP FOREIGN KEY `FK_ccdfba40a677c7d2bb4083cba5a`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_related_keywords_keyword` DROP FOREIGN KEY `FK_95520e40d9086a39c5a8570d259`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_505aac2646de3168bb120d40da0`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_digests_digest` DROP FOREIGN KEY `FK_2eadcba607b668fd3d7eacfe58e`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_2031f60fdbe0a1df4ca76625eb9`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_looks_look` DROP FOREIGN KEY `FK_076c584979a61294b4d3099455d`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` DROP FOREIGN KEY `FK_10d76be04071199c762c0621bb2`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_style_tags_style_tag` DROP FOREIGN KEY `FK_d3ba4d2c7db33fb60058df5be96`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_classes_keyword_class` DROP FOREIGN KEY `FK_bb91164deadfeef7c94b63bb073`'
    );
    await queryRunner.query(
      'ALTER TABLE `keyword_classes_keyword_class` DROP FOREIGN KEY `FK_93d5b989400c088dcaba985fb0a`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` DROP FOREIGN KEY `FK_950ef07eadf73a33332e7fa144b`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_item_property_values_item_property_value` DROP FOREIGN KEY `FK_ba11b49f945cf8c77b8e4aca145`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` DROP FOREIGN KEY `FK_4625cd32527c50caa22d6c90b91`'
    );
    await queryRunner.query(
      'ALTER TABLE `product_item_option_values_item_option_value` DROP FOREIGN KEY `FK_8bdee6d744c73248fcc7258b5fd`'
    );
    await queryRunner.query(
      'ALTER TABLE `campaign_items_item` DROP FOREIGN KEY `FK_6e191dfbfbcb0910ed970fa24d1`'
    );
    await queryRunner.query(
      'ALTER TABLE `campaign_items_item` DROP FOREIGN KEY `FK_e88178df6976899a2725262446b`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` DROP FOREIGN KEY `FK_dee536cf72aa709878bcceabb70`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_campaigns_campaign` DROP FOREIGN KEY `FK_9f4e664a60b28c994f75ff1a52d`'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` DROP FOREIGN KEY `FK_fc54ad7a80b2c1258b583a8a164`'
    );
    await queryRunner.query(
      'ALTER TABLE `user_style_tags_style_tag` DROP FOREIGN KEY `FK_ab5b3f0f96f8c238e8c9b46c126`'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` DROP FOREIGN KEY `FK_4bf84f2920a2ef651ec66538d2d`'
    );
    await queryRunner.query(
      'ALTER TABLE `follow` DROP FOREIGN KEY `FK_af9f90ce5e8f66f845ebbcc6f15`'
    );
    await queryRunner.query(
      'ALTER TABLE `payment_cancellation` DROP FOREIGN KEY `FK_431ae61d7ba0e61a1ce043b9fe1`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_6d5ce5d85844cc91aa603e34356`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_9f823dc7c469bc50c123b06ad28`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_7c0a897722ae26cd0c25a1c4d00`'
    );
    await queryRunner.query(
      'ALTER TABLE `refund_request` DROP FOREIGN KEY `FK_84ee57a271f20859698e35bc252`'
    );
    await queryRunner.query(
      'ALTER TABLE `point_event` DROP FOREIGN KEY `FK_9f5f91f3080199d4c4bd35abd00`'
    );
    await queryRunner.query(
      'ALTER TABLE `expected_point_event` DROP FOREIGN KEY `FK_e9324f8dd28306b3e98c4969f6d`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_7b8ec169516a3cd948e47f2116f`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_0ba887a07aa531f6c5821950ec0`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_20981b2b68bf03393c44dd1b9d7`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_86777bc5e52132792a384681610`'
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_caabe91507b3379c7ba73637b84`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_8a4a675ef1d951ccee274ed5b36`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_cfa63773c75aa44395ebcd491ff`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_3f11f0bbd532d03ef4d9c44f41e`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_f04c1be37cdd4dc8b5b8216002f`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_904370c093ceea4369659a3c810`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_e03f3ed4dab80a3bf3eca50babc`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_accbcd2a4efb9b9354fa0acdd44`'
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_845716d96530a440c6cdc6c7346`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_51588d4e1b3a94cb09e0363d92c`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_0534dce1cf13b2fb7896022ca6a`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_5785dec92cf602ee8cf74df2acb`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_3b4625c136bee67bb53b886a0ed`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_37ac6cc40a16dcf3cfe71f6aa42`'
    );
    await queryRunner.query(
      'ALTER TABLE `exchange_request` DROP FOREIGN KEY `FK_af4b3e36c73378c6905a030c596`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment_history` DROP FOREIGN KEY `FK_727d8ee6eb73b8483634769fb20`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipment` DROP FOREIGN KEY `FK_8c6acef92eca3ea7d987e817649`'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` DROP FOREIGN KEY `FK_9381719063f5a017b5b07c99460`'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon` DROP FOREIGN KEY `FK_03de14bf5e5b4410fced2ca9935`'
    );
    await queryRunner.query(
      'ALTER TABLE `coupon_specification` DROP FOREIGN KEY `FK_4fd0c6578a6d5696af065861afe`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_d07525dde1dd19d2190b8279191`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_0f4729ebc4aa62cb8d0623709e6`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_5defbf3c37097863e15d8cc4663`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry` DROP FOREIGN KEY `FK_7806c6fea3e0ff475bb422ba0c0`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` DROP FOREIGN KEY `FK_16d3c3c32df94451ca954db5453`'
    );
    await queryRunner.query(
      'ALTER TABLE `inquiry_answer` DROP FOREIGN KEY `FK_8815604b164e0c4a9a158c3d9b7`'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_158f0325ccf7f68a5b395fa2f6a`'
    );
    await queryRunner.query(
      'ALTER TABLE `cart_item` DROP FOREIGN KEY `FK_75db0de134fe0f9fe9e4591b7bf`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` DROP FOREIGN KEY `FK_2b46125e748448c449bb4355385`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_package_item` DROP FOREIGN KEY `FK_c34d1ba9b8145d1a914b7fc5bf0`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` DROP FOREIGN KEY `FK_92365ef1e6ef69f5556009569df`'
    );
    await queryRunner.query(
      'ALTER TABLE `items_exhibition_item` DROP FOREIGN KEY `FK_6a1ac450eb4797d93cb9a596f82`'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` DROP FOREIGN KEY `FK_08e330cc8fdeb47c976964e4029`'
    );
    await queryRunner.query(
      'ALTER TABLE `digests_exhibition_digest` DROP FOREIGN KEY `FK_dee3e7ac54a4e308d04931e03bc`'
    );
    await queryRunner.query(
      'ALTER TABLE `video` DROP FOREIGN KEY `FK_74e27b13f8ac66f999400df12f6`'
    );
    await queryRunner.query(
      'ALTER TABLE `own` DROP FOREIGN KEY `FK_a12c6fb849e22a2dc8ca18a0692`'
    );
    await queryRunner.query(
      'ALTER TABLE `own` DROP FOREIGN KEY `FK_a378d5b3b4375043c504affeabc`'
    );
    await queryRunner.query(
      'ALTER TABLE `look` DROP FOREIGN KEY `FK_bd61f80f0ee2f3184f7abd2fe6b`'
    );
    await queryRunner.query(
      'ALTER TABLE `look_image` DROP FOREIGN KEY `FK_f70ed6310d1a5b6a546343bc684`'
    );
    await queryRunner.query(
      'ALTER TABLE `like` DROP FOREIGN KEY `FK_e8fb739f08d47955a39850fac23`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_2a68d8ccbca72ce0834f309ac77`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_d4778a767502d9b4fa6a1cd8bec`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_5a92196da371955acc43aaf5ec0`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest` DROP FOREIGN KEY `FK_1c1435c2b5e04100ba08672b10a`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_return_address` DROP FOREIGN KEY `FK_f92f252d4204da3e245f0f28690`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_strategy` DROP FOREIGN KEY `FK_9eb9935015e8ba7813998c22f15`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_shipping_policy` DROP FOREIGN KEY `FK_e9ac1e4f027925394d21a52308f`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_policy` DROP FOREIGN KEY `FK_ac3eaee0ae2dccf138a4a38d6c0`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_settle_account` DROP FOREIGN KEY `FK_edaf6fe777439339fd78e138df2`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_crawl_policy` DROP FOREIGN KEY `FK_fb16d9d0385fe3728ac1008b094`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller_claim_policy` DROP FOREIGN KEY `FK_d37d7de46f3c7d0aa92fab64ce0`'
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_e65d1104583c629a62d4ab81ec8`'
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_eaad2f56c02ff99383ee85a1410`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_category` DROP FOREIGN KEY `FK_97f8cf61daf55820a4dd514f312`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_url` DROP FOREIGN KEY `FK_d6e09541765216738641861da02`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_size_chart` DROP FOREIGN KEY `FK_f19e44c9f3cb1b30dce76f9b84e`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_price` DROP FOREIGN KEY `FK_f8046453707754686bb1775ef71`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option_value` DROP FOREIGN KEY `FK_61cf3898eff489ea9e5b86e383b`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_option` DROP FOREIGN KEY `FK_29234bbba073cb0761b4c65b417`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_detail_image` DROP FOREIGN KEY `FK_56aa44843bb95f27172978212ee`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_b035f04726e12394e3f1d9bb388`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_72ffb04a22a24bfed2824ba9e4e`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_997e492bfce50fe9ab960f5f5e3`'
    );
    await queryRunner.query(
      'ALTER TABLE `item` DROP FOREIGN KEY `FK_9e2a16fa67338b5d7ba015b4e98`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_d89bdeef7b538af93c258d0a8be`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_b0ef5d00859256477eeefb25d35`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_277d5d0fb02ea335bb361b6d5c3`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_0e0175c4cfd4fd8fc9ea06aacb8`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_66be13247b9f98820ccb541af33`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_6e1ea2cb14fb71730bcb4a64fea`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_5673d465e89fe9283d00fe5b4da`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_0008b48ab8799d2a86e76ae53f3`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_e2dea4bd18238e9ab6bd645c9e3`'
    );
    await queryRunner.query(
      'ALTER TABLE `seller` DROP FOREIGN KEY `FK_af49645e98a3d39bd4f3591b334`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property_value` DROP FOREIGN KEY `FK_6c99732cbdc0ece066e64eb4c7c`'
    );
    await queryRunner.query(
      'ALTER TABLE `item_property` DROP FOREIGN KEY `FK_5adab74309e170a067236c83f29`'
    );
    await queryRunner.query(
      'ALTER TABLE `digest_image` DROP FOREIGN KEY `FK_5d0fe9db75bd515214126177827`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_02e7470670d28ed8dd1ecb554db`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_e3aebe2bd1c53467a07109be596`'
    );
    await queryRunner.query(
      'ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`'
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_address` DROP FOREIGN KEY `FK_2aa99b101de6fb5f3089bd4b7a9`'
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_4859a7a25f8209f14be8403fbbf`'
    );
    await queryRunner.query(
      'ALTER TABLE `step_execution_record` DROP FOREIGN KEY `FK_2f6a6f5229839894966b0860cca`'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` DROP FOREIGN KEY `FK_db11fb436072f887093856e50e3`'
    );
    await queryRunner.query(
      'ALTER TABLE `job_execution_record` DROP FOREIGN KEY `FK_5d7111cc1ad19e5dfff60c710c5`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_70c58ab5f8a4106e4598b05471` ON `look_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_55a0329aa173c7404338358987` ON `look_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `look_style_tags_style_tag`');
    await queryRunner.query(
      'DROP INDEX `IDX_ccdfba40a677c7d2bb4083cba5` ON `keyword_related_keywords_keyword`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_95520e40d9086a39c5a8570d25` ON `keyword_related_keywords_keyword`'
    );
    await queryRunner.query('DROP TABLE `keyword_related_keywords_keyword`');
    await queryRunner.query(
      'DROP INDEX `IDX_505aac2646de3168bb120d40da` ON `keyword_digests_digest`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2eadcba607b668fd3d7eacfe58` ON `keyword_digests_digest`'
    );
    await queryRunner.query('DROP TABLE `keyword_digests_digest`');
    await queryRunner.query(
      'DROP INDEX `IDX_2031f60fdbe0a1df4ca76625eb` ON `keyword_looks_look`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_076c584979a61294b4d3099455` ON `keyword_looks_look`'
    );
    await queryRunner.query('DROP TABLE `keyword_looks_look`');
    await queryRunner.query(
      'DROP INDEX `IDX_10d76be04071199c762c0621bb` ON `keyword_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_d3ba4d2c7db33fb60058df5be9` ON `keyword_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `keyword_style_tags_style_tag`');
    await queryRunner.query(
      'DROP INDEX `IDX_bb91164deadfeef7c94b63bb07` ON `keyword_classes_keyword_class`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_93d5b989400c088dcaba985fb0` ON `keyword_classes_keyword_class`'
    );
    await queryRunner.query('DROP TABLE `keyword_classes_keyword_class`');
    await queryRunner.query(
      'DROP INDEX `IDX_950ef07eadf73a33332e7fa144` ON `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ba11b49f945cf8c77b8e4aca14` ON `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query(
      'DROP TABLE `digest_item_property_values_item_property_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_4625cd32527c50caa22d6c90b9` ON `product_item_option_values_item_option_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8bdee6d744c73248fcc7258b5f` ON `product_item_option_values_item_option_value`'
    );
    await queryRunner.query(
      'DROP TABLE `product_item_option_values_item_option_value`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6e191dfbfbcb0910ed970fa24d` ON `campaign_items_item`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_e88178df6976899a2725262446` ON `campaign_items_item`'
    );
    await queryRunner.query('DROP TABLE `campaign_items_item`');
    await queryRunner.query(
      'DROP INDEX `IDX_dee536cf72aa709878bcceabb7` ON `item_campaigns_campaign`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_9f4e664a60b28c994f75ff1a52` ON `item_campaigns_campaign`'
    );
    await queryRunner.query('DROP TABLE `item_campaigns_campaign`');
    await queryRunner.query(
      'DROP INDEX `IDX_fc54ad7a80b2c1258b583a8a16` ON `user_style_tags_style_tag`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ab5b3f0f96f8c238e8c9b46c12` ON `user_style_tags_style_tag`'
    );
    await queryRunner.query('DROP TABLE `user_style_tags_style_tag`');
    await queryRunner.query('DROP TABLE `follow`');
    await queryRunner.query('DROP INDEX `id_pg-tid` ON `payment`');
    await queryRunner.query('DROP TABLE `payment`');
    await queryRunner.query('DROP TABLE `payment_cancellation`');
    await queryRunner.query(
      'DROP INDEX `REL_9f823dc7c469bc50c123b06ad2` ON `refund_request`'
    );
    await queryRunner.query('DROP TABLE `refund_request`');
    await queryRunner.query('DROP INDEX `idx-createdAt` ON `point_event`');
    await queryRunner.query(
      'DROP INDEX `idx-orderItemMerchantUid` ON `point_event`'
    );
    await queryRunner.query('DROP TABLE `point_event`');
    await queryRunner.query(
      'DROP INDEX `idx-createdAt` ON `expected_point_event`'
    );
    await queryRunner.query(
      'DROP INDEX `idx-orderItemMerchantUid` ON `expected_point_event`'
    );
    await queryRunner.query('DROP TABLE `expected_point_event`');
    await queryRunner.query(
      'DROP INDEX `REL_7b8ec169516a3cd948e47f2116` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_0ba887a07aa531f6c5821950ec` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_20981b2b68bf03393c44dd1b9d` ON `order`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_86777bc5e52132792a38468161` ON `order`'
    );
    await queryRunner.query('DROP TABLE `order`');
    await queryRunner.query('DROP TABLE `order_vbank_receipt`');
    await queryRunner.query('DROP TABLE `order_refund_account`');
    await queryRunner.query('DROP TABLE `order_receiver`');
    await queryRunner.query('DROP TABLE `order_buyer`');
    await queryRunner.query(
      'DROP INDEX `REL_3f11f0bbd532d03ef4d9c44f41` ON `order_item`'
    );
    await queryRunner.query('DROP TABLE `order_item`');
    await queryRunner.query(
      'DROP INDEX `REL_51588d4e1b3a94cb09e0363d92` ON `exchange_request`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_0534dce1cf13b2fb7896022ca6` ON `exchange_request`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_5785dec92cf602ee8cf74df2ac` ON `exchange_request`'
    );
    await queryRunner.query('DROP TABLE `exchange_request`');
    await queryRunner.query('DROP TABLE `shipment_history`');
    await queryRunner.query('DROP INDEX `idx-status` ON `shipment`');
    await queryRunner.query('DROP TABLE `shipment`');
    await queryRunner.query('DROP TABLE `coupon`');
    await queryRunner.query('DROP TABLE `coupon_specification`');
    await queryRunner.query('DROP INDEX `idx-createdAt` ON `inquiry`');
    await queryRunner.query('DROP TABLE `inquiry`');
    await queryRunner.query('DROP TABLE `inquiry_answer`');
    await queryRunner.query('DROP INDEX `idx-createdAt` ON `cart_item`');
    await queryRunner.query('DROP TABLE `cart_item`');
    await queryRunner.query(
      'DROP INDEX `IDX_a250f330fcfa3c053ded264bc9` ON `items_package`'
    );
    await queryRunner.query('DROP INDEX `idx-code` ON `items_package`');
    await queryRunner.query('DROP TABLE `items_package`');
    await queryRunner.query('DROP TABLE `items_package_item`');
    await queryRunner.query('DROP TABLE `items_exhibition`');
    await queryRunner.query('DROP TABLE `items_exhibition_item`');
    await queryRunner.query('DROP TABLE `digests_exhibition`');
    await queryRunner.query('DROP TABLE `digests_exhibition_digest`');
    await queryRunner.query('DROP TABLE `video`');
    await queryRunner.query('DROP TABLE `own`');
    await queryRunner.query('DROP TABLE `look`');
    await queryRunner.query('DROP TABLE `look_image`');
    await queryRunner.query('DROP INDEX `idx-ownerId-userId` ON `like`');
    await queryRunner.query('DROP TABLE `like`');
    await queryRunner.query('DROP INDEX `idx-score` ON `keyword`');
    await queryRunner.query('DROP TABLE `keyword`');
    await queryRunner.query('DROP TABLE `keyword_class`');
    await queryRunner.query('DROP TABLE `digest`');
    await queryRunner.query(
      'DROP INDEX `IDX_0d933ba9421875f18a24b60abc` ON `courier`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_191d47572c6e09c1598ea39a64` ON `courier`'
    );
    await queryRunner.query('DROP INDEX `idx-code` ON `courier`');
    await queryRunner.query('DROP INDEX `idx-name` ON `courier`');
    await queryRunner.query('DROP TABLE `courier`');
    await queryRunner.query(
      'DROP INDEX `REL_f92f252d4204da3e245f0f2869` ON `seller_return_address`'
    );
    await queryRunner.query('DROP TABLE `seller_return_address`');
    await queryRunner.query(
      'DROP INDEX `REL_9eb9935015e8ba7813998c22f1` ON `seller_crawl_strategy`'
    );
    await queryRunner.query('DROP TABLE `seller_crawl_strategy`');
    await queryRunner.query(
      'DROP INDEX `REL_e9ac1e4f027925394d21a52308` ON `seller_shipping_policy`'
    );
    await queryRunner.query('DROP TABLE `seller_shipping_policy`');
    await queryRunner.query(
      'DROP INDEX `REL_ac3eaee0ae2dccf138a4a38d6c` ON `seller_settle_policy`'
    );
    await queryRunner.query('DROP TABLE `seller_settle_policy`');
    await queryRunner.query(
      'DROP INDEX `REL_edaf6fe777439339fd78e138df` ON `seller_settle_account`'
    );
    await queryRunner.query('DROP TABLE `seller_settle_account`');
    await queryRunner.query(
      'DROP INDEX `REL_fb16d9d0385fe3728ac1008b09` ON `seller_crawl_policy`'
    );
    await queryRunner.query('DROP TABLE `seller_crawl_policy`');
    await queryRunner.query(
      'DROP INDEX `REL_d37d7de46f3c7d0aa92fab64ce` ON `seller_claim_policy`'
    );
    await queryRunner.query('DROP TABLE `seller_claim_policy`');
    await queryRunner.query(
      'DROP INDEX `REL_e65d1104583c629a62d4ab81ec` ON `product`'
    );
    await queryRunner.query('DROP TABLE `product`');
    await queryRunner.query('DROP TABLE `product_shipping_reserve_policy`');
    await queryRunner.query(
      'DROP INDEX `IDX_d07bbc72c8822787efab782a6c` ON `item_category`'
    );
    await queryRunner.query('DROP TABLE `item_category`');
    await queryRunner.query('DROP TABLE `campaign`');
    await queryRunner.query('DROP TABLE `item_url`');
    await queryRunner.query('DROP TABLE `item_size_chart`');
    await queryRunner.query('DROP TABLE `item_sale_policy`');
    await queryRunner.query('DROP TABLE `item_price`');
    await queryRunner.query('DROP TABLE `item_option_value`');
    await queryRunner.query('DROP TABLE `item_option`');
    await queryRunner.query('DROP TABLE `item_detail_image`');
    await queryRunner.query(
      'DROP INDEX `REL_b035f04726e12394e3f1d9bb38` ON `item`'
    );
    await queryRunner.query('DROP INDEX `idx-providedCode` ON `item`');
    await queryRunner.query('DROP INDEX `idx-majorCategoryId:code` ON `item`');
    await queryRunner.query('DROP INDEX `idx-minorCategoryId:code` ON `item`');
    await queryRunner.query('DROP TABLE `item`');
    await queryRunner.query('DROP TABLE `brand`');
    await queryRunner.query(
      'DROP INDEX `REL_d89bdeef7b538af93c258d0a8b` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_b0ef5d00859256477eeefb25d3` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_277d5d0fb02ea335bb361b6d5c` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_0e0175c4cfd4fd8fc9ea06aacb` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_66be13247b9f98820ccb541af3` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_e2dea4bd18238e9ab6bd645c9e` ON `seller`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_af49645e98a3d39bd4f3591b33` ON `seller`'
    );
    await queryRunner.query('DROP TABLE `seller`');
    await queryRunner.query('DROP TABLE `item_property_value`');
    await queryRunner.query('DROP TABLE `item_property`');
    await queryRunner.query('DROP TABLE `digest_image`');
    await queryRunner.query('DROP INDEX `idx-ownerId:id` ON `comment`');
    await queryRunner.query('DROP TABLE `comment`');
    await queryRunner.query('DROP TABLE `shipping_address`');
    await queryRunner.query(
      'DROP INDEX `REL_4859a7a25f8209f14be8403fbb` ON `user`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_e2364281027b926b879fa2fa1e` ON `user`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_c5f78ad8f82e492c25d07f047a` ON `user`'
    );
    await queryRunner.query('DROP INDEX `idx-code` ON `user`');
    await queryRunner.query('DROP INDEX `idx-nickname` ON `user`');
    await queryRunner.query('DROP INDEX `idx-oauth_code` ON `user`');
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `style_tag`');
    await queryRunner.query('DROP TABLE `refund_account`');
    await queryRunner.query('DROP TABLE `step_execution_record`');
    await queryRunner.query(
      'DROP INDEX `REL_db11fb436072f887093856e50e` ON `job_execution_record`'
    );
    await queryRunner.query('DROP TABLE `job_execution_record`');
    await queryRunner.query('DROP TABLE `job`');
    await queryRunner.query('DROP TABLE `job_execution_context_record`');
    await queryRunner.query('DROP TABLE `sale_strategy`');
  }
}
