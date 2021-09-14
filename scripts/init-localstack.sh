aws configure set aws_access_key_id "$ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" &&
aws configure set region "$DEFAULT_REGION"

awslocal sqs create-queue --queue-name I2I-UPDATE_ITEM_IMAGE_URL_DEAD
awslocal sqs create-queue --queue-name I2I-UPDATE_ITEM_DETAIL_IMAGES_DEAD
awslocal sqs create-queue --queue-name P2P-REMOVE_EXPECTED_POINT_EVENT_DEAD
awslocal sqs create-queue --queue-name S2S-SCRAP_SELLER_ITEMS_DEAD
awslocal sqs create-queue --queue-name S2I-PROCESS_SELLER_ITEMS_SCRAP_RESULT_DEAD

awslocal sqs create-queue --queue-name L2C-UPDATE_COMMENT_LIKE_COUNT_DEAD
awslocal sqs create-queue --queue-name L2D-UPDATE_DIGEST_LIKE_COUNT_DEAD
awslocal sqs create-queue --queue-name L2K-UPDATE_KEYWORD_LIKE_COUNT_DEAD
awslocal sqs create-queue --queue-name L2L-UPDATE_LOOK_LIKE_COUNT_DEAD
awslocal sqs create-queue --queue-name L2V-UPDATE_VIDEO_LIKE_COUNT_DEAD

awslocal sqs create-queue --queue-name F2U-UPDATE_USER_FOLLOW_COUNT_DEAD

awslocal sqs create-queue --queue-name O2O-UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_DEAD

awslocal sqs create-queue --queue-name O2P-RESTORE_DEDUCTED_PRODUCT_STOCK_DEAD

awslocal sqs create-queue --queue-name C2D-UPDATE_DIGEST_COMMENT_COUNT_DEAD
awslocal sqs create-queue --queue-name C2L-UPDATE_LOOK_COMMENT_COUNT_DEAD
awslocal sqs create-queue --queue-name C2V-UPDATE_VIDEO_COMMENT_COUNT_DEAD

awslocal sqs create-queue --queue-name D2I-UPDATE_ITEM_DIGEST_STATISTICS_DEAD

awslocal sqs create-queue --queue-name O2O-SEND_CANCEL_ORDER_APPROVED_ALIMTALK_DEAD

awslocal sqs create-queue --queue-name I2O-PROCESS_VBANK_PAID_ORDER_DEAD

awslocal sqs create-queue --queue-name I2O-SEND_VBANK_PAID_ALIMTALK_DEAD
awslocal sqs create-queue --queue-name O2O-SEND_ORDER_COMPLETED_ALIMTALK_DEAD
awslocal sqs create-queue --queue-name O2O-SEND_REFUND_REQUESTED_ALIMTALK_DEAD
awslocal sqs create-queue --queue-name O2O-SEND_EXCHANGE_REQUESTED_ALIMTALK_DEAD
awslocal sqs create-queue --queue-name I2I-SEND_INQUIRY_ANSWERED_ALIMTALK_DEAD

awslocal sqs create-queue --queue-name I2I-SEND_INQUIRY_CREATION_SLACK_MESSAGE_DEAD
awslocal sqs create-queue --queue-name I2I-SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_DEAD
awslocal sqs create-queue --queue-name I2I-SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_DEAD

awslocal sqs create-queue --queue-name I2I-UPDATE_ITEM_IMAGE_URL --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-UPDATE_ITEM_IMAGE_URL_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name I2I-UPDATE_ITEM_DETAIL_IMAGES --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-UPDATE_ITEM_DETAIL_IMAGES_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name P2P-REMOVE_EXPECTED_POINT_EVENT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:P2P-REMOVE_EXPECTED_POINT_EVENT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name S2S-SCRAP_SELLER_ITEMS --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:S2S-SCRAP_SELLER_ITEMS_DEAD\",\"maxReceiveCount\":\"3\"}",  
}'
awslocal sqs create-queue --queue-name S2I-PROCESS_SELLER_ITEMS_SCRAP_RESULT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:S2I-PROCESS_SELLER_ITEMS_SCRAP_RESULT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name L2C-UPDATE_COMMENT_LIKE_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:L2C-UPDATE_COMMENT_LIKE_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name L2D-UPDATE_DIGEST_LIKE_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:L2D-UPDATE_DIGEST_LIKE_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name L2K-UPDATE_KEYWORD_LIKE_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:L2K-UPDATE_KEYWORD_LIKE_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name L2L-UPDATE_LOOK_LIKE_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:L2L-UPDATE_LOOK_LIKE_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name L2V-UPDATE_VIDEO_LIKE_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:L2V-UPDATE_VIDEO_LIKE_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name F2U-UPDATE_USER_FOLLOW_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:F2U-UPDATE_USER_FOLLOW_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name O2O-UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2O-UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name O2P-RESTORE_DEDUCTED_PRODUCT_STOCK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2P-RESTORE_DEDUCTED_PRODUCT_STOCK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name C2D-UPDATE_DIGEST_COMMENT_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:C2D-UPDATE_DIGEST_COMMENT_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name C2L-UPDATE_LOOK_COMMENT_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:C2L-UPDATE_LOOK_COMMENT_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name C2V-UPDATE_VIDEO_COMMENT_COUNT --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:C2V-UPDATE_VIDEO_COMMENT_COUNT_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name D2I-UPDATE_ITEM_DIGEST_STATISTICS --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:D2I-UPDATE_ITEM_DIGEST_STATISTICS_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name O2O-SEND_CANCEL_ORDER_APPROVED_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2O-SEND_CANCEL_ORDER_APPROVED_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name I2O-PROCESS_VBANK_PAID_ORDER --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2O-PROCESS_VBANK_PAID_ORDER_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

awslocal sqs create-queue --queue-name I2O-SEND_VBANK_PAID_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2O-SEND_VBANK_PAID_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name O2O-SEND_ORDER_COMPLETED_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2O-SEND_ORDER_COMPLETED_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name O2O-SEND_REFUND_REQUESTED_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2O-SEND_REFUND_REQUESTED_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name O2O-SEND_EXCHANGE_REQUESTED_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:O2O-SEND_EXCHANGE_REQUESTED_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name I2I-SEND_INQUIRY_ANSWERED_ALIMTALK --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-SEND_INQUIRY_ANSWERED_ALIMTALK_DEAD\",\"maxReceiveCount\":\"3\"}",  
}'

awslocal sqs create-queue --queue-name I2I-SEND_INQUIRY_CREATION_SLACK_MESSAGE --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-SEND_INQUIRY_CREATION_SLACK_MESSAGE_DEAD\",\"maxReceiveCount\":\"3\"}",  
}'
awslocal sqs create-queue --queue-name I2I-SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_DEAD\",\"maxReceiveCount\":\"3\"}",
}'
awslocal sqs create-queue --queue-name I2I-SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE --attributes '{
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-northeast-2:000000000000:I2I-SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_DEAD\",\"maxReceiveCount\":\"3\"}",
}'

