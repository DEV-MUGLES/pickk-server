docker-compose -f docker-compose.test.yml up -d

printf "Waiting for database launching"

while true;
do
  # wait for 1 seconds before check again
  sleep 1
  npm run typeorm migration:run &> /dev/null && exit 0;
  printf "."
done