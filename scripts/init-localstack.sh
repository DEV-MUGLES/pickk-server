aws configure set aws_access_key_id "$ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$SECRET_ACCESS_KEY" &&
aws configure set region "$DEFAULT_REGION"

aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name main2main:update-item-image-url