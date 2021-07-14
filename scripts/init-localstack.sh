aws configure set aws_access_key_id "$LOCALSTACK_ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$LOCALSTACK_SECRET_ACCESS_KEY" &&
aws configure set region "$LOCALSTACK_REGION"