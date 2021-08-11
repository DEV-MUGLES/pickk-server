aws configure set aws_access_key_id "$ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" &&
aws configure set region "$DEFAULT_REGION"

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name I2I-UPDATE_ITEM_IMAGE_URL
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name P2P-REMOVE_EXPECTED_POINT_EVENT
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name S2S-SCRAP_SELLER_ITEMS
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name S2I-PROCESS_SELLER_ITEMS_SCRAP_RESULT
