#!/bin/bash

# Database connection string components
USERNAME="postgres"
PASSWORD="password"
HOST="localhost"
PORT="5432"
DBNAME="dbdb"

# Query to get all table names.
QUERY="SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';"

# Execute query and save the list of table names into a variable
TABLE_LIST=$(PGPASSWORD=$PASSWORD psql -U $USERNAME -h $HOST -p $PORT -d $DBNAME -t -c "$QUERY")

# Loop through each table name and drop it.
for table in $TABLE_LIST; do
  PGPASSWORD=$PASSWORD psql -U $USERNAME -h $HOST -p $PORT -d $DBNAME -c "DROP TABLE $table CASCADE;"
done
