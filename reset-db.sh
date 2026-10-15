#!/bin/sh
# Clears all data in cashy_db and loads seed.sql (tables are kept).
set -e

cd "$(dirname "$0")"

docker compose up -d

echo "Clearing data..."
docker exec -i cashy_postgres psql -v ON_ERROR_STOP=1 -U postgres -d cashy_db -c \
  "TRUNCATE users, categories, payment_methods, transactions, budgets, budget_categories, daily_budgets, goals, recurring_transactions, notifications, payments RESTART IDENTITY CASCADE"

echo "Loading seed.sql..."
docker exec -i cashy_postgres psql -v ON_ERROR_STOP=1 -q -U postgres -d cashy_db < seed.sql

echo "Done. Accounts (password: password): admin@cashy.com, alex@cashy.com, maria@cashy.com"
