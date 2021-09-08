aws configure set aws_access_key_id "$ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" &&
aws configure set region "$DEFAULT_REGION"

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name I2I-UPDATE_ITEM_IMAGE_URL
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name I2I-UPDATE_ITEM_DETAIL_IMAGES
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name P2P-REMOVE_EXPECTED_POINT_EVENT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name S2S-SCRAP_SELLER_ITEMS
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name S2I-PROCESS_SELLER_ITEMS_SCRAP_RESULT

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name L2C-UPDATE_COMMENT_LIKE_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name L2D-UPDATE_DIGEST_LIKE_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name L2K-UPDATE_KEYWORD_LIKE_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name L2L-UPDATE_LOOK_LIKE_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name L2V-UPDATE_VIDEO_LIKE_COUNT

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name F2U-UPDATE_USER_FOLLOW_COUNT

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name O2O-UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name O2P-RESTORE_DEDUCTED_PRODUCT_STOCK

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name C2D-UPDATE_DIGEST_COMMENT_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name C2L-UPDATE_LOOK_COMMENT_COUNT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name C2V-UPDATE_VIDEO_COMMENT_COUNT

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name O2O_SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE